import SectionWrapper from "@/components/ui/SectionWrapper";

export default function CamarimDifferentiator() {
  return (
    <SectionWrapper id="diferencial" alt>
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          O diferencial
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          Consumir sozinho vs. aprofundar com quem entende
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          A diferença entre ler sobre astrologia e praticá-la toda semana com
          orientação é a mesma entre assistir um filme e analisar cada cena com o
          diretor.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Sozinho */}
        <div className="fade-in bg-white rounded-2xl border border-black/5 p-6 md:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-text-muted/40 to-transparent" />
          <span className="font-mono text-[0.65rem] tracking-[3px] uppercase text-text-muted mb-3 block">
            Consumir sozinho
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3 text-text-soft">
            Você sabe coisas. Mas não avança.
          </h3>
          <p className="text-text-soft text-sm leading-relaxed">
            Ler artigos genéricos, ver vídeos de horóscopo, anotar fragmentos sem
            saber como conectar. Sem prática guiada, sem troca, sem alguém que
            responda &ldquo;sim, é isso&rdquo; ou &ldquo;olha por esse outro
            ângulo&rdquo;. A informação acumula, mas a leitura não evolui.
          </p>
        </div>

        {/* Camarim */}
        <div className="fade-in bg-white rounded-2xl border border-gold/20 p-6 md:p-8 relative overflow-hidden gold-glow shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 to-transparent" />
          <span className="font-mono text-[0.65rem] tracking-[3px] uppercase text-gold mb-3 block">
            Aprofundar no Camarim
          </span>
          <h3 className="font-display text-xl md:text-2xl font-semibold mb-3">
            Você lê o céu. E entende o que vê.
          </h3>
          <p className="text-text-soft text-sm leading-relaxed">
            Toda semana, Victor abre o mapa do céu ao vivo e mostra como os
            trânsitos afetam o seu mapa. Você pergunta, troca com outros
            membros, recebe conteúdo exclusivo e vê sua leitura evoluir
            semana a semana. Não é consumir — é praticar.
          </p>
        </div>
      </div>

      <blockquote className="fade-in font-display text-xl md:text-2xl text-center leading-relaxed max-w-[750px] mx-auto text-text-soft italic">
        &ldquo;O céu muda toda semana. Seu entendimento também deveria.
        <br />
        <span className="text-gold">
          O Camarim é o espaço onde isso acontece.
        </span>
        &rdquo;
      </blockquote>
    </SectionWrapper>
  );
}
