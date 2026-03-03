import SectionWrapper from "@/components/ui/SectionWrapper";

const PAINS = [
  {
    icon: "◯",
    title: "O choque visual",
    quote:
      "Gerei meu mapa no Astro.com e parecia uma placa de circuito alienígena.",
    body: "Símbolos que parecem arbitrários. Linhas que não fazem sentido. Um círculo dividido em fatias desiguais com rabiscos antigos espalhados. Você não sabe nem por onde começar a olhar.",
  },
  {
    icon: "☽",
    title: "A fragmentação",
    quote:
      "Li dezenas de artigos e cada um dizia algo diferente sobre o meu mapa.",
    body: "Sem uma estrutura de leitura, você fica pulando de fragmento em fragmento — um post sobre Lua em Peixes aqui, um vídeo sobre Casa 7 ali — sem nunca montar o quebra-cabeça inteiro.",
  },
  {
    icon: "✚",
    title: "O teto de vidro",
    quote:
      "Sei que sou de Leão com Lua em Peixes, mas e daí? O que eu faço com isso?",
    body: "Saber o signo solar é como saber que existe um mapa do metrô. Não é a mesma coisa que saber usá-lo. Você tem informação, mas não tem método.",
  },
];

export default function PainPoints() {
  return (
    <SectionWrapper id="problema" alt>
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Você já tentou ler seu mapa astral?
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          A maioria das pessoas abre o mapa, vê um emaranhado de símbolos e
          linhas coloridas, e fecha a aba. Normal. Ninguém te ensinou o
          alfabeto.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {PAINS.map((pain) => (
          <div
            key={pain.title}
            className="fade-in bg-card rounded-2xl border border-purple/20 p-6 md:p-8 relative overflow-hidden group hover:border-purple/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-aspect-red/60 via-aspect-red/30 to-transparent" />

            <div className="text-3xl mb-4 opacity-40">{pain.icon}</div>

            <blockquote className="font-display text-sm md:text-base italic text-gold-light/90 mb-4 leading-relaxed">
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
