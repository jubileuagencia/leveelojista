import type { SignKey } from "./astro-constants";

/**
 * Cazimi Mercúrio-Sol — 08/03/2026 em Peixes
 *
 * Este mapa associa cada signo ascendente à casa onde o cazimi cai.
 * A casa é determinada pelo sistema de casas inteiras com o evento em Peixes.
 */
export const ECLIPSE_HOUSE_MAP: Record<SignKey, number> = {
  Ari: 12,  // Peixes na casa 12
  Tau: 11,  // Peixes na casa 11
  Gem: 10,  // Peixes na casa 10
  Can: 9,   // Peixes na casa 9
  Leo: 8,   // Peixes na casa 8
  Vir: 7,   // Peixes na casa 7
  Lib: 6,   // Peixes na casa 6
  Sco: 5,   // Peixes na casa 5
  Sag: 4,   // Peixes na casa 4
  Cap: 3,   // Peixes na casa 3
  Aqu: 2,   // Peixes na casa 2
  Pis: 1,   // Peixes na casa 1
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
      "A pérola cai direto no seu colo. O cazimi ilumina quem você é — um flash de clareza sobre sua identidade, seu corpo, a forma como se apresenta ao mundo. A revelação é pessoal e intransferível.",
  },
  2: {
    title: "Recursos e Valores",
    keywords: "dinheiro, autoestima, posses",
    description:
      "A pérola aparece nos seus recursos. O cazimi traz clareza sobre o que você realmente valoriza — seu dinheiro, seus talentos, sua autoestima. Um insight sobre o que merece seu investimento.",
  },
  3: {
    title: "Comunicação e Entorno",
    keywords: "irmãos, vizinhos, escrita, aprendizado",
    description:
      "A pérola chega como uma mensagem. O cazimi ilumina suas trocas cotidianas — uma conversa, uma ideia, uma escrita que finalmente encontra forma. O pensamento que escapava agora se revela.",
  },
  4: {
    title: "Lar e Raízes",
    keywords: "família, casa, memória, fundações",
    description:
      "A pérola está nas suas fundações. O cazimi traz clareza sobre sua vida doméstica, suas raízes, sua história familiar. Algo no espaço que você chama de lar pede para ser visto com novos olhos.",
  },
  5: {
    title: "Criatividade e Prazer",
    keywords: "romance, filhos, arte, expressão",
    description:
      "A pérola brilha no palco. O cazimi acende um flash criativo — um projeto, um romance, uma forma de expressão que estava submersa. A alegria encontra um caminho de volta.",
  },
  6: {
    title: "Rotina e Saúde",
    keywords: "trabalho diário, hábitos, corpo, serviço",
    description:
      "A pérola aparece no cotidiano. O cazimi ilumina seus hábitos, sua saúde, sua rotina de trabalho. Um insight prático sobre o que precisa mudar no dia a dia para você funcionar melhor.",
  },
  7: {
    title: "Relacionamentos e Parcerias",
    keywords: "parceiro, contratos, o outro",
    description:
      "A pérola está no espelho do outro. O cazimi traz clareza sobre seus relacionamentos — uma verdade sobre uma parceria amorosa, profissional ou legal que finalmente se revela.",
  },
  8: {
    title: "Transformação e Profundidade",
    keywords: "crises, sexualidade, heranças, recursos compartilhados",
    description:
      "A pérola emerge das profundezas. O cazimi mergulha nas suas águas mais intensas — intimidade, finanças compartilhadas, processos de transformação. O que estava submerso vem à tona.",
  },
  9: {
    title: "Expansão e Significado",
    keywords: "viagens, estudos, filosofia, estrangeiro",
    description:
      "A pérola expande sua visão. O cazimi traz um flash de clareza sobre seu propósito, uma viagem, um estudo ou uma crença que precisa ser revista. Sua bússola interna se recalibra.",
  },
  10: {
    title: "Carreira e Propósito Público",
    keywords: "profissão, reputação, vocação, autoridade",
    description:
      "A pérola aparece na sua vitrine. O cazimi ilumina sua posição no mundo — carreira, reputação, vocação. Um momento de clareza sobre o caminho profissional e o que você projeta publicamente.",
  },
  11: {
    title: "Comunidade e Futuro",
    keywords: "amigos, grupos, projetos coletivos, esperanças",
    description:
      "A pérola brilha no coletivo. O cazimi traz clareza sobre seus círculos sociais, amizades e visões de futuro. Um projeto coletivo ou um sonho de longo prazo ganha nova perspectiva.",
  },
  12: {
    title: "Inconsciente e Recolhimento",
    keywords: "isolamento, espiritualidade, karma, finalizações",
    description:
      "A pérola está no fundo do oceano. O cazimi toca o espaço mais íntimo e invisível do seu mapa — processos internos, finalizações, espiritualidade. O que estava escondido finalmente se revela.",
  },
};

export const ECLIPSE_META = {
  date: "08/03/2026",
  type: "Cazimi",
  sign: "Peixes",
  degree: "18°",
  substackUrl: "https://peliculasideral.substack.com/p/a-perola-que-o-oceano-queria-te-dar",
} as const;
