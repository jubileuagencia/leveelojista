import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function Instructor() {
  return (
    <SectionWrapper id="instrutor" alt>
      <div className="text-center mb-4">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          Quem ensina
        </span>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start max-w-[900px] mx-auto">
        {/* Photo */}
        <div className="fade-in flex flex-col items-center">
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-2 border-gold/20 relative">
            <Image
              src="/assets/victor-studio.jpeg"
              alt="Victor — Película Sideral"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 256px"
            />
          </div>
          <p className="font-mono text-xs text-text-muted mt-3">
            Astrólogo, cineasta e criador do método visual
          </p>
        </div>

        {/* Bio */}
        <div>
          <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-4">
            Victor — <span className="text-gold-light">Película Sideral</span>
          </h2>

          <div className="fade-in space-y-4 text-text-soft text-base leading-relaxed">
            <p>
              Victor é o criador da Película Sideral — um projeto na interseção
              entre astrologia, cinema e design de informação.
            </p>
            <p>
              Formado em cinema documental, ele traz pro ensino de astrologia o
              que aprendeu com roteiro: clareza narrativa, estrutura visual e a
              obsessão por tornar o complexo acessível.
            </p>
          </div>

          {/* Credentials */}
          <div className="fade-in mt-6 space-y-2">
            <p className="font-mono text-xs tracking-[2px] uppercase text-text-muted mb-3">
              O que mais dizem sobre o Victor:
            </p>
            <ul className="space-y-2 text-text-soft text-sm">
              {[
                "Centenas de comentários no Instagram elogiando a didática",
                "Personalidades e criadores de conteúdo reconhecem publicamente sua forma de ensinar",
                "Comunidade ativa no Substack (Camarin Sideral)",
                '"Nunca ninguém me explicou astrologia assim" — o elogio mais frequente',
              ].map((cred) => (
                <li key={cred} className="flex items-start gap-2">
                  <span className="text-gold mt-1 flex-shrink-0">·</span>
                  {cred}
                </li>
              ))}
            </ul>
          </div>

          {/* Quote */}
          <blockquote className="fade-in mt-6 border-l-2 border-gold/30 pl-5 py-2">
            <p className="font-display text-base md:text-lg italic text-gold-light/90 leading-relaxed">
              &ldquo;Eu trato o mapa astral como um diretor trata um storyboard.
              Cada símbolo conta algo. Cada linha conecta partes da história. Meu
              trabalho é te ensinar a ler essa história — não decorar
              receitas.&rdquo;
            </p>
          </blockquote>

          <p className="fade-in mt-6 text-text-soft text-sm leading-relaxed">
            No curso Decifrando o Mapa Astral, Victor ensina do zero: a partir
            de três formas geométricas (círculo, crescente e cruz), ele constrói
            todo o vocabulário visual que você precisa para olhar para qualquer
            mapa e entender o que está vendo. Ele traduz o céu para a linguagem
            do cinema e do teatro — e é exatamente por isso que centenas de
            pessoas dizem que, com ele, astrologia finalmente faz sentido.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}
