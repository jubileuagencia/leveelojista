import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import ChartWizard from "@/components/mapa-astral/ChartWizard";

export const metadata: Metadata = {
  title: "Mapa Astral — Descubra seu Ascendente | Película Sideral",
  description:
    "Calcule seu mapa astral gratuitamente e descubra seu ascendente. Veja onde o Eclipse Lunar de 03/03/2026 cai no seu mapa.",
  openGraph: {
    title: "Descubra seu Ascendente | Película Sideral",
    description:
      "Calcule seu mapa astral e veja onde o Eclipse Lunar cai nas suas casas. Ferramenta gratuita da Película Sideral.",
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
