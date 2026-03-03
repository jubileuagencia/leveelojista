import SectionWrapper from "@/components/ui/SectionWrapper";

const LAYERS = [
  {
    num: 1,
    name: "O Palco",
    text: "Antes de ler qualquer símbolo, entenda o espaço. O mapa tem três anéis concêntricos, uma bússola invertida (o Leste fica à esquerda), e quatro pontos cardeais que ancoram tudo: Ascendente, Descendente, Meio do Céu e Fundo do Céu.",
    highlight:
      "Os planetas são os atores. Os signos são os figurinos. As casas são os cenários. Os aspectos são os diálogos.",
  },
  {
    num: 2,
    name: "Os Atores",
    text: "Círculo, crescente e cruz. Três formas primitivas que, combinadas, geram TODOS os glifos planetários. Aprenda três formas e você decodifica Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno e os transpessoais.",
    highlight: "Três formas. Três princípios. Infinitas combinações.",
  },
  {
    num: 3,
    name: "Os Cenários",
    text: "As 12 fatias da roda. Cada uma é uma sala na casa da sua vida — carreira, relacionamentos, criatividade, mundo interior. As casas são ONDE os atores atuam.",
    highlight:
      "As casas são o cenário onde os planetas atuam. São as salas da casa da sua vida.",
  },
  {
    num: 4,
    name: "Os Diálogos",
    text: "As linhas coloridas no centro do mapa não são decoração. Vermelho = tensão. Azul = harmonia. Verde = ajuste. São conversas entre planetas — entre partes da sua psique.",
    highlight:
      "Quando você olha pro centro do mapa, não está vendo linhas. Está vendo a conversa entre as partes da sua psique.",
  },
  {
    num: 5,
    name: "As Legendas",
    text: "Graus, retrógrados, elementos, modalidades. O rodapé técnico que transforma uma leitura boa em uma leitura precisa. Como os créditos finais de um filme — quem não lê perde metade da história.",
    highlight: null,
  },
];

function MandalaSVG() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-[360px] mx-auto opacity-60"
    >
      {/* Outer zodiac ring */}
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke="#c9a23e"
        strokeWidth="1"
        opacity="0.3"
      />
      <circle
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke="#c9a23e"
        strokeWidth="0.5"
        opacity="0.2"
      />

      {/* House divisions */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 200 + Math.cos(rad) * 140;
        const y1 = 200 + Math.sin(rad) * 140;
        const x2 = 200 + Math.cos(rad) * 180;
        const y2 = 200 + Math.sin(rad) * 180;
        return (
          <line
            key={angle}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#6b4fa0"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}

      {/* Inner aspect circle */}
      <circle
        cx="200"
        cy="200"
        r="100"
        fill="none"
        stroke="#6b4fa0"
        strokeWidth="0.5"
        opacity="0.15"
      />

      {/* Aspect lines */}
      <line x1="140" y1="120" x2="280" y2="260" stroke="#c25b5b" strokeWidth="1" opacity="0.4" />
      <line x1="120" y1="240" x2="300" y2="180" stroke="#5b7ec2" strokeWidth="1" opacity="0.4" />
      <line x1="200" y1="100" x2="160" y2="290" stroke="#5bc27e" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
      <line x1="260" y1="120" x2="140" y2="280" stroke="#5b7ec2" strokeWidth="0.8" opacity="0.3" />
      <line x1="280" y1="200" x2="130" y2="150" stroke="#c25b5b" strokeWidth="0.8" opacity="0.3" />

      {/* Planet dots */}
      {[
        { x: 140, y: 120, color: "#c9a23e" },
        { x: 280, y: 260, color: "#e8c96a" },
        { x: 120, y: 240, color: "#9b7fd4" },
        { x: 300, y: 180, color: "#5b7ec2" },
        { x: 200, y: 100, color: "#c25b5b" },
        { x: 260, y: 120, color: "#c9a23e" },
        { x: 160, y: 290, color: "#5bc27e" },
        { x: 130, y: 150, color: "#9b7fd4" },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.color} opacity="0.7" />
      ))}

      {/* Cardinal labels */}
      <text x="32" y="204" fill="#c9a23e" fontSize="10" fontFamily="monospace" opacity="0.5">AC</text>
      <text x="358" y="204" fill="#c9a23e" fontSize="10" fontFamily="monospace" opacity="0.5">DC</text>
      <text x="192" y="30" fill="#c9a23e" fontSize="10" fontFamily="monospace" opacity="0.5">MC</text>
      <text x="194" y="386" fill="#c9a23e" fontSize="10" fontFamily="monospace" opacity="0.5">IC</text>
    </svg>
  );
}

export default function FiveLayers() {
  return (
    <SectionWrapper id="metodo">
      <div className="text-center mb-14">
        <span className="fade-in font-mono text-[0.7rem] font-bold tracking-[4px] uppercase text-gold mb-4 inline-block relative after:content-[''] after:block after:w-8 after:h-px after:bg-gold after:mt-2 after:mx-auto">
          O método
        </span>
        <h2 className="fade-in font-display text-3xl md:text-5xl font-bold mb-4">
          5 camadas. Uma mandala.
          <br />
          Uma linguagem.
        </h2>
        <p className="fade-in text-text-soft text-lg max-w-[700px] mx-auto">
          O mapa astral é um diagrama em camadas — como um filme tem cenário,
          atores, figurinos, diálogos e legendas. Você aprende a ler uma camada
          de cada vez. Quando chega na última, a história inteira faz sentido.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          {LAYERS.map((layer) => (
            <div
              key={layer.num}
              className="fade-in flex gap-4 group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center font-mono text-sm text-gold font-bold group-hover:bg-gold/10 transition-colors">
                {layer.num}
              </div>
              <div>
                <h3 className="font-display text-lg md:text-xl font-semibold mb-1 text-gold-light">
                  {layer.name}
                </h3>
                <p className="text-text-soft text-sm leading-relaxed mb-2">
                  {layer.text}
                </p>
                {layer.highlight && (
                  <p className="text-xs font-mono text-gold/70 italic">
                    &ldquo;{layer.highlight}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fade-in hidden lg:block sticky top-24">
          <MandalaSVG />
        </div>
      </div>
    </SectionWrapper>
  );
}
