import CostarSection from "@/components/ui/CostarSection";
import CostarButton from "@/components/ui/CostarButton";
import { CHECKOUT_URLS } from "@/lib/constants";

const PAINS = [
  {
    icon: "☉",
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
    icon: "✦",
    title: "O teto de vidro",
    quote:
      "Sei que sou de Leão com Lua em Peixes, mas e daí? O que eu faço com isso?",
    body: "Saber o signo solar é como saber que existe um mapa do metrô. Não é a mesma coisa que saber usá-lo. Você tem informação, mas não tem método.",
  },
];

export default function CostarPainPoints() {
  return (
    <CostarSection id="problema" alt>
      <div className="text-center mb-16">
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-5">
          Você já tentou ler seu mapa astral?
        </h2>
        <p className="fade-in text-white/50 text-lg max-w-[640px] mx-auto">
          A maioria das pessoas abre o mapa, vê um emaranhado de símbolos e
          linhas coloridas, e fecha a aba. Normal. Ninguém te ensinou o
          alfabeto.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {PAINS.map((pain) => (
          <div
            key={pain.title}
            className="fade-in border border-white/[0.08] p-7 md:p-8 group hover:border-white/20 transition-all duration-500"
          >
            <div className="text-2xl mb-5 text-white/30 font-light">{pain.icon}</div>

            <blockquote className="font-display text-sm md:text-base italic text-white/70 mb-5 leading-relaxed">
              &ldquo;{pain.quote}&rdquo;
            </blockquote>

            <p className="text-white/40 text-sm leading-relaxed">
              {pain.body}
            </p>
          </div>
        ))}
      </div>

      <div className="fade-in text-center mt-14">
        <p className="text-white/30 text-sm mb-6 font-mono tracking-wide">
          Existe um método para isso.
        </p>
        <CostarButton href={CHECKOUT_URLS.curso} variant="ghost">
          Quero aprender a ler o céu
        </CostarButton>
      </div>
    </CostarSection>
  );
}
