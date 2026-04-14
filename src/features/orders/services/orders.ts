import { supabase } from '@/lib/supabase'
import type { Order } from '@/types/database'

interface GetUserOrdersResult {
  orders: Order[]
  totalCount: number
}

export async function getUserOrders(
  userId: string,
  page = 1,
  pageSize = 10
): Promise<GetUserOrdersResult> {
  const from = (page - 1) * pageSize
  const to = page * pageSize - 1

  const { data, error, count } = await supabase
    .from('orders')
    .select('*, order_items:order_items(*, product:products(*))', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching orders:', error)
    throw new Error(`Falha ao buscar pedidos: ${error.message}`)
  }

  return {
    orders: (data as unknown as Order[]) ?? [],
    totalCount: count ?? 0,
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, address:user_addresses(*), order_items:order_items(*, product:products(*))')
    .eq('id', orderId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching order:', error)
    throw new Error(`Falha ao buscar pedido: ${error.message}`)
  }

  return data as unknown as Order
}
