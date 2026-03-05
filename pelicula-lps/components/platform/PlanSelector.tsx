"use client";

import { useState } from "react";
import CheckoutButton from "./CheckoutButton";

export type PlanData = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  billing_period: "one_time" | "monthly" | "yearly";
};

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function billingLabel(period: string) {
  if (period === "monthly") return "/mês";
  if (period === "yearly") return "/ano";
  return " (pagamento único)";
}

function installmentText(cents: number, period: string) {
  if (period === "one_time") {
    const installment = cents / 100 / 12;
    return `ou 12x de ${installment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
  }
  return null;
}

export default function PlanSelector({ plans }: { plans: PlanData[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Sort: monthly first, then one_time, then yearly
  const sortOrder = { monthly: 0, one_time: 1, yearly: 2 };
  const sorted = [...plans].sort(
    (a, b) => (sortOrder[a.billing_period] ?? 9) - (sortOrder[b.billing_period] ?? 9)
  );

  // Mark best value
  const bestValue = sorted.find((p) => p.billing_period === "yearly")?.slug;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sorted.map((plan) => {
          const isSelected = selectedSlug === plan.slug;
          const isBest = plan.slug === bestValue;

          return (
            <button
              key={plan.id}
              onClick={() => setSelectedSlug(plan.slug)}
              className={`relative text-left p-6 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-gold bg-gold/5"
                  : "border-white/10 bg-card hover:border-white/20"
              }`}
            >
              {isBest && (
                <span className="absolute -top-3 left-4 bg-gold text-void text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Melhor valor
                </span>
              )}

              <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-text">
                {plan.name}
              </h3>

              {plan.description && (
                <p className="text-text-muted text-sm mt-2 min-h-[2.5rem]">
                  {plan.description}
                </p>
              )}

              <div className="mt-4">
                <span className="text-2xl font-bold text-gold">
                  {formatPrice(plan.price_cents)}
                </span>
                <span className="text-text-muted text-sm">
                  {billingLabel(plan.billing_period)}
                </span>
              </div>

              {installmentText(plan.price_cents, plan.billing_period) && (
                <p className="text-text-muted text-xs mt-1">
                  {installmentText(plan.price_cents, plan.billing_period)}
                </p>
              )}

              {/* Selection indicator */}
              <div
                className={`mt-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-gold" : "border-white/20"
                }`}
              >
                {isSelected && (
                  <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedSlug && (
        <div className="flex justify-center">
          <CheckoutButton planSlug={selectedSlug} plans={sorted} />
        </div>
      )}
    </div>
  );
}
