export const CHECKOUT_URLS = {
  curso: "/checkout",
  pacote: "/checkout",
} as const;

export const PRICING = {
  curso: {
    price: 147,
    installments: 12,
    installmentValue: "14,23",
  },
  pacote: {
    price: 297,
    installments: 12,
    installmentValue: "28,76",
  },
} as const;

export const COURSE_META = {
  lessons: 23,
  modules: 6,
  duration: "~2h",
  layers: 5,
  shapes: 3,
} as const;

export const CAMARIM_CHECKOUT_URLS = {
  mensal: "/checkout",
  anual: "/checkout",
} as const;

export const CAMARIM_PRICING = {
  mensal: {
    price: 19,
    period: "mês",
  },
  anual: {
    price: 297,
    installments: 12,
    installmentValue: "31",
  },
} as const;

export const CAMARIM_META = {
  livesPerYear: 52,
  members: "12+",
  contentFrequency: "semanal",
} as const;
