import { supabase } from '@/lib/supabase'
import type { UserTier, UserRole, UserAddress } from '@/types/database'

// ── Types ──────────────────────────────────────────────

export interface AdminClient {
  id: string
  company_name: string | null
  cnpj: string | null
  phone: string | null
  tier: UserTier
  role: UserRole
  created_at: string
  email: string | null
  total_count: number
}

export interface ClientFilters {
  search?: string
  tiers?: UserTier[]
  roles?: UserRole[]
  page?: number
  pageSize?: number
}

export interface ClientsResponse {
  data: AdminClient[]
  total: number
  page: number
  pageSize: number
}

export interface ClientDetail {
  id: string
  company_name: string | null
  cnpj: string | null
  phone: string | null
  tier: UserTier
  role: UserRole
  created_at: string
  email: string | null
  addresses: UserAddress[]
}

// ── Fetch Clients (via RPC get_admin_clients) ──────────

export async function fetchClients(filters: ClientFilters = {}): Promise<ClientsResponse> {
  const { search, tiers, roles, page = 1, pageSize = 20 } = filters

  const { data, error } = await supabase.rpc('get_admin_clients', {
    search_term: search || null,
    filter_tiers: tiers?.length ? tiers : null,
    filter_roles: roles?.length ? roles : null,
    page,
    page_size: pageSize,
  })

  if (error) {
    throw new Error(`Falha ao buscar clientes: ${error.message}`)
  }

  const rows = (data as AdminClient[]) ?? []
  const total = rows.length > 0 ? rows[0].total_count : 0

  return {
    data: rows,
    total,
    page,
    pageSize,
  }
}

// ── Fetch Client Detail ────────────────────────────────

export async function fetchClientDetail(id: string): Promise<ClientDetail> {
  // Fetch profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, company_name, cnpj, phone, tier, role, created_at')
    .eq('id', id)
    .single()

  if (profileErr) {
    throw new Error(`Falha ao buscar perfil: ${profileErr.message}`)
  }

  // Fetch email from RPC (single user search)
  const { data: clientRows } = await supabase.rpc('get_admin_clients', {
    search_term: profile.company_name || null,
    page: 1,
    page_size: 100,
  })

  const match = (clientRows as AdminClient[])?.find((c) => c.id === id)

  // Fetch addresses
  const { data: addresses, error: addrErr } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', id)
    .order('is_main', { ascending: false })
    .order('created_at', { ascending: false })

  if (addrErr) {
    throw new Error(`Falha ao buscar endereços: ${addrErr.message}`)
  }

  return {
    ...profile,
    email: match?.email ?? null,
    addresses: addresses ?? [],
  } as ClientDetail
}

// ── Update Client Profile ──────────────────────────────

export interface UpdateClientData {
  company_name?: string
  cnpj?: string
  phone?: string
  tier?: UserTier
  role?: UserRole
}

export async function updateClientProfile(id: string, data: UpdateClientData): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)

  if (error) {
    throw new Error(`Falha ao atualizar perfil: ${error.message}`)
  }
}

// ── Update Client Email (super_admin only) ─────────────

export async function updateClientEmail(userId: string, newEmail: string): Promise<void> {
  const { error } = await supabase.rpc('update_admin_user_email', {
    target_user_id: userId,
    new_email: newEmail,
  })

  if (error) {
    throw new Error(`Falha ao atualizar email: ${error.message}`)
  }
}

// ── Create Client Address ──────────────────────────────

export interface CreateAddressData {
  user_id: string
  zip_code: string
  street: string
  number: string
  district: string
  city: string
  state: string
  is_main?: boolean
}

export async function createClientAddress(data: CreateAddressData): Promise<void> {
  const { error } = await supabase
    .from('user_addresses')
    .insert(data)

  if (error) {
    throw new Error(`Falha ao criar endereço: ${error.message}`)
  }
}

// ── Delete Client Address ──────────────────────────────

export async function deleteClientAddress(addressId: string): Promise<void> {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId)

  if (error) {
    throw new Error(`Falha ao excluir endereço: ${error.message}`)
  }
}
