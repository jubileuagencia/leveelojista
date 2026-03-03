"use client";

import { useState } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";

const FAQS = [
  {
    q: "Preciso ter feito o curso Decifrando o Mapa Astral?",
    a: "Não. O Camarim é independente do curso. Ele foi pensado para quem já tem alguma familiaridade com astrologia — mesmo que básica. Se você sabe o que é um mapa astral e quer ir além do horóscopo, está pronto. Se já fez o curso, melhor ainda: o Camarim é a prática semanal que complementa o método.",
  },
  {
    q: "O que é o Spoiler da Semana?",
    a: "É uma live semanal onde Victor abre o mapa astrológico dos próximos dias e analisa os trânsitos mais relevantes ao vivo. Ele conecta o que está acontecendo no céu com o mapa natal dos membros. É como ter um briefing semanal do céu — preparatório, não preditivo.",
  },
  {
    q: "E se eu não puder assistir ao vivo?",
    a: "Todas as lives ficam gravadas e disponíveis no arquivo. Você assiste quando quiser, no seu ritmo. Muitos membros assistem depois e participam pela comunidade no Substack.",
  },
  {
    q: "Qual a diferença do plano mensal para o anual?",
    a: "O conteúdo é o mesmo. A diferença é o compromisso e a economia: o plano anual sai R$24,75/mês (vs. R$19 x 12 = R$228 vs. R$297). O anual inclui prioridade em interpretações personalizadas e garante 12 meses de acesso.",
  },
  {
    q: "Posso cancelar o mensal a qualquer momento?",
    a: "Sim. Sem fidelidade, sem burocracia. Você cancela pelo próprio Substack com um clique. Seu acesso continua até o final do período pago.",
  },
  {
    q: "Victor responde perguntas individuais?",
    a: "Sim. Nas lives semanais há espaço para perguntas ao vivo, e periodicamente Victor traz análises focadas em mapas específicos de membros. No Substack, ele também interage nos comentários.",
  },
  {
    q: "Que nível de conhecimento eu preciso ter?",
    a: "Qualquer nível acima de zero. Se você sabe que tem um mapa astral e quer entendê-lo melhor, o Camarim funciona pra você. Iniciantes aprendem com as lives e a comunidade. Quem já estuda há mais tempo ganha profundidade e prática semanal que não encontra em nenhum outro lugar.",
  },
];

export default function CamarimFAQ() {
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
                  ? "bg-white border-gold/20 shadow-sm"
                  : "bg-white/50 border-black/5 hover:border-black/10"
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
