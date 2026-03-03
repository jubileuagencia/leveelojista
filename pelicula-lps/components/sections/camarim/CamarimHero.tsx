import Button from "@/components/ui/Button";
import { CAMARIM_CHECKOUT_URLS } from "@/lib/constants";

export default function CamarimHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-32 overflow-hidden">
      {/* Subtle decorative circles (light theme) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[#7c5cbf]/5" />
        <div className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-[#7c5cbf]/8" />
        <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-[#7c5cbf]/3" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-5 text-center">
        <div className="fade-in">
          <span className="font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-6 block">
            Película Sideral apresenta
          </span>
        </div>

        <h1 className="fade-in font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
          <span className="text-gold-light">Camarim</span>
          <br />
          <span className="text-text">Sideral</span>
        </h1>

        <p className="fade-in text-text-soft text-lg md:text-xl leading-relaxed max-w-[640px] mx-auto mb-4">
          A comunidade semanal para quem quer ir além do horóscopo.
          <br className="hidden md:block" /> Toda semana, uma nova lente para olhar o céu — e se entender melhor.
        </p>

        <p className="fade-in text-text-muted text-base md:text-lg leading-relaxed max-w-[600px] mx-auto mb-8">
          Lives ao vivo com Victor, conteúdo exclusivo no Substack e uma comunidade que estuda astrologia de verdade — com profundidade, método e sem misticismo vazio.
        </p>

        <div className="fade-in font-mono text-xs tracking-[3px] uppercase text-text-muted mb-10">
          52 lives por ano · Conteúdo semanal · Comunidade ativa
        </div>

        <div className="fade-in mb-6">
          <Button href={CAMARIM_CHECKOUT_URLS.anual} variant="purple">
            Quero entrar no Camarim
          </Button>
        </div>

        <p className="fade-in font-mono text-[0.65rem] tracking-[2px] uppercase text-text-muted">
          A partir de R$19/mês · Cancele quando quiser
        </p>
      </div>
    </section>
  );
}
