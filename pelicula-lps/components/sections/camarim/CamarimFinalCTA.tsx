import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CAMARIM_CHECKOUT_URLS } from "@/lib/constants";

export default function CamarimFinalCTA() {
  return (
    <SectionWrapper>
      <div className="text-center max-w-[700px] mx-auto">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-6">
          Astrologia não se aprende uma vez.
          <br />
          <span className="text-gold">Se pratica toda semana.</span>
        </h2>

        <div className="fade-in text-text-soft text-base md:text-lg leading-relaxed mb-8 space-y-4">
          <p>
            No Camarim, Victor guia, a comunidade troca e o céu renova o
            conteúdo. Toda segunda tem live. Toda quarta tem publicação.
            E entre uma coisa e outra, tem gente discutindo, perguntando,
            compartilhando mapas e descobertas.
          </p>
          <p className="text-text font-medium">
            Seu lugar na próxima live está aberto.
          </p>
        </div>

        <div className="fade-in mb-4">
          <Button href={CAMARIM_CHECKOUT_URLS.anual} variant="purple">
            Entrar na próxima live
          </Button>
        </div>

        <div className="fade-in mb-6">
          <Button href={CAMARIM_CHECKOUT_URLS.mensal} variant="ghost-light" size="md">
            Ou começar pelo mensal — R$19/mês
          </Button>
        </div>

        <p className="fade-in font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
          Acesso imediato · Cancele quando quiser
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
