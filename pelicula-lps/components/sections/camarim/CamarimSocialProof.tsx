import SectionWrapper from "@/components/ui/SectionWrapper";

const TESTIMONIALS = [
  {
    username: "@membro_camarim",
    text: "O Spoiler da Semana virou meu ritual. Toda segunda eu já sei o que prestar atenção na semana — e quando olho pro meu mapa, as peças finalmente se encaixam.",
  },
  {
    username: "@astro_iniciante",
    text: "Eu fiz o curso Decifrando e achei incrível, mas o Camarim é onde a mágica acontece. É a prática que faltava. Cada live é um mini-curso novo.",
  },
  {
    username: "@lua_crescente",
    text: "Victor tem um dom de explicar o complexo de um jeito que parece simples. Nas lives ele responde perguntas do meu mapa pessoal — isso não tem preço.",
  },
  {
    username: "@venus_em_touro",
    text: "O nível do conteúdo do Substack é absurdo. Não é horóscopo de revista. São análises que eu releio três vezes e descubro algo novo. E a comunidade é acolhedora demais.",
  },
];

export default function CamarimSocialProof() {
  return (
    <SectionWrapper id="depoimentos" alt>
      <div className="text-center mb-14">
        <h2 className="fade-in font-display text-3xl md:text-4xl font-bold mb-4 max-w-[700px] mx-auto">
          Quem está no Camarim não quer sair
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[600px] mx-auto">
          Membros que descobriram que astrologia faz mais sentido quando se
          estuda junto, toda semana, com orientação.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5 max-w-[900px] mx-auto">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.username}
            className="fade-in bg-white rounded-2xl border border-black/5 p-6 hover:border-gold/20 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center text-gold text-sm font-bold">
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
        Junte-se a quem já está aprofundando a prática toda semana no Camarim
        Sideral.
      </p>
    </SectionWrapper>
  );
}
