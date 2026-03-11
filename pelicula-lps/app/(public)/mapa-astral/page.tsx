import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import ChartWizard from "@/components/mapa-astral/ChartWizard";

export const metadata: Metadata = {
  title: "Mapa Astral — Descubra em qual casa do seu mapa o evento vai passar | Película Sideral",
  description:
    "Calcule seu mapa astral gratuitamente e descubra onde a pérola da semana aterrissa no seu mapa. Ferramenta gratuita da Película Sideral.",
  openGraph: {
    title: "Descubra onde o evento da semana cai no seu mapa | Película Sideral",
    description:
      "Calcule seu mapa astral e veja em qual casa da sua vida o evento astrológico da semana aterrissa. Ferramenta gratuita da Película Sideral.",
    type: "website",
  },
};

export default function MapaAstralPage() {
  return (
    <div data-theme="costar" className="bg-[#000000] text-white min-h-screen">
      <Script
        src="//widget.manychat.com/3069036_18c2e.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://mccdn.me/assets/js/widget.js"
        strategy="afterInteractive"
      />
      <Suspense>
        <ChartWizard />
      </Suspense>
    </div>
  );
}
