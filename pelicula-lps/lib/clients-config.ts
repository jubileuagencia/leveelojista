export type ClientData = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  contacts: { name: string; role: string }[];
  clickupTag: string;
  folderPath: string;
  color: string;
};

export const clients: ClientData[] = [
  {
    id: "pelicula",
    name: "Pelicula Sideral",
    emoji: "🌙",
    description:
      "Plataforma de astrologia com cursos, comunidade e conteudo semanal. Funil perpetuo com LP Decifrando + Camarim.",
    contacts: [
      { name: "Victor Dhornelas", role: "Fundador" },
      { name: "Sylvia Fernandes", role: "Co-fundadora" },
    ],
    clickupTag: "pelicula-sideral",
    folderPath: "PELICULA SIDERAL",
    color: "text-gold",
  },
  {
    id: "levee",
    name: "Levee",
    emoji: "🌊",
    description:
      "Consultoria de marca e planejamento estrategico. Foco em posicionamento e narrativa de marca.",
    contacts: [{ name: "Fernando de Souza", role: "Consultor" }],
    clickupTag: "levee",
    folderPath: "LEVEE",
    color: "text-aspect-blue",
  },
  {
    id: "caracol",
    name: "Caracol Records",
    emoji: "🐌",
    description:
      "Selo musical independente. Produção audiovisual, lancamentos e estrategia de divulgacao.",
    contacts: [{ name: "Gabriel Campos", role: "Produtor" }],
    clickupTag: "caracol-records",
    folderPath: "CARACOL RECORDS",
    color: "text-purple-light",
  },
];
