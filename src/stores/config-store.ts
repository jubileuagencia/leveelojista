import { create } from 'zustand'
import type { TierDiscounts } from '@/types/database'
import { supabase } from '@/lib/supabase'

export interface DeliverySettings {
  order_cutoff_time: string
  free_shipping_min: number
  pix_discount_pct: number
  delivery_radius_km: number
}

interface ConfigState {
  tierDiscounts: TierDiscounts
  delivery: DeliverySettings
  loading: boolean

  fetchConfig: () => Promise<void>
  subscribe: () => () => void
}

const DEFAULT_DISCOUNTS: TierDiscounts = { platina: 0.04, diamante: 0.08 }
const DEFAULT_DELIVERY: DeliverySettings = {
  order_cutoff_time: '18:00',
  free_shipping_min: 300,
  pix_discount_pct: 5,
  delivery_radius_km: 30,
}

export const useConfigStore = create<ConfigState>((set) => ({
  tierDiscounts: DEFAULT_DISCOUNTS,
  delivery: DEFAULT_DELIVERY,
  loading: true,

  fetchConfig: async () => {
    const { data } = await supabase
      .from('app_config')
      .select('key, value')
      .in('key', ['tier_discounts', 'delivery_config'])

    if (data) {
      const updates: Partial<ConfigState> = { loading: false }
      for (const row of data) {
        if (row.key === 'tier_discounts' && row.value) {
          updates.tierDiscounts = row.value as unknown as TierDiscounts
        }
        if (row.key === 'delivery_config' && row.value) {
          updates.delivery = row.value as unknown as DeliverySettings
        }
      }
      set(updates)
    } else {
      set({ loading: false })
    }
  },

  subscribe: () => {
    const channel = supabase
      .channel('config-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'app_config',
      }, (payload) => {
        const row = payload.new as { key: string; value: unknown }
        if (row.key === 'tier_discounts' && row.value) {
          set({ tierDiscounts: row.value as TierDiscounts })
        }
        if (row.key === 'delivery_config' && row.value) {
          set({ delivery: row.value as DeliverySettings })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  },
}))
