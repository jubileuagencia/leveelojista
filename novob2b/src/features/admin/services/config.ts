import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────

export interface TierDiscountsConfig {
  ouro: number
  platina: number
  diamante: number
}

export interface DeliveryConfig {
  order_cutoff_time: string   // "HH:mm" format
  free_shipping_min: number   // minimum order for free shipping (R$)
  pix_discount_pct: number    // PIX discount percentage (e.g. 5)
  delivery_radius_km: number  // max delivery radius in km
}

// ── Generic config helpers ─────────────────────────────

async function getConfigValue<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    throw new Error(`Falha ao buscar configuracao "${key}": ${error.message}`)
  }

  return (data?.value as unknown as T) ?? fallback
}

async function setConfigValue<T>(key: string, value: T): Promise<void> {
  const { error } = await supabase
    .from('app_config')
    .upsert(
      { key, value: value as unknown as Record<string, unknown> },
      { onConflict: 'key' }
    )

  if (error) {
    throw new Error(`Falha ao salvar configuracao "${key}": ${error.message}`)
  }
}

// ── Fetch Tier Discounts ───────────────────────────────

export async function fetchTierDiscounts(): Promise<TierDiscountsConfig> {
  return getConfigValue('tier_discounts', { ouro: 0, platina: 4, diamante: 8 })
}

// ── Update Tier Discounts ──────────────────────────────

export async function updateTierDiscounts(discounts: TierDiscountsConfig): Promise<void> {
  await setConfigValue('tier_discounts', discounts)
}

// ── Fetch Delivery Config ──────────────────────────────

const DEFAULT_DELIVERY: DeliveryConfig = {
  order_cutoff_time: '18:00',
  free_shipping_min: 300,
  pix_discount_pct: 5,
  delivery_radius_km: 30,
}

export async function fetchDeliveryConfig(): Promise<DeliveryConfig> {
  return getConfigValue('delivery_config', DEFAULT_DELIVERY)
}

// ── Update Delivery Config ─────────────────────────────

export async function updateDeliveryConfig(config: DeliveryConfig): Promise<void> {
  await setConfigValue('delivery_config', config)
}
