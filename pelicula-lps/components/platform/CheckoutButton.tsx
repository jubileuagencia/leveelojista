"use client";

import { useState } from "react";
import type { PlanData } from "./PlanSelector";

export default function CheckoutButton({
  planSlug,
  plans,
}: {
  planSlug: string;
  plans: PlanData[];
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = plans.find((p) => p.slug === planSlug);
  if (!plan) return null;

  const isSubscription = plan.billing_period !== "one_time";

  async function handleCheckout() {
    setLoading(true);
    setError("");

    const endpoint = isSubscription
      ? "/api/payments/create-subscription"
      : "/api/payments/create-preference";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planSlug }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      const data = await res.json();
      const redirectUrl = data.init_point || data.sandbox_init_point;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        throw new Error("URL de pagamento não recebida");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao processar pagamento"
      );
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {error && (
        <div className="bg-aspect-red/10 border border-aspect-red/30 rounded-lg p-3 text-sm text-aspect-red mb-4 text-center">
          {error}
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gold hover:bg-gold-light text-void font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processando...
          </span>
        ) : isSubscription ? (
          "Assinar agora"
        ) : (
          "Comprar agora"
        )}
      </button>
      <p className="text-text-muted text-xs text-center mt-3">
        Pagamento seguro via Mercado Pago. PIX, cartão de crédito ou boleto.
      </p>
    </div>
  );
}
