import { MercadoPagoConfig } from "mercadopago";

let config: MercadoPagoConfig | null = null;

export function isMPConfigured(): boolean {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN;
}

export function getMPConfig() {
  if (config) return config;

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não configurado. Defina a variável de ambiente para habilitar pagamentos."
    );
  }

  config = new MercadoPagoConfig({ accessToken });
  return config;
}
