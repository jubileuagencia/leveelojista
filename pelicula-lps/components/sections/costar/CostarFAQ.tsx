"use client";

import { useState } from "react";
import Image from "next/image";
import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

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

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`fade-in border-b transition-colors duration-300 ${
        isOpen ? "border-white/20" : "border-white/[0.06]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
      >
        <span className="font-display text-base md:text-lg font-medium pr-4 text-white/70 group-hover:text-white transition-colors">
          {faq.q}
        </span>
        <svg
          className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-white/40 text-sm leading-relaxed">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CostarFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <CostarSection id="faq" alt>
      <div className="text-center mb-16">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Perguntas frequentes
        </h2>
      </div>

      <div className="max-w-[750px] mx-auto space-y-1">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>

      {/* Victor photo */}
      <div className="fade-in flex justify-center mt-12 mb-8">
        <div className="relative w-44 h-56 border border-white/10 overflow-hidden">
          <Image
            src="/assets/victor-lado.jpeg"
            alt="Victor"
            fill
            className="object-cover grayscale"
            sizes="176px"
          />
        </div>
      </div>

      <div className="fade-in text-center">
        <p className="text-white/30 text-sm mb-6 font-display italic">
          Ainda tem dúvida? O risco é zero — garantia de 7 dias.
        </p>
        <CostarButton href={CHECKOUT_URLS.curso} variant="ghost">
          Quero começar agora
        </CostarButton>
      </div>
    </CostarSection>
  );
}
