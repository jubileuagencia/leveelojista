import { supabase } from '@/lib/supabase'
import type { UserAddress, Order } from '@/types/database'

export async function getUserAddresses(userId: string): Promise<UserAddress[]> {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_main', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as UserAddress[]) ?? []
}

export async function createAddress(
  address: Omit<UserAddress, 'id' | 'created_at'>
): Promise<UserAddress> {
  const { data, error } = await supabase
    .from('user_addresses')
    .insert(address)
    .select('*')
    .single()

  if (error) throw error
  return data as UserAddress
}

export async function setMainAddress(addressId: string): Promise<void> {
  const { error } = await supabase.rpc('set_main_address', {
    target_address_id: addressId,
  })

  if (error) throw error
}

export async function createOrder(params: {
  addressId: string
  items: { product_id: string; quantity: number; unit_price: number; variant_id?: string | null }[]
}): Promise<string> {
  const rpcParams = {
    p_address_id: params.addressId,
    p_items: params.items,
  }
  const { data, error } = await supabase.rpc('create_order_validated', rpcParams)

  if (error) {
    throw error
  }
  return data as string
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('id', orderId)
    .single()

  if (error) throw error
  return data as Order | null
}
