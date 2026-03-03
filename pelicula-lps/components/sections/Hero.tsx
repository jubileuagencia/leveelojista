import Button from "@/components/ui/Button";
import { CHECKOUT_URLS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-32 overflow-hidden">
      {/* Cosmic rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-gold/5 animate-spin-slow" />
        <div className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-purple/8 animate-spin-reverse" />
        <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-gold/3" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-5 text-center">
        <div className="fade-in">
          <span className="font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-6 block">
            Película Sideral apresenta
          </span>
        </div>

        <h1 className="fade-in font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
          <span className="text-gold-light">Decifrando o</span>
          <br />
          <span className="text-text">Mapa Astral</span>
        </h1>

        <p className="fade-in text-text-soft text-lg md:text-xl leading-relaxed max-w-[640px] mx-auto mb-4">
          O mapa astral não é mistério. É um diagrama.
          <br className="hidden md:block" /> E se você consegue ler um mapa de
          metrô, consegue ler um mapa astral.
        </p>

        <p className="fade-in text-text-muted text-base md:text-lg leading-relaxed max-w-[600px] mx-auto mb-8">
          Em 23 aulas, você vai olhar pra qualquer mapa astral e entender o que
          está vendo — sem decorar, sem misticismo, sem depender de ninguém.
        </p>

        <div className="fade-in font-mono text-xs tracking-[3px] uppercase text-text-muted mb-10">
          23 videoaulas · ~2h de conteúdo · Acesso imediato
        </div>

        <div className="fade-in mb-6">
          <Button href={CHECKOUT_URLS.curso}>Quero aprender a ler o céu</Button>
        </div>

        <p className="fade-in font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
          Preço de lançamento · Garantia incondicional de 7 dias
        </p>
      </div>
    </section>
  );
}
