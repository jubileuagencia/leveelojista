import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CAMARIM_CHECKOUT_URLS, CAMARIM_PRICING } from "@/lib/constants";

const MENSAL_ITEMS = [
  "Spoiler da Semana — live semanal com Victor",
  "Conteúdo exclusivo no Substack (3x por semana)",
  "Comunidade ativa de estudo",
  "Arquivo completo de lives e publicações anteriores",
  "Cancele quando quiser, sem burocracia",
];

const PACOTE_ITEMS = [
  { text: "Tudo do Camarim (lives, Substack, comunidade, arquivo)", bonus: false },
  { text: "Curso completo Decifrando o Mapa Astral (23 aulas)", bonus: true },
  { text: "Interpretações personalizadas com prioridade", bonus: true },
  { text: "12 meses de acesso garantido", bonus: true },
  { text: "Garantia incondicional de 7 dias", bonus: false },
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

export default function CamarimPricing() {
  return (
    <SectionWrapper id="investimento">
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Escolha sua entrada
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Duas formas de entrar no Camarim
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[650px] mx-auto">
          Comece pela comunidade ou garanta o pacote completo com os cursos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto items-start">
        {/* Card 1 - Mensal (Comunidade) */}
        <div className="fade-in bg-white rounded-2xl border border-black/8 p-6 md:p-8 shadow-sm">
          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-text-muted mb-1 block">
            COMUNIDADE
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
            Camarim Sideral
          </h3>
          <p className="text-text-muted text-xs mb-6">
            A prática semanal de astrologia com Victor e a comunidade.
          </p>

          <ItemList items={MENSAL_ITEMS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-text">
              R$ {CAMARIM_PRICING.mensal.price}
              <span className="text-lg text-text-muted font-normal">/mês</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button href={CAMARIM_CHECKOUT_URLS.mensal} variant="ghost-light" size="md">
              Começar com o mensal
            </Button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4 font-mono">
            Cancele quando quiser · Sem fidelidade
          </p>
        </div>

        {/* Card 2 - Pacote Completo (Comunidade + Cursos) */}
        <div className="fade-in relative bg-white rounded-2xl border border-gold/30 p-6 md:p-8 gold-glow shadow-sm md:scale-[1.03]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c5cbf] to-[#9b7fd4] text-white font-mono text-[0.6rem] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full">
            Pacote completo
          </div>

          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-gold mb-1 block">
            COMUNIDADE + CURSOS
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
            Camarim + Decifrando
          </h3>
          <p className="text-text-muted text-xs mb-6">
            O Camarim inteiro mais o curso que ensina a ler qualquer mapa astral.
          </p>

          <ItemList items={PACOTE_ITEMS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-gold">
              R$ {CAMARIM_PRICING.anual.price}
            </div>
            <p className="text-text-muted text-sm mt-1">
              ou {CAMARIM_PRICING.anual.installments}x de R$ {CAMARIM_PRICING.anual.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button href={CAMARIM_CHECKOUT_URLS.anual} variant="purple">
              Garantir o pacote completo
            </Button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4 font-mono">
            Garantia de 7 dias · Acesso imediato
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
