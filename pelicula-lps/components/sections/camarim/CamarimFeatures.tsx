import SectionWrapper from "@/components/ui/SectionWrapper";

const FEATURES = [
  {
    num: 1,
    name: "Spoiler da Semana — seu briefing semanal do céu",
    text: "Toda segunda, Victor abre o mapa astrológico dos próximos dias ao vivo. Trânsitos, aspectos relevantes e como eles conversam com o seu mapa natal. Não é previsão — é preparação.",
    highlight: "52 lives por ano. Uma nova lente toda semana.",
  },
  {
    num: 2,
    name: "A profundidade que não cabe num post",
    text: "Publicações semanais no Substack que vão além do Instagram. Análises de trânsitos, interpretações de lunações, artigos técnicos e reflexões que conectam céu e vida cotidiana.",
    highlight: "O conteúdo que você procura e não encontra em lugar nenhum.",
  },
  {
    num: 3,
    name: "Gente como você — uma comunidade que estuda de verdade",
    text: "Um espaço para trocar com quem leva astrologia a sério. Tire dúvidas, compartilhe descobertas do seu mapa, discuta trânsitos da semana e encontre companhia na jornada.",
    highlight: "Sozinho, você acumula informação. Em comunidade, você constrói leitura.",
  },
  {
    num: 4,
    name: "Seu mapa, analisado ao vivo",
    text: "Victor traz análises voltadas para mapas específicos de membros. Seu mapa vira objeto de estudo — e você vê, na prática, como uma leitura profissional funciona.",
    highlight: "O tipo de atenção que só existe em consulta particular.",
  },
  {
    num: 5,
    name: "Entrou agora? Assista tudo desde o início",
    text: "Acesso ao acervo completo de lives anteriores, publicações e materiais exclusivos. Mais de 100 horas de conteúdo disponíveis no seu ritmo.",
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
          O que muda na sua semana quando você entra
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          Uma estrutura que transforma consumo passivo em prática ativa de
          astrologia — toda semana, sem exceção.
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
