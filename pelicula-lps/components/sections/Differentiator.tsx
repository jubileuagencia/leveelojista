import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Differentiator() {
  return (
    <SectionWrapper id="diferencial" alt>
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          O diferencial
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Antes de interpretar, aprenda a enxergar
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          A maioria dos cursos de astrologia pula direto pra interpretação. É
          como tentar analisar um filme sem saber o que é um plano-sequência.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Convencional */}
        <div className="fade-in bg-card rounded-2xl border border-white/5 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-aspect-red/40 to-transparent" />
          <span className="font-mono text-[0.65rem] tracking-[3px] uppercase text-aspect-red/80 mb-3 block">
            O caminho convencional
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 text-text-soft">
            Decorar receitas
          </h3>
          <p className="text-text-soft text-sm leading-relaxed">
            &ldquo;Sol em Leão = liderança&rdquo;. &ldquo;Lua em Peixes =
            sensibilidade&rdquo;. Colar rótulos em posições sem entender por que
            o mapa se parece com o que se parece. Memorizar receitas sem saber
            cozinhar.
          </p>
        </div>

        {/* Visual */}
        <div className="fade-in bg-card rounded-2xl border border-gold/20 p-6 md:p-8 relative overflow-hidden gold-glow">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="font-mono text-[0.65rem] tracking-[3px] uppercase text-gold mb-3 block">
            O caminho visual
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
            Ler o diagrama
          </h3>
          <p className="text-text-soft text-sm leading-relaxed">
            Entender por que o mapa é redondo (e era quadrado). O que cada
            camada mostra. Por que as linhas são coloridas. Como três formas
            simples — círculo, crescente e cruz — decodificam todos os símbolos
            planetários. Depois, a interpretação vem sozinha.
          </p>
        </div>
      </div>

      <blockquote className="fade-in font-display text-xl md:text-2xl text-center leading-relaxed max-w-[750px] mx-auto text-text-soft italic">
        &ldquo;Você não é um místico recebendo revelações. Você é um leitor. Um
        tradutor. Alguém que olha para um conjunto de símbolos e extrai
        significado deles.
        <br />
        <span className="text-gold-light">
          Isso é uma habilidade. E habilidades se aprendem.
        </span>
        &rdquo;
      </blockquote>
    </SectionWrapper>
  );
}
