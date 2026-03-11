"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import FormStep from "./FormStep";
import LoadingStep from "./LoadingStep";
import ResultStep from "./ResultStep";
import type { Evento } from "@/lib/evento";

type Step = "form" | "loading" | "result";

interface ChartResult {
  ascendant: {
    sign: string;
    signKey: string;
    emoji: string;
    degree?: number;
  };
  planets: Array<{
    key: string;
    name: string;
    symbol: string;
    sign: string;
    signEmoji: string;
    signKey: string;
    degree: number;
    absDegree?: number;
    house: string;
    retrograde?: boolean;
  }>;
  houseCusps?: number[];
  svg?: string | null;
  eclipse: {
    house: number;
    theme: {
      title: string;
      keywords: string;
      description: string;
    };
    meta: {
      substackUrl: string;
      ctaTexto?: string;
      ctaPergunta?: string;
      headerLabel?: string;
    };
  };
  cached?: boolean;
}

export default function ChartWizard() {
  const searchParams = useSearchParams();
  const mcId = searchParams.get("mc_id") ?? "";
  const urlName = searchParams.get("name") ?? "";
  const urlIg = searchParams.get("ig") ?? "";
  const eventoSlug = searchParams.get("evento") ?? "";

  const [step, setStep] = useState<Step>("form");
  const [result, setResult] = useState<ChartResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState(urlName);
  const [manychatId, setManychatId] = useState(mcId);
  const [evento, setEvento] = useState<Evento | null>(null);
  const [eventoLoading, setEventoLoading] = useState(true);

  // Buscar evento ao montar o componente
  useEffect(() => {
    async function fetchEvento() {
      try {
        const url = eventoSlug
          ? `/api/eventos?slug=${encodeURIComponent(eventoSlug)}`
          : "/api/eventos";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setEvento(data);
        }
      } catch {
        // Silently fail — fallback to no evento
      } finally {
        setEventoLoading(false);
      }
    }
    fetchEvento();
  }, [eventoSlug]);

  async function handleSubmit(formData: {
    name: string;
    email: string;
    day: string;
    month: string;
    year: string;
    hour: string;
    minute: string;
    citySlug: string;
    instagram: string;
    manychatId: string;
  }) {
    setStep("loading");
    setError(null);
    setUserName(formData.name);
    setManychatId(formData.manychatId);

    try {
      const res = await fetch("/api/chart/birth-chart", {
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
          instagram: formData.instagram,
          manychatId: formData.manychatId,
          eventoSlug: evento?.slug ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao calcular mapa");
      }

      setResult(data);
      setStep("result");

      // Pixel X — evento de conversão (mapa calculado)
      try {
        const pxUrl = `${window.location.href}${window.location.search ? "&" : "?"}px_event=mapa_calculado`;
        const s = document.createElement("script");
        s.src = `https://pxa.peliculasideral.com.br/remote?url=${encodeURIComponent(pxUrl)}&title=${encodeURIComponent(document.title + " [CONVERSAO]")}&time=${Date.now()}`;
        s.async = true;
        document.head.appendChild(s);
      } catch {
        // silently ignore tracking errors
      }
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

  if (eventoLoading) {
    return (
      <div className="py-16 md:py-24 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded w-48 mx-auto mb-4" />
            <div className="h-8 bg-white/10 rounded w-64 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 px-6">
      {error && (
        <div className="max-w-md mx-auto mb-8 border border-red-400/20 bg-red-400/5 px-4 py-3 text-center">
          <p className="text-red-400/80 text-sm font-body">{error}</p>
        </div>
      )}

      {step === "form" && (
        <FormStep
          onSubmit={handleSubmit}
          isSubmitting={false}
          initialData={{
            name: urlName,
            instagram: urlIg,
            manychatId: mcId,
          }}
          evento={evento ? { titulo: evento.titulo, tipo: evento.tipo, signo: evento.signo } : null}
        />
      )}

      {step === "loading" && <LoadingStep />}

      {step === "result" && result && (
        <ResultStep data={result} onReset={handleReset} userName={userName} manychatId={manychatId} cached={result.cached} />
      )}
    </div>
  );
}
