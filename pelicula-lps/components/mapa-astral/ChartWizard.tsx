"use client";

import { useState } from "react";
import FormStep from "./FormStep";
import LoadingStep from "./LoadingStep";
import ResultStep from "./ResultStep";

type Step = "form" | "loading" | "result";

interface ChartResult {
  ascendant: {
    sign: string;
    signKey: string;
    emoji: string;
  };
  planets: Array<{
    key: string;
    name: string;
    symbol: string;
    sign: string;
    signEmoji: string;
    signKey: string;
    degree: number;
    house: string;
  }>;
  eclipse: {
    house: number;
    theme: {
      title: string;
      keywords: string;
      description: string;
    };
    meta: {
      substackUrl: string;
    };
  };
}

export default function ChartWizard() {
  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: {
    name: string;
    email: string;
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    citySlug: string;
  }) {
    setStep("loading");
    setError(null);

    try {
      const res = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          day: Number(formData.day),
          month: Number(formData.month),
          year: Number(formData.year),
          hour: Number(formData.hour),
          minute: Number(formData.minute),
          citySlug: formData.citySlug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao calcular mapa");
      }

      setResult(data);
      setStep("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
      setStep("form");
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setStep("form");
  }

  return (
    <div className="py-16 md:py-24 px-6">
      {error && (
        <div className="max-w-md mx-auto mb-8 border border-red-400/20 bg-red-400/5 px-4 py-3 text-center">
          <p className="text-red-400/80 text-sm font-body">{error}</p>
        </div>
      )}

      {step === "form" && (
        <FormStep onSubmit={handleSubmit} isSubmitting={false} />
      )}

      {step === "loading" && <LoadingStep />}

      {step === "result" && result && (
        <ResultStep data={result} onReset={handleReset} />
      )}
    </div>
  );
}
