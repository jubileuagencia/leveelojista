import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
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

  // Get plan
  const { data: plan } = await supabase
    .from("plans")
    .select("*")
    .eq("slug", planSlug)
    .eq("is_active", true)
    .eq("billing_period", "one_time")
    .single();

  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const preference = new Preference(getMPConfig());
    const result = await preference.create({
      body: {
        items: [
          {
            id: plan.id,
            title: plan.name,
            description: plan.description || "",
            quantity: 1,
            unit_price: plan.price_cents / 100,
            currency_id: "BRL",
          },
        ],
        payer: {
          email: user.email!,
          name: profile?.full_name || undefined,
        },
        back_urls: {
          success: `${appUrl}/checkout/sucesso`,
          failure: `${appUrl}/checkout?error=payment_failed`,
          pending: `${appUrl}/checkout?status=pending`,
        },
        auto_return: "approved",
        external_reference: JSON.stringify({
          userId: user.id,
          planId: plan.id,
          type: "one_time",
        }),
        notification_url: `${appUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "PELICULA SIDERAL",
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creating preference:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
