import SectionWrapper from "@/components/ui/SectionWrapper";

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

export default function SocialProof() {
  return (
    <SectionWrapper id="depoimentos" alt>
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-4 max-w-[700px] mx-auto">
          Centenas de pessoas já descobriram que entender o céu não precisa ser
          complicado
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[600px] mx-auto">
          O maior elogio que o Victor recebe — de alunos, seguidores e até
          personalidades — é sempre o mesmo: &ldquo;nunca ninguém me explicou
          assim.&rdquo;
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.username}
            className="fade-in bg-card rounded-2xl border border-white/5 p-6 hover:border-purple/20 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-purple/20 flex items-center justify-center text-purple-light text-sm font-bold">
                {t.username.charAt(1).toUpperCase()}
              </div>
              <span className="font-mono text-xs text-text-muted">
                {t.username}
              </span>
            </div>
            <p className="text-text-soft text-sm leading-relaxed italic">
              &ldquo;{t.text}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <p className="fade-in text-center text-text-muted text-sm mt-10 font-mono">
        Junte-se a milhares de pessoas que já estão aprendendo a ler o céu com a
        Película Sideral.
      </p>
    </SectionWrapper>
  );
}
