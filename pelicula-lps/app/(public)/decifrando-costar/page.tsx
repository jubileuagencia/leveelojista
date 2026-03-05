import type { Metadata } from "next";
import CostarHero from "@/components/sections/costar/CostarHero";
import CostarPainPoints from "@/components/sections/costar/CostarPainPoints";
import CostarReframe from "@/components/sections/costar/CostarReframe";
import CostarDifferentiator from "@/components/sections/costar/CostarDifferentiator";
import CostarFiveLayers from "@/components/sections/costar/CostarFiveLayers";
import CostarProofStrip from "@/components/sections/costar/CostarProofStrip";
import CostarSocialProof from "@/components/sections/costar/CostarSocialProof";
import CostarForWhom from "@/components/sections/costar/CostarForWhom";
import CostarCurriculum from "@/components/sections/costar/CostarCurriculum";
import CostarInstructor from "@/components/sections/costar/CostarInstructor";
import CostarPricing from "@/components/sections/costar/CostarPricing";
import CostarFAQ from "@/components/sections/costar/CostarFAQ";
import CostarFinalCTA from "@/components/sections/costar/CostarFinalCTA";

export const metadata: Metadata = {
  title: "Decifrando o Mapa Astral | Película Sideral",
  description:
    "Aprenda a ler qualquer mapa astral com o método das 5 camadas. De confusão total a leitor competente em 23 aulas. Curso por Victor, criador da Película Sideral.",
  openGraph: {
    title: "Decifrando o Mapa Astral | Película Sideral",
    description:
      "O mapa astral não é mistério. É um diagrama em camadas. E diagramas se aprendem a ler.",
    type: "website",
  },
};

export default function DecifrandoCostarPage() {
  return (
    <div data-theme="costar" className="bg-[#000000] text-white min-h-screen">
      <CostarHero />
      <CostarPainPoints />
      <CostarReframe />
      <CostarDifferentiator />
      <CostarFiveLayers />
      <CostarProofStrip />
      <CostarSocialProof />
      <CostarForWhom />
      <CostarCurriculum />
      <CostarInstructor />
      <CostarPricing />
      <CostarFAQ />
      <CostarFinalCTA />
    </div>
  );
}
