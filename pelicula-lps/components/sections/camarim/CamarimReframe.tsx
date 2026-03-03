import SectionWrapper from "@/components/ui/SectionWrapper";

export default function CamarimReframe() {
  return (
    <SectionWrapper narrow>
      <div className="fade-in text-center py-8 md:py-12">
        <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          <span className="text-gold">&ldquo;Astrologia se aprende lendo.</span>
          <br />
          <span className="text-text">
            Mas se aprofunda
          </span>
          <br />
          <span className="text-text">em comunidade.&rdquo;</span>
        </blockquote>
        <p className="font-mono text-xs tracking-[3px] uppercase text-text-muted mt-6">
          — A premissa do Camarim Sideral
        </p>
      </div>
    </SectionWrapper>
  );
}
