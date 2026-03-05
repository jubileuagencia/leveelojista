import SectionWrapper from "@/components/ui/SectionWrapper";

const FOR_YOU = [
  "Você já estuda astrologia (sozinho ou com cursos) e quer praticar toda semana",
  "Quer entender os trânsitos semanais e como eles afetam o SEU mapa",
  "Sente falta de uma comunidade séria para trocar sobre astrologia",
  "Quer ir além do horóscopo e aprender a ler o céu com profundidade",
  "Quer parar de depender de posts de Instagram para entender trânsitos",
  "Quer acompanhar o céu em tempo real, não só em teoria",
];

const NOT_FOR_YOU = [
  "Busca previsões prontas tipo 'seu destino é X'",
  "Quer apenas horóscopo diário genérico",
  "Não tem interesse em aprofundar o estudo de astrologia",
  "Não vai conseguir dedicar ~1h por semana para acompanhar",
];

export default function CamarimForWhom() {
  return (
    <SectionWrapper id="pra-quem">
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold">
          O Camarim é pra você?
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
        {/* For you */}
        <div className="fade-in bg-white rounded-2xl border border-gold/20 p-6 md:p-8 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-gold mb-5">
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
        <div className="fade-in bg-white rounded-2xl border border-black/5 p-6 md:p-8 shadow-sm">
          <h3 className="font-display text-lg font-semibold text-text-muted mb-5">
            Não é pra você se:
          </h3>
          <ul className="space-y-3">
            {NOT_FOR_YOU.map((item) => (
              <li key={item} className="flex items-start gap-3 text-text-muted text-sm">
                <span className="text-[#c25b5b]/60 mt-0.5 flex-shrink-0">&#10007;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
