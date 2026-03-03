"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const FAQS = [
  {
    q: "Preciso saber algo de astrologia antes?",
    a: "Não. O curso foi feito pra quem olha pro mapa e não entende nada. A gente começa literalmente explicando por que o mapa é redondo — e por que era quadrado até o século XIX. Se você sabe que é de Leão, já sabe mais do que o necessário pra começar.",
  },
  {
    q: "Vou sair do curso fazendo consultas profissionais?",
    a: "O objetivo é te tornar um leitor competente do diagrama — alguém que olha pra mandala e entende a estrutura, os símbolos e as relações. A interpretação profissional é o próximo passo. Este curso é o alicerce que todo astrólogo precisa e poucos realmente têm.",
  },
  {
    q: "Por quanto tempo tenho acesso?",
    a: "Acesso vitalício. Comprou, é seu. Assista no seu ritmo, quantas vezes quiser.",
  },
  {
    q: "As aulas são ao vivo ou gravadas?",
    a: "Gravadas. São 23 videoaulas divididas em 6 módulos, com ~2h de conteúdo total. Acesso imediato após a compra.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias de garantia incondicional. Se assistir e achar que não era o que esperava, pede o reembolso pela Kiwify. Sem perguntas, sem burocracia.",
  },
  {
    q: "Qual a diferença deste curso para os outros de astrologia?",
    a: 'A maioria ensina interpretação antes de ensinar leitura. Pedem que você decore que "Sol em Leão = liderança" sem te mostrar por que o glifo do Sol é um círculo com um ponto, e o que isso tem a ver com tudo. Nós ensinamos a VER o mapa como um diagrama. Cada símbolo tem uma lógica visual. Cada cor carrega informação. Cada forma geométrica conta uma história. Quando você aprende a enxergar isso, a interpretação vem naturalmente.',
  },
  {
    q: 'O que é o "Camarin Sideral" do pacote completo?',
    a: 'O Camarin é a comunidade da Película Sideral no Substack. Toda semana tem o "Spoiler da Semana" — uma aula ao vivo onde o Victor abre o mapa astrológico da semana e te prepara pro que vem. Você ainda recebe interpretações personalizadas pro seu mapa. É a prática semanal que complementa o método do curso.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SectionWrapper id="faq" alt>
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Perguntas frequentes
        </h2>
      </div>

      <div className="max-w-[750px] mx-auto space-y-2">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`fade-in rounded-xl border transition-all duration-300 ${
                isOpen
                  ? "bg-card border-gold/20"
                  : "bg-card/50 border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="font-display text-base md:text-lg font-medium pr-4">
                  {faq.q}
                </span>
                <svg
                  className={`w-5 h-5 text-gold flex-shrink-0 transition-transform duration-300 ${
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
                style={{ maxHeight: isOpen ? "400px" : "0" }}
              >
                <p className="px-5 pb-5 text-text-soft text-sm leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
