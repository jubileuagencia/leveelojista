"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Consultando as efemérides...",
  "Mapeando as posições planetárias...",
  "Calculando as casas astrológicas...",
  "Identificando seu ascendente...",
  "Localizando o eclipse no seu mapa...",
];

export default function LoadingStep() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-12">
      {/* Orbital rings */}
      <div className="relative w-40 h-40">
        {/* Outer ring */}
        <div
          className="absolute inset-0 border border-white/10 rounded-full"
          style={{ animation: "spin 12s linear infinite" }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-4 border border-white/15 rounded-full"
          style={{ animation: "spin 8s linear infinite reverse" }}
        />
        {/* Inner ring */}
        <div
          className="absolute inset-8 border border-white/20 rounded-full"
          style={{ animation: "spin 5s linear infinite" }}
        />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-white/60 rounded-full" />
        </div>
        {/* Orbiting dot 1 */}
        <div
          className="absolute inset-0 flex items-center justify-start"
          style={{ animation: "spin 8s linear infinite" }}
        >
          <div className="w-1.5 h-1.5 bg-white/40 rounded-full -ml-0.5" />
        </div>
        {/* Orbiting dot 2 */}
        <div
          className="absolute inset-4 flex items-center justify-end"
          style={{ animation: "spin 5s linear infinite reverse" }}
        >
          <div className="w-1 h-1 bg-white/30 rounded-full -mr-0.5" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center h-8">
        <p
          key={msgIndex}
          className="font-mono text-[0.65rem] tracking-[3px] uppercase text-white/40"
          style={{ animation: "fadeInUp 0.5s ease-out" }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
