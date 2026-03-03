import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
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
            <span className={`mt-1 flex-shrink-0 ${isBonus ? "text-gold" : "text-text-muted"}`}>
              {isBonus ? "★" : "·"}
            </span>
            <span className={isBonus ? "text-text" : "text-text-soft"}>
              {text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function Pricing() {
  return (
    <SectionWrapper id="investimento">
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Investimento
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Comece a ler o céu hoje
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto items-start">
        {/* Card 1 - Curso Solo */}
        <div className="fade-in bg-card rounded-2xl border border-white/10 p-6 md:p-8">
          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-text-muted mb-1 block">
            CURSO
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-6">
            Decifrando o Mapa Astral
          </h3>

          <ItemList items={CURSO_ITEMS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-text">
              R$ {PRICING.curso.price}
            </div>
            <p className="text-text-muted text-sm mt-1">
              ou {PRICING.curso.installments}x de R$ {PRICING.curso.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button href={CHECKOUT_URLS.curso} variant="ghost" size="md">
              Quero decifrar meu mapa
            </Button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4 font-mono">
            Garantia incondicional de 7 dias
          </p>
        </div>

        {/* Card 2 - Pacote Completo */}
        <div className="fade-in relative bg-card rounded-2xl border border-gold/30 p-6 md:p-8 gold-glow md:scale-[1.03]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-void font-mono text-[0.6rem] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full">
            Melhor oferta
          </div>

          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-gold mb-1 block">
            PACOTE COMPLETO
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
            Curso + Camarin Sideral
          </h3>
          <p className="text-text-muted text-xs mb-6">
            Aprender o método no curso. Praticar toda semana no Camarin.
          </p>

          <p className="font-mono text-[0.6rem] tracking-[2px] uppercase text-text-muted mb-2">
            Tudo do plano Curso, mais:
          </p>
          <ItemList items={PACOTE_EXTRAS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-gold-light">
              R$ {PRICING.pacote.price}
            </div>
            <p className="text-text-muted text-sm mt-1">
              ou {PRICING.pacote.installments}x de R$ {PRICING.pacote.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button href={CHECKOUT_URLS.pacote}>
              Quero o pacote completo
            </Button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4 font-mono">
            Garantia incondicional de 7 dias
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
