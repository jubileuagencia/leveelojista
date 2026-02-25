import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────

export interface TierDiscountsConfig {
  bronze: number
  silver: number
  gold: number
}

// ── Fetch Tier Discounts ───────────────────────────────

export async function fetchTierDiscounts(): Promise<TierDiscountsConfig> {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', 'tier_discounts')
    .single()

  if (error) {
    throw new Error(`Falha ao buscar configurações: ${error.message}`)
  }

  return (data?.value as unknown as TierDiscountsConfig) ?? { bronze: 0, silver: 4, gold: 8 }
}

// ── Update Tier Discounts ──────────────────────────────

export async function updateTierDiscounts(discounts: TierDiscountsConfig): Promise<void> {
  const { error } = await supabase
    .from('app_config')
    .update({ value: discounts as unknown as Record<string, unknown> })
    .eq('key', 'tier_discounts')

  if (error) {
    throw new Error(`Falha ao salvar configurações: ${error.message}`)
  }
}
