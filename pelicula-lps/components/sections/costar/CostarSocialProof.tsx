import Image from "next/image";
import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

const TESTIMONIALS = [
  {
    username: "@estudante_astrologia",
    text: "Cara, eu FINALMENTE entendi o que são as casas astrológicas. O Victor explica como se tivesse sentado do meu lado tomando um café. Em 10 minutos fez mais sentido do que meses lendo blog.",
  },
  {
    username: "@cinema_e_estrelas",
    text: "A analogia do cinema com os planetas como atores mudou completamente como eu olho pro mapa. Genial.",
  },
  {
    username: "@curiosa_sideral",
    text: "Fiz outros cursos de astrologia e sempre travava. O Victor é o primeiro que me fez ENXERGAR o mapa em vez de decorar receita. A forma como ele traduz o céu pra linguagem visual é absurda.",
  },
  {
    username: "@lua_em_peixes",
    text: "Nunca ninguém me explicou astrologia assim. A gente sente que finalmente tá entendendo o mapa de verdade, não só repetindo o que leu num artigo.",
  },
];

export default function CostarSocialProof() {
  return (
    <CostarSection id="depoimentos" alt>
      <div className="text-center mb-16">
        <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-5 max-w-[640px] mx-auto">
          Centenas de pessoas já descobriram que entender o céu não precisa ser
          complicado
        </h2>
        <p className="fade-in text-white/50 text-lg max-w-[560px] mx-auto">
          O maior elogio que o Victor recebe — de alunos, seguidores e até
          personalidades — é sempre o mesmo: &ldquo;nunca ninguém me explicou
          assim.&rdquo;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.username}
            className="fade-in border border-white/[0.08] p-6 hover:border-white/20 transition-colors duration-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/40 text-xs font-mono">
                {t.username.charAt(1).toUpperCase()}
              </div>
              <span className="font-mono text-[0.65rem] text-white/30 tracking-wide">
                {t.username}
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed italic font-display">
              &ldquo;{t.text}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Victor photo */}
      <div className="fade-in flex justify-center mt-12 mb-10">
        <div className="relative w-44 h-56 border border-white/10 overflow-hidden">
          <Image
            src="/assets/victor-livros.png"
            alt="Victor com livros"
            fill
            className="object-cover grayscale"
            sizes="176px"
          />
        </div>
      </div>

      <div className="fade-in text-center">
        <p className="text-white/25 text-sm mb-6 font-mono text-[0.65rem] tracking-[2px]">
          Junte-se a milhares de pessoas que já estão aprendendo a ler o céu.
        </p>
        <CostarButton href={CHECKOUT_URLS.curso} variant="ghost">
          Quero fazer parte
        </CostarButton>
      </div>
    </CostarSection>
  );
}
