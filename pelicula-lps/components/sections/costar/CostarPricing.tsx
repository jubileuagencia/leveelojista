import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS, PRICING } from "@/lib/constants";

const CURSO_ITEMS = [
  "23 videoaulas gravadas (~2h de conteúdo)",
  "6 módulos progressivos do zero ao algoritmo",
  "Método das 5 Camadas da Mandala",
  "Glossário Visual em PDF (todos os glifos decodificados)",
  "Checklist de Decodificação (imprima e use)",
  { text: 'Bônus: Curso "Como o Céu Virou Linguagem" (6 aulas)', bonus: true },
  "Acesso vitalício",
];

const PACOTE_EXTRAS = [
  { text: "Acesso ao Camarin Sideral (comunidade no Substack) por 1 ano", bonus: true },
  { text: '"Spoiler da Semana" — aula ao vivo semanal sobre o céu', bonus: true },
  { text: "Interpretações personalizadas para o seu mapa", bonus: true },
  "Troca com outros estudantes e astrólogos",
  "Publicações e análises exclusivas",
  "Acesso vitalício aos cursos",
];

type PricingItem = string | { text: string; bonus: boolean };

function ItemList({ items }: { items: PricingItem[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => {
        const text = typeof item === "string" ? item : item.text;
        const isBonus = typeof item === "object" && item.bonus;
        return (
          <li key={text} className="flex items-start gap-2 text-sm">
            <span className={`mt-1 flex-shrink-0 ${isBonus ? "text-white" : "text-white/20"}`}>
              {isBonus ? "+" : "·"}
            </span>
            <span className={isBonus ? "text-white/70" : "text-white/40"}>
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function CostarPricing() {
  return (
    <CostarSection id="investimento">
      <div className="text-center mb-16">
        <span className="fade-in font-mono text-[0.6rem] font-bold tracking-[5px] uppercase text-white/30 mb-5 block">
          Investimento
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Comece a ler o céu hoje
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-[900px] mx-auto items-start">
        {/* Card 1 - Curso Solo */}
        <div className="fade-in border border-white/[0.08] p-7 md:p-8 hover:border-white/20 transition-colors duration-500">
          <span className="font-mono text-[0.55rem] font-bold tracking-[3px] uppercase text-white/30 mb-1 block">
            CURSO
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-6 text-white/90">
            Decifrando o Mapa Astral
          </h3>

          <ItemList items={CURSO_ITEMS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-white">
              R$ {PRICING.curso.price}
            </div>
            <p className="text-white/30 text-sm mt-1 font-mono text-[0.65rem] tracking-wide">
              ou {PRICING.curso.installments}x de R$ {PRICING.curso.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <CostarButton href={CHECKOUT_URLS.curso} variant="ghost">
              Quero decifrar meu mapa
            </CostarButton>
          </div>

          <p className="text-center text-white/20 text-xs mt-4 font-mono tracking-wider">
            Garantia incondicional de 7 dias
          </p>
        </div>

        {/* Card 2 - Pacote Completo */}
        <div className="fade-in relative border border-white/30 p-7 md:p-8">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black font-mono text-[0.55rem] font-bold tracking-[2px] uppercase px-4 py-1">
            Melhor oferta
          </div>

          <span className="font-mono text-[0.55rem] font-bold tracking-[3px] uppercase text-white/50 mb-1 block">
            PACOTE COMPLETO
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-white">
            Curso + Camarin Sideral
          </h3>
          <p className="text-white/30 text-xs mb-6 font-mono tracking-wide">
            Aprender o método no curso. Praticar toda semana no Camarin.
          </p>

          <p className="font-mono text-[0.55rem] tracking-[2px] uppercase text-white/25 mb-2">
            Tudo do plano Curso, mais:
          </p>
          <ItemList items={PACOTE_EXTRAS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-white">
              R$ {PRICING.pacote.price}
            </div>
            <p className="text-white/30 text-sm mt-1 font-mono text-[0.65rem] tracking-wide">
              ou {PRICING.pacote.installments}x de R$ {PRICING.pacote.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <CostarButton href={CHECKOUT_URLS.pacote}>
              Quero o pacote completo
            </CostarButton>
          </div>

          <p className="text-center text-white/20 text-xs mt-4 font-mono tracking-wider">
            Garantia incondicional de 7 dias
          </p>
        </div>
      </div>
    </CostarSection>
  );
}
