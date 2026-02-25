import { create } from 'zustand'
import type { TierDiscounts } from '@/types/database'
import { supabase } from '@/lib/supabase'

interface ConfigState {
  tierDiscounts: TierDiscounts
  loading: boolean

  fetchConfig: () => Promise<void>
  subscribe: () => () => void
}

const DEFAULT_DISCOUNTS: TierDiscounts = { silver: 0.04, gold: 0.08 }

export const useConfigStore = create<ConfigState>((set) => ({
  tierDiscounts: DEFAULT_DISCOUNTS,
  loading: true,

  fetchConfig: async () => {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'tier_discounts')
      .single()

    if (data?.value) {
      set({ tierDiscounts: data.value as unknown as TierDiscounts, loading: false })
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
        filter: 'key=eq.tier_discounts',
      }, (payload) => {
        const newValue = (payload.new as { value: TierDiscounts }).value
        if (newValue) set({ tierDiscounts: newValue })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  },
}))
