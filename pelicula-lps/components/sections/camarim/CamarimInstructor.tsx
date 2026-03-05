import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function CamarimInstructor() {
  return (
    <SectionWrapper id="instrutor" alt>
      <div className="text-center mb-4">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Quem conduz
        </span>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start max-w-[900px] mx-auto">
        {/* Photo */}
        <div className="fade-in flex flex-col items-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-gold/20 relative shadow-md">
            <Image
              src="/assets/victor-studio.jpeg"
              alt="Victor — Película Sideral"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>
          <p className="font-mono text-xs text-text-muted mt-3">
            Astrólogo. Documentarista. Criador do Película Sideral.
          </p>
        </div>

        {/* Bio */}
        <div>
          <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-4">
            Victor — <span className="text-gold">Película Sideral</span>
          </h2>

          <div className="fade-in space-y-4 text-text-soft text-base leading-relaxed">
            <p>
              Victor é o criador da Película Sideral — um projeto na interseção
              entre astrologia, cinema e design de informação. No Camarim, ele
              traz toda semana uma análise ao vivo do céu, conectando os
              trânsitos com o mapa natal de cada membro.
            </p>
            <p>
              Com formação em cinema documental, ele transformou o ensino de
              astrologia com uma abordagem visual e narrativa que centenas de
              pessoas descrevem como &ldquo;a primeira vez que astrologia fez
              sentido.&rdquo;
            </p>
          </div>

          {/* Quote */}
          <blockquote className="fade-in mt-6 border-l-2 border-gold/30 pl-5 py-2">
            <p className="font-display text-base md:text-lg italic text-gold/90 leading-relaxed">
              &ldquo;O Camarim nasceu porque astrologia não é esporte solo. É um
              campo que cresce no diálogo, na troca, no olhar do outro sobre o
              mesmo mapa. Toda semana a gente se encontra pra ler o céu juntos —
              e cada encontro revela uma camada nova.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
    </SectionWrapper>
  );
}
