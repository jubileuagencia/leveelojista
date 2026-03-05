import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

export default function CostarDifferentiator() {
  return (
    <CostarSection id="diferencial" alt>
      <div className="text-center mb-16">
        <span className="fade-in font-mono text-[0.6rem] font-bold tracking-[5px] uppercase text-white/30 mb-5 block">
          O diferencial
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-5">
          Antes de interpretar, aprenda a enxergar
        </h2>
        <p className="fade-in text-white/50 text-lg max-w-[640px] mx-auto">
          A maioria dos cursos de astrologia pula direto pra interpretação. É
          como tentar analisar um filme sem saber o que é um plano-sequência.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-14">
        {/* Convencional */}
        <div className="fade-in border border-white/[0.06] p-7 md:p-8">
          <span className="font-mono text-[0.6rem] tracking-[4px] uppercase text-white/30 mb-4 block">
            O caminho convencional
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-4 text-white/50">
            Decorar receitas
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            &ldquo;Sol em Leão = liderança&rdquo;. &ldquo;Lua em Peixes =
            sensibilidade&rdquo;. Colar rótulos em posições sem entender por que
            o mapa se parece com o que se parece. Memorizar receitas sem saber
            cozinhar.
          </p>
        </div>

        {/* Visual */}
        <div className="fade-in border border-white/30 p-7 md:p-8">
          <span className="font-mono text-[0.6rem] tracking-[4px] uppercase text-white/60 mb-4 block">
            O caminho visual
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-4">
            Ler o diagrama
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Entender por que o mapa é redondo (e era quadrado). O que cada
            camada mostra. Por que as linhas são coloridas. Como três formas
            simples — círculo, crescente e cruz — decodificam todos os símbolos
            planetários. Depois, a interpretação vem sozinha.
          </p>
        </div>
      </div>

      <blockquote className="fade-in font-display text-xl md:text-2xl text-center leading-relaxed max-w-[700px] mx-auto text-white/50 italic mb-12">
        &ldquo;Você não é um místico recebendo revelações. Você é um leitor. Um
        tradutor. Alguém que olha para um conjunto de símbolos e extrai
        significado deles.
        <br />
        <span className="text-white">
          Isso é uma habilidade. E habilidades se aprendem.
        </span>
        &rdquo;
      </blockquote>

      <div className="fade-in text-center">
        <CostarButton href={CHECKOUT_URLS.curso} variant="ghost">
          Quero aprender o método visual
        </CostarButton>
      </div>
    </CostarSection>
  );
}
