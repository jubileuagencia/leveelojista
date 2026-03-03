import SectionWrapper from "@/components/ui/SectionWrapper";

const FEATURES = [
  {
    num: 1,
    name: "Spoiler da Semana (live semanal)",
    text: "Toda semana, Victor abre o mapa astrológico dos próximos dias ao vivo. Trânsitos, aspectos relevantes e como eles conversam com o seu mapa natal. Não é previsão — é preparação.",
    highlight: "52 lives por ano. Uma nova lente toda semana.",
  },
  {
    num: 2,
    name: "Conteúdo exclusivo no Substack",
    text: "Publicações semanais que vão além do que está no Instagram. Análises de trânsitos, interpretações de lunações, artigos sobre técnicas astrológicas e reflexões que conectam céu e vida cotidiana.",
    highlight: "O conteúdo que não cabe num post de 2.200 caracteres.",
  },
  {
    num: 3,
    name: "Comunidade de estudo",
    text: "Um espaço para trocar com outras pessoas que estudam astrologia de verdade. Tire dúvidas, compartilhe descobertas do seu mapa, discuta trânsitos da semana e encontre companhia na jornada.",
    highlight: "Aprender sozinho tem teto. Em comunidade, não.",
  },
  {
    num: 4,
    name: "Interpretações personalizadas",
    text: "Periodicamente, Victor traz análises voltadas para mapas específicos de membros. Seu mapa vira objeto de estudo — e você vê, na prática, como uma leitura profissional funciona.",
    highlight: null,
  },
  {
    num: 5,
    name: "Arquivo completo",
    text: "Acesso ao acervo de todas as lives anteriores, publicações e materiais exclusivos. Entrou agora? Pode assistir tudo desde o início, no seu ritmo.",
    highlight: null,
  },
];

export default function CamarimFeatures() {
  return (
    <SectionWrapper id="conteudo-camarim">
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          O que você recebe
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Cinco pilares do Camarim
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          Uma estrutura semanal que transforma consumo passivo em prática ativa
          de astrologia.
        </p>
      </div>

      <div className="space-y-6 max-w-[800px] mx-auto">
        {FEATURES.map((feature) => (
          <div
            key={feature.num}
            className="fade-in flex gap-4 group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center font-mono text-sm text-gold font-bold group-hover:bg-gold/10 transition-colors">
              {feature.num}
            </div>
            <div>
              <h3 className="font-display text-lg md:text-xl font-semibold mb-1 text-gold">
                {feature.name}
              </h3>
              <p className="text-text-soft text-sm leading-relaxed mb-2">
                {feature.text}
              </p>
              {feature.highlight && (
                <p className="text-xs font-mono text-gold/70 italic">
                  &ldquo;{feature.highlight}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
