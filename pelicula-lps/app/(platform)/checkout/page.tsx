import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PlanSelector from "@/components/platform/PlanSelector";
import type { PlanData } from "@/components/platform/PlanSelector";

export const metadata: Metadata = {
  title: "Checkout — Película Sideral",
  robots: "noindex",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const { error, status } = await searchParams;
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("id, slug, name, description, price_cents, billing_period")
    .eq("is_active", true)
    .order("price_cents", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-text mb-2">
        Escolha seu plano
      </h1>
      <p className="text-text-muted mb-8">
        Selecione o plano ideal para você e comece a estudar agora.
      </p>

      {error === "payment_failed" && (
        <div className="bg-aspect-red/10 border border-aspect-red/30 rounded-xl p-4 text-sm text-aspect-red mb-6">
          O pagamento não foi concluído. Tente novamente ou escolha outro método
          de pagamento.
        </div>
      )}

      {status === "pending" && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 text-sm text-gold mb-6">
          Seu pagamento está sendo processado. Você receberá acesso assim que
          for confirmado.
        </div>
      )}

      {plans && plans.length > 0 ? (
        <PlanSelector plans={plans as PlanData[]} />
      ) : (
        <div className="text-center py-16 text-text-muted">
          <p>Nenhum plano disponível no momento.</p>
        </div>
      )}
    </div>
  );
}
