"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const MODULES = [
  {
    badge: "INTRO",
    title: "A Astrologia como Design",
    lessons: [
      "O mapa não é o céu — é uma representação",
      "Por que a mandala é circular (e era quadrada até o séc. XIX)",
      "O setup visual: Astro.com vs. softwares profissionais",
    ],
    duration: "3 aulas · ~30 min",
    highlight: null,
  },
  {
    badge: "MÓD 1",
    title: "O Palco (Estrutura do Espaço)",
    lessons: [
      "As 3 camadas concêntricas: signos, casas e aspectos",
      "A bússola invertida: por que o Leste fica à esquerda",
      "Os 4 pilares: Ascendente, Descendente, MC e IC",
    ],
    duration: "3 aulas · ~28 min",
    highlight: null,
  },
  {
    badge: "MÓD 2",
    title: "Os Atores (Semiótica dos Glifos)",
    lessons: [
      "Os 3 blocos primordiais: Círculo, Crescente e Cruz",
      "Decodificando Sol, Lua, Mercúrio, Vênus e Marte",
      "Júpiter, Saturno e os transpessoais",
      "Nodos Lunares, Lilith e Parte da Fortuna",
    ],
    duration: "4 aulas · ~42 min",
    highlight: "Três formas. Três princípios. Infinitas combinações.",
  },
  {
    badge: "MÓD 3",
    title: "A Arquitetura (As Casas)",
    lessons: [
      'O problema das "fatias de pizza" — cúspides e numeração',
      "Placidus: por que virou padrão (spoiler: conveniência, não superioridade)",
      "O fenômeno da interceptação",
      "Comparativo visual: Placidus vs. Signos Inteiros",
    ],
    duration: "4 aulas · ~34 min",
    highlight:
      "As casas são o cenário onde os planetas atuam. São as salas da casa da sua vida.",
  },
  {
    badge: "MÓD 4",
    title: "A Trama (Aspectos e Geometria)",
    lessons: [
      "O código de cores: vermelho = tensão, azul = harmonia, verde = ajuste",
      "Geometria da psique: Grande Trígono, T-Square, Yod e Stellium",
      "Orbe e espessura: como pesar cada linha",
    ],
    duration: "3 aulas · ~30 min",
    highlight:
      "Quando você olha pro centro do mapa, não está vendo linhas. Está vendo a conversa entre as partes da sua psique.",
  },
  {
    badge: "MÓD 5",
    title: "As Legendas (Rodapé Técnico)",
    lessons: [
      "Graus, minutos e segundos — o GPS do mapa",
      "Retrógrado e estacionário — os sufixos de estado",
      "Tabela de elementos e modalidades",
    ],
    duration: "3 aulas · ~20 min",
    highlight: null,
  },
  {
    badge: "MÓD 6",
    title: "A Leitura (Prática)",
    lessons: [
      "As 5 camadas na prática: leitura guiada",
      "Prática guiada: decodificando o mapa de Frida Kahlo",
      "Agora é com você: leia seu próprio mapa",
    ],
    duration: "3 aulas · ~17 min",
    highlight: "Prática real. Não teoria. Você SAI do curso lendo mapas.",
  },
];

export default function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionWrapper id="conteudo" alt>
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Conteúdo completo
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          De &ldquo;não entendo nada&rdquo; a<br />
          &ldquo;consigo ler qualquer mapa&rdquo;
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          6 módulos que constroem sua habilidade de leitura camada por camada.
          Cada módulo abre uma nova dimensão do diagrama.
        </p>
      </div>

      {/* Bridge text */}
      <p className="fade-in text-center font-display text-lg md:text-xl text-text-soft italic mb-12 max-w-[600px] mx-auto">
        Esse é o método. Agora veja como ele se desdobra em 6 módulos que
        constroem sua habilidade cena por cena, camada por camada.
      </p>

      <div className="max-w-[800px] mx-auto space-y-3">
        {MODULES.map((mod, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={mod.badge}
              className={`fade-in bg-card rounded-xl border transition-all duration-300 ${
                isOpen ? "border-gold/30" : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
              >
                <span className="flex-shrink-0 font-mono text-[0.6rem] font-bold tracking-[2px] uppercase bg-gold/10 text-gold px-3 py-1 rounded-md">
                  {mod.badge}
                </span>
                <span className="flex-1 font-display text-base md:text-lg font-semibold">
                  {mod.title}
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
                    {mod.lessons.map((lesson) => (
                      <li
                        key={lesson}
                        className="flex items-start gap-2 text-text-soft text-sm"
                      >
                        <span className="text-gold mt-1 flex-shrink-0">
                          ·
                        </span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                  <div className="font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
                    {mod.duration}
                  </div>
                  {mod.highlight && (
                    <p className="mt-3 text-xs font-mono text-gold/70 italic">
                      &ldquo;{mod.highlight}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bonus materials */}
      <div className="fade-in max-w-[800px] mx-auto mt-6 bg-card rounded-xl border border-purple/20 p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-[0.6rem] font-bold tracking-[2px] uppercase bg-purple/20 text-purple-light px-3 py-1 rounded-md">
            BÔNUS
          </span>
          <span className="font-display text-base font-semibold">
            Materiais de Apoio
          </span>
        </div>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-text-soft text-sm">
            <span className="text-purple-light mt-1">·</span>
            Glossário Visual em PDF com todos os glifos decodificados
          </li>
          <li className="flex items-start gap-2 text-text-soft text-sm">
            <span className="text-purple-light mt-1">·</span>
            Checklist de Decodificação para imprimir e usar em qualquer mapa
          </li>
        </ul>
      </div>

      {/* Bonus course section */}
      <div className="fade-in max-w-[800px] mx-auto mt-8 relative">
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-gold via-purple to-gold" />
        <div className="bg-card rounded-2xl border border-gold/15 p-6 md:p-8 pt-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
              Incluso no curso
            </span>
            <span className="font-mono text-[0.55rem] font-bold tracking-[2px] uppercase bg-gold/15 text-gold px-2 py-0.5 rounded">
              Curso bônus
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
            Como o Céu Virou Linguagem
          </h3>
          <p className="text-text-soft text-sm mb-4">
            6 aulas sobre a história da astrologia — de Babilônia a Jung.
            Contexto que transforma sua leitura.
          </p>
          <p className="text-text-soft text-sm mb-4 leading-relaxed">
            Antes de ler o diagrama, vale entender como ele chegou até você.
            Neste curso bônus, você vai conhecer a jornada de 4.000 anos que
            transformou observação de estrelas em linguagem psicológica:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Como pastores babilônicos começaram a anotar padrões no céu",
              "A Grande Turnê dos Signos: de Babilônia ao Egito, da Grécia a Roma",
              "Os planetas como arquétipos: Sol = Herói, Lua = Mãe, Mercúrio = Mensageiro",
              "Quando a astrologia ganhou terapia: a virada junguiana que mudou tudo",
              "Por que Alan Leo transformou previsão em autoconhecimento",
              'O momento em que o mapa deixou de perguntar "o que vai acontecer?" e passou a perguntar "quem eu sou?"',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-text-soft text-sm"
              >
                <span className="text-gold mt-1 flex-shrink-0">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-text-muted text-sm italic">
            6 aulas. Storytelling puro. O tipo de contexto que muda como você
            olha para tudo o que vem depois.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
