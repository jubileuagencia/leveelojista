import type { Metadata } from "next";
import Starfield from "@/components/effects/Starfield";
import Hero from "@/components/sections/Hero";
import PainPoints from "@/components/sections/PainPoints";
import Reframe from "@/components/sections/Reframe";
import Differentiator from "@/components/sections/Differentiator";
import FiveLayers from "@/components/sections/FiveLayers";
import ProofStrip from "@/components/sections/ProofStrip";
import SocialProof from "@/components/sections/SocialProof";
import Curriculum from "@/components/sections/Curriculum";
import ForWhom from "@/components/sections/ForWhom";
import Instructor from "@/components/sections/Instructor";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

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

export default function DecifrandoPage() {
  return (
    <>
      <Starfield />
      <div className="relative z-[1]">
        <Hero />
        <PainPoints />
        <Reframe />
        <Differentiator />
        <FiveLayers />
        <ProofStrip />
        <SocialProof />
        <ForWhom />
        <Curriculum />
        <Instructor />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </div>
    </>
  );
}
