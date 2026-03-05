"use client";

import type { HouseTheme } from "@/lib/eclipse-data";

declare global {
  interface Window {
    pixel_x_app?: {
      send_event: (data: Record<string, unknown>) => Promise<void>;
    };
  }
}

interface EclipseCardProps {
  house: number;
  theme: HouseTheme;
  substackUrl: string;
  manychatId?: string;
}

const MANYCHAT_TAG_FOI_PRA_AULA = 82561173;

export default function EclipseCard({ house, theme, substackUrl, manychatId }: EclipseCardProps) {
  function handleSubstackClick() {
    if (window.pixel_x_app) {
      window.pixel_x_app.send_event({
        event_name: "ViewContent",
        page_title: "Mapa Astral",
        content_name: "aula camarim",
        currency: "BRL",
      });
    }

    // Tag ManyChat subscriber as "foi-pra-aula"
    if (manychatId) {
      fetch("/api/manychat-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriber_id: manychatId,
          tag_id: MANYCHAT_TAG_FOI_PRA_AULA,
        }),
      }).catch(() => {});
    }
  }

  return (
    <div className="border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
      <div className="text-center mb-6">
        <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
          Eclipse Lunar 03/03/2026
        </span>
        <h3 className="font-display text-xl md:text-2xl text-white/90 mt-2">
          Casa {house} — {theme.title}
        </h3>
        <p className="font-mono text-[0.6rem] tracking-[2px] uppercase text-white/50 mt-2">
          {theme.keywords}
        </p>
      </div>

      <p className="text-white/70 text-sm leading-relaxed font-body text-center mb-8">
        {theme.description}
      </p>

      <div className="text-center">
        <p className="font-mono text-[0.6rem] tracking-[3px] uppercase text-white/60 mb-4">
          Quer a análise completa do eclipse no seu mapa?
        </p>
        <a
          id="qjmvqdrucuskfuwxegfc"
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSubstackClick}
          className="inline-block font-mono text-center tracking-[2px] uppercase transition-all duration-300 px-12 py-4 text-xs md:text-sm bg-white text-black hover:bg-gray-200 active:bg-gray-300"
        >
          Ler a aula no Substack
        </a>
      </div>
    </div>
  );
}
