import { MercadoPagoConfig } from "mercadopago";

let config: MercadoPagoConfig | null = null;

export function getMPConfig() {
  if (config) return config;

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN must be set");
  }

  config = new MercadoPagoConfig({ accessToken });
  return config;
}
