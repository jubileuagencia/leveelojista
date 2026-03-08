"use client";

import { useEffect, useRef, useState } from "react";
import PlanetRow from "./PlanetRow";
import EclipseCard from "./EclipseCard";
import ChartSVGEmbed from "./ChartSVGEmbed";
import NatalChart from "./NatalChart";
import type { HouseTheme } from "@/lib/eclipse-data";

interface PlanetData {
  key: string;
  name: string;
  symbol: string;
  sign: string;
  signEmoji: string;
  signKey: string;
  degree: number;
  absDegree?: number;
  house: string;
  retrograde?: boolean;
}

interface ResultData {
  ascendant: {
    sign: string;
    signKey: string;
    emoji: string;
    degree?: number;
  };
  planets: PlanetData[];
  houseCusps?: number[];
  svg?: string | null;
  eclipse: {
    house: number;
    theme: HouseTheme;
    meta: {
      substackUrl: string;
    };
  };
}

interface ResultStepProps {
  data: ResultData;
  onReset: () => void;
  userName?: string;
  manychatId?: string;
  cached?: boolean;
}

type ViewMode = "mandala" | "interativa" | "tabela";

const hasPlanetData = (planets: PlanetData[]) =>
  planets.some((p) => p.absDegree !== undefined && p.absDegree > 0);

export default function ResultStep({ data, onReset, userName, manychatId, cached }: ResultStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInteractive = hasPlanetData(data.planets);
  const [viewMode, setViewMode] = useState<ViewMode>(
    hasInteractive ? "interativa" : data.svg ? "mandala" : "tabela"
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeEls = el.querySelectorAll(".fade-in");
    fadeEls.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="max-w-lg mx-auto space-y-12">
      {/* Cached notice */}
      {cached && (
        <div className="fade-in text-center border border-white/10 bg-white/[0.03] px-6 py-4">
          <span className="font-mono text-[0.55rem] tracking-[3px] uppercase text-white/60">
            Mapa recuperado
          </span>
          <p className="text-white/50 text-sm font-body mt-1">
            {userName
              ? `${userName}, já tínhamos seu mapa astral salvo!`
              : "Já encontramos seu mapa astral no nosso banco de dados!"}
          </p>
        </div>
      )}

      {/* Ascendant Hero */}
      <div className="fade-in text-center">
        <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
          Seu ascendente
        </span>
        <div className="mt-4 mb-2">
          <span className="text-6xl md:text-7xl">{data.ascendant.emoji}</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-white/90">
          {data.ascendant.sign}
        </h2>
        <p className="text-white/60 text-sm font-body mt-2">
          {userName
            ? `Seu ascendente é ${data.ascendant.sign}, ${userName}!`
            : "A lente através da qual o mundo te vê"}
        </p>
      </div>

      {/* Mandala SVG / Planet Positions with Toggle */}
      <div className="fade-in">
        {/* View mode toggle */}
        {(data.svg || hasInteractive) && (
          <div className="flex justify-center gap-1 mb-6">
            {hasInteractive && (
              <button
                type="button"
                onClick={() => setViewMode("interativa")}
                className={`font-mono text-[0.6rem] tracking-[2px] uppercase px-4 py-2 transition-colors border ${
                  viewMode === "interativa"
                    ? "text-white/90 border-white/20 bg-white/[0.06]"
                    : "text-white/40 border-white/[0.06] hover:text-white/60 hover:border-white/10"
                }`}
              >
                Mandala
              </button>
            )}
            {data.svg && (
              <button
                type="button"
                onClick={() => setViewMode("mandala")}
                className={`font-mono text-[0.6rem] tracking-[2px] uppercase px-4 py-2 transition-colors border ${
                  viewMode === "mandala"
                    ? "text-white/90 border-white/20 bg-white/[0.06]"
                    : "text-white/40 border-white/[0.06] hover:text-white/60 hover:border-white/10"
                }`}
              >
                {hasInteractive ? "Clássica" : "Mandala"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode("tabela")}
              className={`font-mono text-[0.6rem] tracking-[2px] uppercase px-4 py-2 transition-colors border ${
                viewMode === "tabela"
                  ? "text-white/90 border-white/20 bg-white/[0.06]"
                  : "text-white/40 border-white/[0.06] hover:text-white/60 hover:border-white/10"
              }`}
            >
              Tabela
            </button>
          </div>
        )}

        {/* Interactive NatalChart View */}
        {viewMode === "interativa" && hasInteractive && (
          <div>
            <div className="text-center mb-6">
              <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
                Mapa natal
              </span>
            </div>
            <NatalChart
              planets={data.planets}
              houseCusps={data.houseCusps}
              ascendantDegree={data.ascendant.degree}
              size={420}
              interactive
              showAspects
            />
          </div>
        )}

        {/* API SVG View */}
        {viewMode === "mandala" && data.svg && (
          <div>
            <div className="text-center mb-6">
              <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
                Mapa natal — visualização clássica
              </span>
            </div>
            <ChartSVGEmbed svg={data.svg} />
          </div>
        )}

        {/* Table View */}
        {viewMode === "tabela" && (
          <div>
            <div className="text-center mb-6">
              <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
                Posições planetárias
              </span>
            </div>
            <div className="border border-white/[0.06] bg-white/[0.01] p-4 md:p-6">
              {data.planets.map((planet) => (
                <PlanetRow
                  key={planet.key}
                  symbol={planet.symbol}
                  name={planet.name}
                  sign={planet.sign}
                  signEmoji={planet.signEmoji}
                  degree={planet.degree}
                  house={planet.house}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Eclipse Card */}
      <div className="fade-in">
        <div className="text-center mb-6">
          <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
            Evento da semana no seu mapa
          </span>
        </div>
        <EclipseCard
          house={data.eclipse.house}
          theme={data.eclipse.theme}
          substackUrl={data.eclipse.meta.substackUrl}
          manychatId={manychatId}
        />
      </div>

      {/* Reset */}
      <div className="fade-in text-center pt-4">
        <button
          type="button"
          onClick={onReset}
          className="font-mono text-[0.65rem] tracking-[2px] uppercase text-white/50 hover:text-white/80 transition-colors border-b border-white/15 hover:border-white/40 pb-0.5"
        >
          Calcular outro mapa
        </button>
      </div>
    </div>
  );
}
