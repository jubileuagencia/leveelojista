import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Reframe() {
  return (
    <SectionWrapper narrow>
      <div className="fade-in text-center py-8 md:py-12">
        <blockquote className="font-display text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          <span className="text-gold-light">&ldquo;O mapa astral não é o céu.</span>
          <br />
          <span className="text-text">
            É um diagrama. E diagramas
          </span>
          <br />
          <span className="text-text">se aprendem a ler.&rdquo;</span>
        </blockquote>
        <p className="font-mono text-xs tracking-[3px] uppercase text-text-muted mt-6">
          — Premissa central do curso
        </p>
      </div>
    </SectionWrapper>
  );
}
