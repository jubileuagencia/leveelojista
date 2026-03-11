import type { SignKey } from "./astro-constants";

export interface HouseTheme {
  title: string;
  keywords: string;
  description: string;
}

export interface Evento {
  id: string;
  slug: string;
  titulo: string;
  tipo: string;
  signo: string;
  signo_key: SignKey;
  grau: string | null;
  data_evento: string;
  substack_url: string | null;
  cta_texto: string;
  cta_pergunta: string;
  header_label: string | null;
  house_themes: Record<string, HouseTheme>;
  is_active: boolean;
}

/**
 * Ordem dos signos para cálculo de casas inteiras.
 * Index 0 = Ari, 1 = Tau, ..., 11 = Pis
 */
const SIGN_ORDER: SignKey[] = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis",
];

/**
 * Calcula o mapa ascendente → casa para um evento em determinado signo.
 * Usa sistema de casas inteiras: o signo do evento define a casa 1 para
 * quem tem aquele signo como ascendente, casa 12 para o signo anterior, etc.
 */
export function calcularHouseMap(signoKeyEvento: SignKey): Record<SignKey, number> {
  const eventoIndex = SIGN_ORDER.indexOf(signoKeyEvento);
  const map = {} as Record<SignKey, number>;

  for (const ascSign of SIGN_ORDER) {
    const ascIndex = SIGN_ORDER.indexOf(ascSign);
    // Distância do ascendente até o signo do evento (em casas inteiras)
    const house = ((eventoIndex - ascIndex + 12) % 12) + 1;
    map[ascSign] = house;
  }

  return map;
}

/**
 * Dado um evento e o ascendente do usuário, retorna a casa e tema.
 */
export function getEventoParaAscendente(evento: Evento, ascSignKey: SignKey) {
  const houseMap = calcularHouseMap(evento.signo_key);
  const house = houseMap[ascSignKey] ?? 1;
  const theme = evento.house_themes[String(house)];

  return {
    house,
    theme: theme ?? {
      title: "Casa " + house,
      keywords: "",
      description: "",
    },
    meta: {
      substackUrl: evento.substack_url ?? "",
      ctaTexto: evento.cta_texto,
      ctaPergunta: evento.cta_pergunta,
      headerLabel: evento.header_label ?? `${evento.titulo} · ${formatDate(evento.data_evento)}`,
    },
  };
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}
