import { NextRequest, NextResponse } from "next/server";
import { PreApproval } from "mercadopago";
import { getMPConfig } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { planSlug } = await request.json();
  if (!planSlug) {
    return NextResponse.json(
      { error: "planSlug is required" },
      { status: 400 }
    );
  }

  // Get plan (must be recurring)
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .neq("billing_period", "one_time")
    .single();

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Map billing period to MP frequency
  const frequencyMap: Record<string, { frequency: number; frequency_type: string }> = {
    monthly: { frequency: 1, frequency_type: "months" },
    yearly: { frequency: 12, frequency_type: "months" },
  };

  const freq = frequencyMap[plan.billing_period] || frequencyMap.monthly;

  try {
    const preApproval = new PreApproval(getMPConfig());
    const result = await preApproval.create({
      body: {
        reason: plan.name,
        external_reference: JSON.stringify({
          userId: user.id,
          planId: plan.id,
          type: "subscription",
        }),
        payer_email: user.email!,
        auto_recurring: {
          frequency: freq.frequency,
          frequency_type: freq.frequency_type,
          transaction_amount: plan.price_cents / 100,
          currency_id: "BRL",
        },
        back_url: `${appUrl}/checkout/sucesso`,
        status: "pending",
      },
    });

    // Save subscription record
    await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan_id: plan.id,
      mp_subscription_id: result.id,
      status: "pending",
    });

    return NextResponse.json({
      init_point: result.init_point,
      subscription_id: result.id,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
