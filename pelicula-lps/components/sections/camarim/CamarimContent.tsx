"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const WEEKS = [
  {
    badge: "SEG",
    title: "Spoiler da Semana (live ao vivo)",
    items: [
      "Victor abre o mapa astrológico da semana",
      "Análise dos trânsitos mais relevantes",
      "Como esses trânsitos conversam com o seu mapa natal",
      "Espaço para perguntas ao vivo",
    ],
    detail: "~60 min · Toda segunda-feira · Gravação disponível depois",
    highlight: "O coração do Camarim. O momento semanal que conecta tudo.",
  },
  {
    badge: "QUA",
    title: "Publicação exclusiva no Substack",
    items: [
      "Artigo aprofundando o tema da semana",
      "Análise escrita dos trânsitos com contexto histórico",
      "Conexões entre o céu atual e mapas natais dos membros",
    ],
    detail: "Toda quarta-feira · Acesso exclusivo para membros",
    highlight: null,
  },
  {
    badge: "SEX",
    title: "Mergulho temático",
    items: [
      "Mini-interpretações temáticas (ex: Eclipse em cada signo)",
      "Glossários e materiais de apoio",
      "Referências culturais (filmes, livros, músicas) conectadas ao tema",
    ],
    detail: "Toda sexta-feira · Formato varia: texto, áudio ou vídeo",
    highlight: null,
  },
  {
    badge: "24/7",
    title: "Comunidade ativa",
    items: [
      "Discussões sobre os trânsitos da semana",
      "Troca entre membros sobre seus mapas",
      "Dúvidas respondidas por Victor e pela comunidade",
      "Um espaço sem julgamento para estudar astrologia",
    ],
    detail: "Acesso contínuo · Substack + chat",
    highlight: "O lugar onde sua jornada astrológica ganha companhia.",
  },
];

export default function CamarimContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="calendario" alt>
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Calendário semanal
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Sua semana no Camarim
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          Uma estrutura consistente que transforma astrologia em prática
          semanal — não consumo esporádico.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto space-y-3">
        {WEEKS.map((week, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={week.badge}
              className={`fade-in bg-white rounded-xl border transition-all duration-300 shadow-sm ${
                isOpen ? "border-gold/30" : "border-black/5 hover:border-black/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
              >
                <span className="flex-shrink-0 font-mono text-[0.6rem] font-bold tracking-[2px] uppercase bg-gold/10 text-gold px-3 py-1 rounded-md">
                  {week.badge}
                </span>
                <span className="flex-1 font-display text-base md:text-lg font-semibold">
                  {week.title}
                </span>
                <svg
                  className={`w-5 h-5 text-text-muted transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className="overflow-hidden transition-all duration-400"
                style={{ maxHeight: isOpen ? "500px" : "0" }}
              >
                <div className="px-5 pb-5 pt-0">
                  <ul className="space-y-2 mb-3">
                    {week.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-text-soft text-sm"
                      >
                        <span className="text-gold mt-1 flex-shrink-0">
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
                    {week.detail}
                  </div>
                  {week.highlight && (
                    <p className="mt-3 text-xs font-mono text-gold/70 italic">
                      &ldquo;{week.highlight}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
