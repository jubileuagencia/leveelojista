"use client";

import { useEffect, useRef } from "react";
import PlanetRow from "./PlanetRow";
import EclipseCard from "./EclipseCard";
import type { HouseTheme } from "@/lib/eclipse-data";

interface PlanetData {
  key: string;
  name: string;
  symbol: string;
  sign: string;
  signEmoji: string;
  signKey: string;
  degree: number;
  house: string;
}

interface ResultData {
  ascendant: {
    sign: string;
    signKey: string;
    emoji: string;
  };
  planets: PlanetData[];
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

export default function ResultStep({ data, onReset, userName, manychatId, cached }: ResultStepProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

      {/* Planet Positions */}
      <div className="fade-in">
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

      {/* Eclipse Card */}
      <div className="fade-in">
        <div className="text-center mb-6">
          <span className="font-mono text-[0.55rem] tracking-[5px] uppercase text-white/50">
            Eclipse lunar no seu mapa
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
