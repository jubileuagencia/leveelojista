import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CAMARIM_CHECKOUT_URLS } from "@/lib/constants";

export default function CamarimFinalCTA() {
  return (
    <SectionWrapper>
      <div className="text-center max-w-[700px] mx-auto">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-6">
          O céu muda toda semana.
          <br />
          <span className="text-gold">Seu entendimento também pode.</span>
        </h2>

        <div className="fade-in text-text-soft text-base md:text-lg leading-relaxed mb-8 space-y-4">
          <p>
            Astrologia não é algo que você aprende uma vez e pronto. É uma
            linguagem viva — que se revela aos poucos, semana a semana, trânsito
            a trânsito, conversa a conversa.
          </p>
          <p>
            O Camarim é o espaço onde essa prática acontece.
          </p>
          <p className="text-text">
            Com Victor guiando, uma comunidade trocando e o céu renovando o
            conteúdo toda semana.
          </p>
        </div>

        <div className="fade-in mb-6">
          <Button href={CAMARIM_CHECKOUT_URLS.anual} variant="purple">
            Quero entrar no Camarim
          </Button>
        </div>

        <p className="fade-in font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
          A partir de R$19/mês · Acesso imediato · Cancele quando quiser
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-black/5 text-center">
        <p className="font-mono text-xs text-text-muted tracking-wider">
          Película Sideral — Todos os direitos reservados
        </p>
        <p className="font-mono text-[0.6rem] text-text-muted/50 mt-1">
          Película Sideral &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </SectionWrapper>
  );
}
