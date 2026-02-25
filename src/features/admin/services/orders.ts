import { supabase } from '@/lib/supabase'
import type { OrderStatus } from '@/types/database'

// ── Types ──────────────────────────────────────────────

export interface AdminOrder {
  id: string
  order_number: number
  user_id: string
  address_id: string | null
  status: OrderStatus
  payment_method: string
  subtotal: number
  discount: number
  total: number
  created_at: string
  company_name: string | null
  cnpj: string | null
  phone: string | null
  total_count: number
}

export interface OrderFilters {
  search?: string
  statuses?: OrderStatus[]
  page?: number
  pageSize?: number
}

export interface OrdersResponse {
  data: AdminOrder[]
  total: number
  page: number
  pageSize: number
}

export interface OrderDetail {
  id: string
  order_number: number
  user_id: string
  status: OrderStatus
  payment_method: string
  subtotal: number
  discount: number
  total: number
  created_at: string
  profile: { company_name: string | null; cnpj: string | null; phone: string | null } | null
  address: {
    street: string | null
    number: string | null
    district: string | null
    city: string | null
    state: string | null
    zip_code: string | null
  } | null
  items: Array<{
    id: string
    quantity: number
    unit_price: number
    total_price: number
    product: { name: string; unit: string; image_url: string | null } | null
  }>
}

// ── Fetch Orders (via RPC search_admin_orders) ─────────

export async function fetchOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
  const { search, statuses, page = 1, pageSize = 20 } = filters

  const { data, error } = await supabase.rpc('search_admin_orders', {
    search_term: search || null,
    statuses: statuses?.length ? statuses : null,
    p_page: page,
    p_page_size: pageSize,
  })

  if (error) {
    throw new Error(`Falha ao buscar pedidos: ${error.message}`)
  }

  const rows = (data as AdminOrder[]) ?? []
  const total = rows.length > 0 ? rows[0].total_count : 0

  return {
    data: rows,
    total,
    page,
    pageSize,
  }
}

// ── Fetch Order Detail ─────────────────────────────────

export async function fetchOrderDetail(id: string): Promise<OrderDetail> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, user_id, status, payment_method,
      subtotal, discount, total, created_at,
      profile:profiles(company_name, cnpj, phone),
      address:user_addresses(street, number, district, city, state, zip_code),
      items:order_items(
        id, quantity, unit_price, total_price,
        product:products(name, unit, image_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Falha ao buscar detalhes do pedido: ${error.message}`)
  }

  return data as unknown as OrderDetail
}

// ── Update Order Status ────────────────────────────────

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao atualizar status do pedido: ${error.message}`)
  }
}

// ── Bulk Update Status ─────────────────────────────────

export async function bulkUpdateOrderStatus(ids: string[], status: OrderStatus): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .in('id', ids)

  if (error) {
    throw new Error(`Falha na operação em massa: ${error.message}`)
  }
}
