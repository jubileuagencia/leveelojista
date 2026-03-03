import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CAMARIM_CHECKOUT_URLS, CAMARIM_PRICING } from "@/lib/constants";

const MENSAL_ITEMS = [
  "Acesso a todas as lives semanais (Spoiler da Semana)",
  "Conteúdo exclusivo no Substack",
  "Comunidade de membros",
  "Arquivo completo de lives anteriores",
  "Interpretações personalizadas periódicas",
  "Cancele quando quiser, sem burocracia",
];

const ANUAL_EXTRAS = [
  { text: "Tudo do plano mensal", bonus: false },
  { text: "Economia de R$69 em relação ao mensal (3+ meses grátis)", bonus: true },
  { text: "Acesso garantido por 12 meses completos", bonus: true },
  { text: "Prioridade em interpretações personalizadas", bonus: true },
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
          Investimento
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Entre no Camarim Sideral
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto items-start">
        {/* Card 1 - Mensal */}
        <div className="fade-in bg-white rounded-2xl border border-black/8 p-6 md:p-8 shadow-sm">
          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-text-muted mb-1 block">
            MENSAL
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-6">
            Camarim Sideral
          </h3>

          <ItemList items={MENSAL_ITEMS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-text">
              R$ {CAMARIM_PRICING.mensal.price}
              <span className="text-lg text-text-muted font-normal">/mês</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Button href={CAMARIM_CHECKOUT_URLS.mensal} variant="ghost-light" size="md">
              Assinar mensal
            </Button>
          </div>

          <p className="text-center text-text-muted text-xs mt-4 font-mono">
            Cancele quando quiser · Sem fidelidade
          </p>
        </div>

        {/* Card 2 - Anual */}
        <div className="fade-in relative bg-white rounded-2xl border border-gold/30 p-6 md:p-8 gold-glow shadow-sm md:scale-[1.03]">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#7c5cbf] to-[#9b7fd4] text-white font-mono text-[0.6rem] font-bold tracking-[2px] uppercase px-4 py-1 rounded-full">
            Melhor oferta
          </div>

          <span className="font-mono text-[0.6rem] font-bold tracking-[3px] uppercase text-gold mb-1 block">
            ANUAL
          </span>
          <h3 className="font-display text-xl md:text-2xl font-bold mb-2">
            Camarim Sideral
          </h3>
          <p className="text-text-muted text-xs mb-6">
            12 meses de acesso com economia. O compromisso que acelera sua jornada.
          </p>

          <ItemList items={ANUAL_EXTRAS} />

          <div className="mt-8 text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-gold">
              R$ {CAMARIM_PRICING.anual.price}
              <span className="text-lg text-text-muted font-normal">/ano</span>
            </div>
            <p className="text-text-muted text-sm mt-1">
              ou {CAMARIM_PRICING.anual.installments}x de R$ {CAMARIM_PRICING.anual.installmentValue}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button href={CAMARIM_CHECKOUT_URLS.anual} variant="purple">
              Quero o plano anual
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
