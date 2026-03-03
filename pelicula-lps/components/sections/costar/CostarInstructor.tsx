import Image from "next/image";
import CostarSection from "@/components/ui/CostarSection";

export default function CostarInstructor() {
  return (
    <CostarSection id="instrutor">
      <div className="text-center mb-5">
        <span className="fade-in font-mono text-[0.6rem] font-bold tracking-[5px] uppercase text-white/30 mb-5 block">
          Quem ensina
        </span>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-start max-w-[900px] mx-auto">
        {/* Photo */}
        <div className="fade-in flex flex-col items-center">
          <div className="w-48 h-48 md:w-60 md:h-60 overflow-hidden border border-white/10 relative">
            <Image
              src="/assets/victor-studio.jpeg"
              alt="Victor — Película Sideral"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 192px, 240px"
            />
          </div>
          <p className="font-mono text-[0.6rem] tracking-[2px] text-white/25 mt-4 uppercase">
            Astrólogo · Cineasta · Método visual
          </p>
        </div>

        {/* Bio */}
        <div>
          <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-5">
            Victor — <span className="text-white/60">Película Sideral</span>
          </h2>

          <div className="fade-in space-y-4 text-white/50 text-base leading-relaxed">
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

          <div className="fade-in mt-7 space-y-2">
            <p className="font-mono text-[0.6rem] tracking-[3px] uppercase text-white/25 mb-4">
              O que mais dizem sobre o Victor:
            </p>
            <ul className="space-y-3 text-white/40 text-sm">
              {[
                "Centenas de comentários no Instagram elogiando a didática",
                "Personalidades e criadores de conteúdo reconhecem publicamente sua forma de ensinar",
                "Comunidade ativa no Substack (Camarin Sideral)",
                '"Nunca ninguém me explicou astrologia assim" — o elogio mais frequente',
              ].map((cred) => (
                <li key={cred} className="flex items-start gap-3">
                  <span className="text-white/20 mt-1 flex-shrink-0">·</span>
                  {cred}
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="fade-in mt-7 border-l border-white/15 pl-6 py-2">
            <p className="font-display text-base md:text-lg italic text-white/50 leading-relaxed">
              &ldquo;Eu trato o mapa astral como um diretor trata um storyboard.
              Cada símbolo conta algo. Cada linha conecta partes da história. Meu
              trabalho é te ensinar a ler essa história — não decorar
              receitas.&rdquo;
            </p>
          </blockquote>

          <p className="fade-in mt-7 text-white/40 text-sm leading-relaxed">
            No curso Decifrando o Mapa Astral, Victor ensina do zero: a partir
            de três formas geométricas (círculo, crescente e cruz), ele constrói
            todo o vocabulário visual que você precisa para olhar para qualquer
            mapa e entender o que está vendo. Ele traduz o céu para a linguagem
            do cinema e do teatro — e é exatamente por isso que centenas de
            pessoas dizem que, com ele, astrologia finalmente faz sentido.
          </p>
        </div>
      </div>
    </CostarSection>
  );
}
