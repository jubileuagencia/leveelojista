import { supabase } from '@/lib/supabase'
import type {
  OrderStatus,
  SeparationStatus,
  SeparationAuditAction,
  Product,
} from '@/types/database'

// ── Types ──────────────────────────────────────────────

export interface SeparationItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  total_price: number
  unit_type: string | null
  original_quantity: number | null
  original_total_price: number | null
  separation_status: SeparationStatus
  separation_note: string | null
  substituted_from_item_id: string | null
  product: { name: string; unit: string; image_url: string | null } | null
}

export interface SeparationOrderDetail {
  id: string
  order_number: number
  status: OrderStatus
  subtotal: number
  discount: number
  total: number
  original_subtotal: number | null
  original_total: number | null
  separation_notes: string | null
  created_at: string
  profile: { company_name: string | null; phone: string | null } | null
  address: {
    street: string | null
    number: string | null
    district: string | null
    city: string | null
  } | null
  items: SeparationItem[]
}

export interface SeparationAuditEntry {
  id: string
  order_id: string
  order_item_id: string | null
  action: SeparationAuditAction
  user_id: string
  payload: Record<string, unknown>
  created_at: string
}

// ── Helpers ────────────────────────────────────────────

async function getAuthUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    throw new Error('Sessão expirada. Faça login novamente.')
  }
  return data.user.id
}

async function insertAudit(params: {
  orderId: string
  orderItemId?: string | null
  action: SeparationAuditAction
  payload: Record<string, unknown>
}): Promise<void> {
  const userId = await getAuthUserId()
  const { error } = await supabase.from('order_separation_audit').insert({
    order_id: params.orderId,
    order_item_id: params.orderItemId ?? null,
    action: params.action,
    user_id: userId,
    payload: params.payload,
  })
  if (error) {
    throw new Error(`Falha ao registrar audit: ${error.message}`)
  }
}

// ── Fetch ──────────────────────────────────────────────

export async function fetchSeparationDetail(id: string): Promise<SeparationOrderDetail> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id, order_number, status, subtotal, discount, total,
      original_subtotal, original_total, separation_notes, created_at,
      profile:profiles(company_name, phone),
      address:user_addresses(street, number, district, city),
      items:order_items(
        id, order_id, product_id, variant_id, quantity, unit_price, total_price,
        unit_type, original_quantity, original_total_price,
        separation_status, separation_note, substituted_from_item_id,
        product:products(name, unit, image_url)
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Falha ao buscar pedido para separação: ${error.message}`)
  }

  return data as unknown as SeparationOrderDetail
}

export async function fetchSeparationAudit(orderId: string): Promise<SeparationAuditEntry[]> {
  const { data, error } = await supabase
    .from('order_separation_audit')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Falha ao buscar histórico de separação: ${error.message}`)
  }

  return (data as SeparationAuditEntry[]) ?? []
}

// ── RPCs (transições de status) ────────────────────────

export async function startSeparation(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('start_separation', { p_order_id: orderId })
  if (error) {
    throw new Error(`Falha ao iniciar separação: ${error.message}`)
  }
}

export async function finalizeSeparation(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('finalize_separation', { p_order_id: orderId })
  if (error) {
    throw new Error(`Falha ao finalizar separação: ${error.message}`)
  }
}

// ── Edição de itens ────────────────────────────────────

/**
 * Confirma um item da separação: persiste qty/nota e marca como `separated`.
 * Registra audit de qty (se mudou) e de nota (se mudou).
 * Itens `added` permanecem `added` (já contam como confirmados).
 */
