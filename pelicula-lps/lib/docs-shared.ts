export type DocCategory =
  | "stories"
  | "prd"
  | "architecture"
  | "campanhas"
  | "entregas"
  | "templates"
  | "roteiros"
  | "geral";

export type DocEntry = {
  slug: string;
  title: string;
  category: DocCategory;
  fileName: string;
  relativePath: string;
  sizeKb: number;
};

export const categoryLabels: Record<DocCategory, string> = {
  stories: "Stories",
  prd: "PRD",
  architecture: "Arquitetura",
  campanhas: "Campanhas",
  entregas: "Entregas",
  templates: "Templates",
  roteiros: "Roteiros",
  geral: "Geral",
};

export const categoryColors: Record<DocCategory, string> = {
  stories: "bg-gold/20 text-gold",
  prd: "bg-purple/20 text-purple-light",
  architecture: "bg-aspect-blue/20 text-aspect-blue",
  campanhas: "bg-aspect-green/20 text-aspect-green",
  entregas: "bg-aspect-red/20 text-aspect-red",
  templates: "bg-white/10 text-text-soft",
  roteiros: "bg-gold-light/20 text-gold-light",
  geral: "bg-white/5 text-text-muted",
};
