import type { Metadata } from "next";
import CamarimHero from "@/components/sections/camarim/CamarimHero";
import CamarimPainPoints from "@/components/sections/camarim/CamarimPainPoints";
import CamarimReframe from "@/components/sections/camarim/CamarimReframe";
import CamarimDifferentiator from "@/components/sections/camarim/CamarimDifferentiator";
import CamarimFeatures from "@/components/sections/camarim/CamarimFeatures";
import CamarimProofStrip from "@/components/sections/camarim/CamarimProofStrip";
import CamarimSocialProof from "@/components/sections/camarim/CamarimSocialProof";
import CamarimForWhom from "@/components/sections/camarim/CamarimForWhom";
import CamarimContent from "@/components/sections/camarim/CamarimContent";
import CamarimInstructor from "@/components/sections/camarim/CamarimInstructor";
import CamarimPricing from "@/components/sections/camarim/CamarimPricing";
import CamarimFAQ from "@/components/sections/camarim/CamarimFAQ";
import CamarimFinalCTA from "@/components/sections/camarim/CamarimFinalCTA";

export const metadata: Metadata = {
  title: "Camarim Sideral — Astrologia na prática, toda semana | Película Sideral",
  description:
    "Lives semanais com Victor, conteúdo exclusivo e uma comunidade que pratica astrologia de verdade. A partir de R$19/mês.",
  openGraph: {
    title: "Camarim Sideral | Película Sideral",
    description:
      "O céu muda toda semana. Sua leitura também. Entre no Camarim Sideral.",
    type: "website",
  },
};

export default function CamarimPage() {
  return (
    <>
      <CamarimHero />
      <CamarimPainPoints />
      <CamarimReframe />
      <CamarimDifferentiator />
      <CamarimFeatures />
      <CamarimProofStrip />
      <CamarimSocialProof />
      <CamarimForWhom />
      <CamarimContent />
      <CamarimInstructor />
      <CamarimPricing />
      <CamarimFAQ />
      <CamarimFinalCTA />
    </>
  );
}
