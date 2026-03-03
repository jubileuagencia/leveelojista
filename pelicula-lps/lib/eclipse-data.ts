import type { SignKey } from "./astro-constants";

/**
 * Eclipse Lunar Total — 03/03/2026 a 15°29' de Virgem
 *
 * Este mapa associa cada signo ascendente à casa onde o eclipse cai.
 * A casa é determinada pelo sistema de casas Placidus com o eclipse a ~15° Virgem.
 */
export const ECLIPSE_HOUSE_MAP: Record<SignKey, number> = {
  Ari: 6,   // Virgem na casa 6
  Tau: 5,   // Virgem na casa 5
  Gem: 4,   // Virgem na casa 4
  Can: 3,   // Virgem na casa 3
  Leo: 2,   // Virgem na casa 2
  Vir: 1,   // Virgem na casa 1
  Lib: 12,  // Virgem na casa 12
  Sco: 11,  // Virgem na casa 11
  Sag: 10,  // Virgem na casa 10
  Cap: 9,   // Virgem na casa 9
  Aqu: 8,   // Virgem na casa 8
  Pis: 7,   // Virgem na casa 7
};

export interface HouseTheme {
  title: string;
  keywords: string;
  description: string;
}

export const HOUSE_THEMES: Record<number, HouseTheme> = {
  1: {
    title: "Identidade e Autoimagem",
    keywords: "corpo, aparência, persona",
    description:
      "O eclipse ilumina quem você é — e quem está se tornando. Momento de reinvenção da sua apresentação ao mundo. Algo na sua identidade precisa ser liberado para que o novo emerja.",
  },
  2: {
    title: "Recursos e Valores",
    keywords: "dinheiro, autoestima, posses",
    description:
      "O eclipse mexe com o que você valoriza — inclusive seu próprio valor. Revisão de finanças, talentos e o que você realmente precisa para se sentir seguro(a).",
  },
  3: {
    title: "Comunicação e Entorno",
    keywords: "irmãos, vizinhos, escrita, aprendizado",
    description:
      "O eclipse agita suas trocas cotidianas. Uma conversa importante, uma ideia que muda de forma, ou um deslocamento que altera sua perspectiva. O modo como você pensa está em transformação.",
  },
  4: {
    title: "Lar e Raízes",
    keywords: "família, casa, memória, fundações",
    description:
      "O eclipse toca suas fundações. Algo na sua vida doméstica ou nas suas raízes familiares pede atenção. Encerramentos ou renovações no espaço que você chama de lar.",
  },
  5: {
    title: "Criatividade e Prazer",
    keywords: "romance, filhos, arte, expressão",
    description:
      "O eclipse acende o palco da sua criatividade e alegria. Um projeto artístico, um romance ou a relação com uma criança pode passar por uma virada significativa.",
  },
  6: {
    title: "Rotina e Saúde",
    keywords: "trabalho diário, hábitos, corpo, serviço",
    description:
      "O eclipse reorganiza seu cotidiano. Hábitos de saúde, rotina de trabalho ou a relação com quem você serve (e quem serve você) pedem revisão profunda.",
  },
  7: {
    title: "Relacionamentos e Parcerias",
    keywords: "parceiro, contratos, o outro",
    description:
      "O eclipse ilumina seus relacionamentos mais próximos. Uma parceria — amorosa, profissional ou legal — chega a um ponto de virada. O espelho do outro revela algo sobre você.",
  },
  8: {
    title: "Transformação e Profundidade",
    keywords: "crises, sexualidade, heranças, recursos compartilhados",
    description:
      "O eclipse mergulha nas suas águas mais profundas. Temas de intimidade, finanças compartilhadas ou processos de transformação interna ganham intensidade. Morte simbólica e renascimento.",
  },
  9: {
    title: "Expansão e Significado",
    keywords: "viagens, estudos, filosofia, estrangeiro",
    description:
      "O eclipse expande (ou questiona) sua visão de mundo. Uma viagem, um curso, uma crise de fé ou uma descoberta filosófica pode mudar sua bússola interna.",
  },
  10: {
    title: "Carreira e Propósito Público",
    keywords: "profissão, reputação, vocação, autoridade",
    description:
      "O eclipse destaca sua posição no mundo. Um momento decisivo na carreira, na reputação ou no caminho vocacional. O que você projeta publicamente está em transformação.",
  },
  11: {
    title: "Comunidade e Futuro",
    keywords: "amigos, grupos, projetos coletivos, esperanças",
    description:
      "O eclipse mexe com seus círculos sociais e visões de futuro. Amizades, grupos ou projetos coletivos passam por renovação. Seus sonhos de longo prazo pedem revisão.",
  },
  12: {
    title: "Inconsciente e Recolhimento",
    keywords: "isolamento, espiritualidade, karma, finalizações",
    description:
      "O eclipse toca o espaço mais íntimo e invisível do seu mapa. Momento de recolhimento, processos internos profundos e finalizações. O que estava escondido vem à luz.",
  },
};

export const ECLIPSE_META = {
  date: "03/03/2026",
  type: "Lunar Total",
  sign: "Virgem",
  degree: "15°29'",
  substackUrl: "https://peliculasideral.substack.com/",
} as const;
