import Image from "next/image";
import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

export default function CostarFinalCTA() {
  return (
    <CostarSection>
      {/* Victor portrait */}
      <div className="fade-in flex justify-center mb-16">
        <div className="relative w-60 h-72 md:w-72 md:h-80 border border-white/10 overflow-hidden">
          <Image
            src="/assets/victor-studio.jpeg"
            alt="Victor — Película Sideral"
            fill
            className="object-cover grayscale"
            sizes="(max-width: 768px) 240px, 288px"
          />
        </div>
      </div>

      <div className="text-center max-w-[700px] mx-auto">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-6">
          O mapa não é mistério.
          <br />
          <span className="text-white/60">É uma linguagem.</span>
        </h2>

        <div className="fade-in text-white/40 text-base md:text-lg leading-relaxed mb-8 space-y-4">
          <p>
            Quando você aprendeu a ler, as letras também eram símbolos sem
            sentido. Alguém te ensinou que aquele rabisco era um &ldquo;A&rdquo;,
            que aquele outro era um &ldquo;B&rdquo;, e em algum momento os
            rabiscos viraram palavras.
          </p>
          <p>O mapa astral é a mesma coisa.</p>
          <p className="text-white">
            A diferença é que ninguém te ensinou o alfabeto — até agora.
          </p>
        </div>

        <div className="fade-in mb-6">
          <CostarButton href={CHECKOUT_URLS.curso}>Quero aprender a ler o céu</CostarButton>
        </div>

        <p className="fade-in font-mono text-[0.55rem] tracking-[3px] uppercase text-white/25">
          23 aulas · Acesso imediato · Garantia de 7 dias
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-white/[0.06] text-center">
        <p className="font-mono text-[0.55rem] text-white/20 tracking-[3px] uppercase">
          Película Sideral — Todos os direitos reservados
        </p>
        <p className="font-mono text-[0.5rem] text-white/10 mt-2 tracking-wider">
          Película Sideral &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </CostarSection>
  );
}
