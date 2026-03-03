import SectionWrapper from "@/components/ui/SectionWrapper";
import Button from "@/components/ui/Button";
import { CHECKOUT_URLS } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <SectionWrapper>
      <div className="text-center max-w-[700px] mx-auto">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-6">
          O mapa não é mistério.
          <br />
          <span className="text-gold-light">É uma linguagem.</span>
        </h2>

        <div className="fade-in text-text-soft text-base md:text-lg leading-relaxed mb-8 space-y-4">
          <p>
            Quando você aprendeu a ler, as letras também eram símbolos sem
            sentido. Alguém te ensinou que aquele rabisco era um &ldquo;A&rdquo;,
            que aquele outro era um &ldquo;B&rdquo;, e em algum momento os
            rabiscos viraram palavras.
          </p>
          <p>O mapa astral é a mesma coisa.</p>
          <p className="text-text">
            A diferença é que ninguém te ensinou o alfabeto — até agora.
          </p>
        </div>

        <div className="fade-in mb-6">
          <Button href={CHECKOUT_URLS.curso}>Quero aprender a ler o céu</Button>
        </div>

        <p className="fade-in font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
          23 aulas · Acesso imediato · Garantia de 7 dias
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-white/5 text-center">
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
