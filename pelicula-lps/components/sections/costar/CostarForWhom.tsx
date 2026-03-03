import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

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

export default function CostarForWhom() {
  return (
    <CostarSection id="pra-quem">
      <div className="text-center mb-16">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          Este curso é pra você?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-[900px] mx-auto">
        <div className="fade-in border border-white/20 p-7 md:p-8">
          <h3 className="font-mono text-[0.65rem] tracking-[4px] uppercase text-white/60 mb-6">
            É pra você se:
          </h3>
          <ul className="space-y-4">
            {FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/50 text-sm">
                <span className="text-white mt-0.5 flex-shrink-0 text-xs">+</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="fade-in border border-white/[0.06] p-7 md:p-8">
          <h3 className="font-mono text-[0.65rem] tracking-[4px] uppercase text-white/30 mb-6">
            Não é pra você se:
          </h3>
          <ul className="space-y-4">
            {NOT_FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/30 text-sm">
                <span className="text-white/20 mt-0.5 flex-shrink-0 text-xs">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fade-in text-center mt-14">
        <CostarButton href={CHECKOUT_URLS.curso}>
          Quero decifrar meu mapa
        </CostarButton>
      </div>
    </CostarSection>
  );
}