export async function confirmSeparationItem(params: {
  item: SeparationItem
  quantity: number
  note: string
}): Promise<void> {
  const { item, quantity, note } = params
  const qtyChanged = quantity !== item.quantity
  const noteChanged = (note || null) !== (item.separation_note ?? null)

  const nextStatus: SeparationStatus =
    item.separation_status === 'added' ? 'added' : 'separated'

  const { error } = await supabase
    .from('order_items')
    .update({
      quantity,
      total_price: Number((quantity * item.unit_price).toFixed(2)),
      separation_note: note || null,
      separation_status: nextStatus,
      // snapshot da qty original na primeira edição (defensivo — RPC de checkout já preenche)
      original_quantity: item.original_quantity ?? item.quantity,
      original_total_price: item.original_total_price ?? item.total_price,
    })
    .eq('id', item.id)

  if (error) {
    throw new Error(`Falha ao confirmar item: ${error.message}`)
  }

  if (qtyChanged) {
    await insertAudit({
      orderId: item.order_id,
      orderItemId: item.id,
      action: 'qty_changed',
      payload: {
        before: { quantity: item.quantity },
        after: { quantity },
        product_name: item.product?.name ?? null,
      },
    })
  }

  if (noteChanged && note) {
    await insertAudit({
      orderId: item.order_id,
      orderItemId: item.id,
      action: 'note_added',
      payload: { note, product_name: item.product?.name ?? null },
    })
  }
}

/** Marca um item como removido da separação (não deleta a linha — auditável). */
export async function removeSeparationItem(item: SeparationItem): Promise<void> {
  const { error } = await supabase
    .from('order_items')
    .update({
      separation_status: 'removed',
      original_quantity: item.original_quantity ?? item.quantity,
      original_total_price: item.original_total_price ?? item.total_price,
    })
    .eq('id', item.id)

  if (error) {
    throw new Error(`Falha ao remover item: ${error.message}`)
  }

  await insertAudit({
    orderId: item.order_id,
    orderItemId: item.id,
    action: 'item_removed',
    payload: {
      product_name: item.product?.name ?? null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    },
  })
}

/** Desfaz a remoção de um item (volta para `pending`). */
export async function restoreSeparationItem(item: SeparationItem): Promise<void> {
  const { error } = await supabase
    .from('order_items')
    .update({ separation_status: 'pending' })
    .eq('id', item.id)

  if (error) {
    throw new Error(`Falha ao restaurar item: ${error.message}`)
  }

  await insertAudit({
    orderId: item.order_id,
    orderItemId: item.id,
    action: 'separation_reverted',
    payload: { scope: 'item', product_name: item.product?.name ?? null },
  })
}

/** Adiciona um item novo à separação (caso de substituição/inclusão). */
export async function addSeparationItem(params: {
  orderId: string
  product: Product
  quantity: number
  substitutedFromItemId?: string | null
}): Promise<void> {
  const { orderId, product, quantity, substitutedFromItemId } = params

  // Usa a variante default quando existir; senão preço base do produto
  const defaultVariant =
    product.variants?.find((v) => v.is_default) ?? product.variants?.[0] ?? null
  const unitPrice = defaultVariant?.unit_price ?? product.price
  const unitType = defaultVariant?.unit_type ?? product.unit

  const { error } = await supabase.from('order_items').insert({
    order_id: orderId,
    product_id: product.id,
    variant_id: defaultVariant?.id ?? null,
    quantity,
    unit_price: unitPrice,
    total_price: Number((quantity * unitPrice).toFixed(2)),
    unit_type: unitType,
    separation_status: substitutedFromItemId ? 'substituted' : 'added',
    substituted_from_item_id: substitutedFromItemId ?? null,
    original_quantity: null, // item não existia no pedido original
    original_total_price: null,
  })

  if (error) {
    throw new Error(`Falha ao adicionar item: ${error.message}`)
  }

  await insertAudit({
    orderId,
    action: substitutedFromItemId ? 'item_substituted' : 'item_added',
    payload: {
      product_id: product.id,
      product_name: product.name,
      quantity,
      unit_price: unitPrice,
    },
  })
}

/** Atualiza a nota geral da separação no pedido. */
export async function updateSeparationNotes(orderId: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ separation_notes: notes || null })
    .eq('id', orderId)

  if (error) {
    throw new Error(`Falha ao salvar nota da separação: ${error.message}`)
  }
}
