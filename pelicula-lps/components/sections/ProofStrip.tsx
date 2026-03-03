const STATS = [
  { value: "23", label: "Videoaulas" },
  { value: "6", label: "Módulos progressivos" },
  { value: "~2h", label: "De conteúdo" },
  { value: "5", label: "Camadas da mandala" },
  { value: "3", label: "Formas que decodificam tudo" },
];

export default function ProofStrip() {
  return (
    <section className="py-12 md:py-16 section-alt border-y border-white/5">
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {STATS.map((stat) => (
            <div key={stat.label} className="fade-in text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
