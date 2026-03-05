import { NextRequest, NextResponse } from "next/server";
import { Payment as MPPayment, PreApproval } from "mercadopago";
import { getMPConfig } from "@/lib/mercadopago";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Use service role client — webhooks have no user session
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ServiceClient = SupabaseClient<any, any, any>;

function verifyWebhookSignature(
  request: NextRequest,
  body: string
): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret configured

  const xSignature = request.headers.get("x-signature");
  const xRequestId = request.headers.get("x-request-id");

  if (!xSignature || !xRequestId) return false;

  // Parse x-signature header: "ts=...,v1=..."
  const parts = Object.fromEntries(
    xSignature.split(",").map((p) => {
      const [key, ...val] = p.split("=");
      return [key.trim(), val.join("=").trim()];
    })
  );

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  // Extract data.id from query params
  const dataId = new URL(request.url).searchParams.get("data.id") || "";

  // Build manifest string
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return hmac === v1;
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verify HMAC signature
  if (!verifyWebhookSignature(request, body)) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { type?: string; action?: string; data?: { id?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, action, data } = payload;
  const resourceId = data?.id;

  if (!resourceId) {
    return NextResponse.json({ ok: true }); // Ignore test pings
  }

  const supabase = getServiceClient();

  try {
    // Handle payment notifications
    if (type === "payment") {
      await handlePayment(resourceId, supabase);
    }

    // Handle subscription (preapproval) notifications
    if (type === "subscription_preapproval" || action?.includes("preapproval")) {
      await handleSubscription(resourceId, supabase);
    }
  } catch (error) {
    console.error(`Webhook error for ${type}/${resourceId}:`, error);
    // Return 200 to prevent MP from retrying indefinitely
    return NextResponse.json({ error: "Processing failed" }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}

async function handlePayment(
  paymentId: string,
  supabase: ServiceClient
) {
  const mpPayment = new MPPayment(getMPConfig());
  const payment = await mpPayment.get({ id: paymentId });

  if (!payment || !payment.external_reference) return;

  let ref: { userId: string; planId: string; type: string };
  try {
    ref = JSON.parse(payment.external_reference);
  } catch {
    console.error("Invalid external_reference:", payment.external_reference);
    return;
  }

  const statusMap: Record<string, string> = {
    approved: "approved",
    pending: "pending",
    authorized: "approved",
    in_process: "pending",
    in_mediation: "pending",
    rejected: "rejected",
    cancelled: "cancelled",
    refunded: "refunded",
    charged_back: "refunded",
  };

  const mappedStatus = statusMap[payment.status || ""] || "pending";

  // Upsert payment record
  await supabase.from("payments").upsert(
    {
      user_id: ref.userId,
      plan_id: ref.planId,
      mp_payment_id: paymentId,
      amount_cents: Math.round((payment.transaction_amount || 0) * 100),
      status: mappedStatus,
      payment_method: payment.payment_type_id || null,
      mp_status_detail: payment.status_detail || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "mp_payment_id" }
  );

  // Grant access on approved payment
  if (mappedStatus === "approved" && ref.type === "one_time") {
    await grantAccess(ref.userId, ref.planId, supabase, {
      granted_by: "payment",
    });
  }

  // Revoke on refund
  if (mappedStatus === "refunded") {
    await revokeAccess(ref.userId, ref.planId, supabase);
  }
}

async function handleSubscription(
  preapprovalId: string,
  supabase: ServiceClient
) {
  const preApproval = new PreApproval(getMPConfig());
  const sub = await preApproval.get({ id: preapprovalId });

  if (!sub || !sub.external_reference) return;

  let ref: { userId: string; planId: string };
  try {
    ref = JSON.parse(sub.external_reference);
  } catch {
    return;
  }

  const statusMap: Record<string, string> = {
    authorized: "authorized",
    pending: "pending",
    paused: "paused",
    cancelled: "cancelled",
    expired: "expired",
  };

  const mappedStatus = statusMap[sub.status || ""] || "pending";

  // Update subscription record
  await supabase
    .from("subscriptions")
    .update({
      status: mappedStatus,
      mp_subscription_id: preapprovalId,
      current_period_start: sub.next_payment_date
        ? new Date().toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("mp_subscription_id", preapprovalId);

  // Grant access on authorized
  if (mappedStatus === "authorized") {
    // Calculate expiry based on plan billing period
    const { data: plan } = await supabase
      .from("plans")
      .select("billing_period")
      .eq("id", ref.planId)
      .single();

    const expiresAt = new Date();
    if (plan?.billing_period === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }
    // Add 3-day grace period
    expiresAt.setDate(expiresAt.getDate() + 3);

    await grantAccess(ref.userId, ref.planId, supabase, {
      granted_by: "subscription",
      expires_at: expiresAt.toISOString(),
    });
  }

  // Revoke on cancelled/expired
  if (["cancelled", "expired"].includes(mappedStatus)) {
    await revokeAccess(ref.userId, ref.planId, supabase);
  }
}

async function grantAccess(
  userId: string,
  planId: string,
  supabase: ServiceClient,
  options: { granted_by: string; expires_at?: string }
) {
  // Get courses linked to this plan
  const { data: planCourses } = await supabase
    .from("plan_courses")
    .select("course_id")
    .eq("plan_id", planId);

  if (!planCourses) return;

  for (const pc of planCourses) {
    await supabase.from("user_course_access").upsert(
      {
        user_id: userId,
        course_id: pc.course_id,
        granted_by: options.granted_by,
        expires_at: options.expires_at || null,
      },
      { onConflict: "user_id,course_id" }
    );
  }
}

async function revokeAccess(
  userId: string,
  planId: string,
  supabase: ServiceClient
) {
  const { data: planCourses } = await supabase
    .from("plan_courses")
    .select("course_id")
    .eq("plan_id", planId);

  if (!planCourses) return;

  for (const pc of planCourses) {
    await supabase
      .from("user_course_access")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", pc.course_id);
  }
}
