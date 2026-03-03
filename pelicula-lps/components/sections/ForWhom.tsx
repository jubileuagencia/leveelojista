import SectionWrapper from "@/components/ui/SectionWrapper";

const FOR_YOU = [
  "Você gerou seu mapa no Astro.com e não entendeu nada",
  "Sabe seu signo solar mas quer ir muito além do horóscopo",
  "Já leu artigos e vídeos soltos mas sente que falta uma estrutura",
  "Quer aprender a LER o diagrama, não decorar interpretações",
  "Curte uma abordagem visual, com lógica — sem misticismo forçado",
  "Quer entender o próprio mapa sem depender de consultas",
];

const NOT_FOR_YOU = [
  "Já lê mapas astrais com fluência técnica",
  "Busca um curso de interpretação avançada ou previsão",
  'Quer respostas prontas tipo "seu destino é X"',
  "Prefere a abordagem esotérica/new age",
];

export default function ForWhom() {
  return (
    <SectionWrapper id="pra-quem">
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Este curso é pra você?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {/* For you */}
        <div className="fade-in bg-card rounded-2xl border border-gold/20 p-6 md:p-8">
          <h3 className="font-display text-lg font-semibold text-gold-light mb-5">
            É pra você se:
          </h3>
          <ul className="space-y-3">
            {FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-soft text-sm">
                <span className="text-gold mt-0.5 flex-shrink-0">&#10022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Not for you */}
        <div className="fade-in bg-card rounded-2xl border border-white/5 p-6 md:p-8">
          <h3 className="font-display text-lg font-semibold text-text-muted mb-5">
            Não é pra você se:
          </h3>
          <ul className="space-y-3">
            {NOT_FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-muted text-sm">
                <span className="text-aspect-red/60 mt-0.5 flex-shrink-0">&#10007;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
