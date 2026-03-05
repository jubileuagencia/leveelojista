import SectionWrapper from "@/components/ui/SectionWrapper";

const PAINS = [
  {
    icon: "◎",
    title: "A jornada solitária",
    quote:
      "Estudo astrologia há meses, mas não tenho com quem trocar. Meus amigos acham que é horóscopo de revista.",
    body: "Você lê, assiste, anota — mas a reflexão morre ali. Sem troca, sem pergunta respondida, sem alguém que olhe pro mesmo mapa e veja outra camada. E a dúvida mais comum fica sem resposta: 'Será que estou interpretando certo?'",
  },
  {
    icon: "◇",
    title: "O conteúdo genérico",
    quote:
      "Todo mês é a mesma coisa: 'Mercúrio retrógrado, cuidado com contratos.' E daí?",
    body: "A maioria do conteúdo de astrologia é feita para viralizar, não para ensinar. Posts rasos que repetem fórmulas, sem mostrar o raciocínio por trás. Você quer profundidade, mas só encontra superfície.",
  },
  {
    icon: "△",
    title: "A falta de método",
    quote:
      "Tenho dezenas de anotações, mas não sei como conectar as peças. Cada fonte diz algo diferente.",
    body: "Sem um fio condutor, astrologia vira uma coleção de fragmentos desconectados. Você sabe coisas, mas não consegue formar uma leitura coerente. Falta um fio condutor — alguém que conecte as peças em tempo real.",
  },
];

export default function CamarimPainPoints() {
  return (
    <SectionWrapper id="problema" alt>
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Você estuda, anota, pesquisa — mas algo trava
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          Você já percebeu: ler artigos e assistir vídeos avulsos só te leva até
          certo ponto. Falta algo que conecte tudo.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PAINS.map((pain) => (
          <div
            key={pain.title}
            className="fade-in bg-white rounded-2xl border border-black/5 p-6 md:p-8 relative overflow-hidden group hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 via-gold/30 to-transparent" />

            <div className="text-3xl mb-4 opacity-40">{pain.icon}</div>

            <blockquote className="font-display text-sm md:text-base italic text-gold/90 mb-4 leading-relaxed">
              &ldquo;{pain.quote}&rdquo;
            </blockquote>

            <p className="text-text-soft text-sm leading-relaxed">
              {pain.body}
            </p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
