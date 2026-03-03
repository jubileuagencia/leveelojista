import type { HouseTheme } from "@/lib/eclipse-data";

interface EclipseCardProps {
  house: number;
  theme: HouseTheme;
  substackUrl: string;
}

export default function EclipseCard({ house, theme, substackUrl }: EclipseCardProps) {
  return (
    <div className="border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <div className="text-center mb-6">
        <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/30">
          Eclipse Lunar 03/03/2026
        </span>
        <h3 className="font-display text-xl md:text-2xl text-white/90 mt-2">
          Casa {house} — {theme.title}
        </h3>
        <p className="font-mono text-[0.6rem] tracking-[2px] uppercase text-white/30 mt-2">
          {theme.keywords}
        </p>
      </div>

      <p className="text-white/60 text-sm leading-relaxed font-body text-center mb-8">
        {theme.description}
      </p>

      <div className="text-center">
        <p className="font-mono text-[0.6rem] tracking-[3px] uppercase text-white/40 mb-4">
          Quer a análise completa do eclipse no seu mapa?
        </p>
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-mono text-center tracking-[2px] uppercase transition-all duration-300 px-12 py-4 text-xs md:text-sm bg-white text-black hover:bg-gray-200 active:bg-gray-300"
        >
          Ler a aula no Substack
        </a>
      </div>
    </div>
  );
}
