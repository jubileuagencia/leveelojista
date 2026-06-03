export type UserRole = 'customer' | 'admin' | 'super_admin'
export type UserTier = 'ouro' | 'platina' | 'diamante'
export type PaymentMethod =
  | 'pix'
  | 'boleto'
  | 'cartao_online'      // cartão via MP Checkout Pro
  | 'cartao_entrega'     // máquina de cartão presencial (débito ou crédito — distinção no POS)
  | 'dinheiro_entrega'   // dinheiro na entrega (com ou sem troco)

export type OrderStatus =
  | 'pending'            // pedido criado, aguardando loja iniciar separação
  | 'separating'         // loja está separando os itens fisicamente
  | 'awaiting_payment'   // separação finalizada, aguardando cliente pagar
  | 'approved'           // pago e aprovado para preparo
  | 'preparing'          // preparando para envio
  | 'shipped'            // despachado
  | 'delivered'          // entregue ao cliente
  | 'rejected'           // recusado pela loja
  | 'cancelled'          // cancelado (cliente ou loja)

export type SeparationStatus = 'pending' | 'separated' | 'removed' | 'added' | 'substituted'

export type SeparationAuditAction =
  | 'separation_started'
  | 'qty_changed'
  | 'item_removed'
  | 'item_added'
  | 'item_substituted'
  | 'note_added'
  | 'separation_completed'
  | 'separation_reverted'
export type ProductUnit = 'un' | 'kg' | 'cx' | 'maco' | 'dz' | 'bj' | 'pc'

export type DocumentType = 'cpf' | 'cnpj'

export interface Profile {
  id: string
  company_name: string | null
  trade_name: string | null
  document_type: DocumentType
  document_number: string | null
  cnpj: string | null
  phone: string | null
  tier: UserTier
  role: UserRole
  created_at: string
}

export interface Category {
  id: string
  name: string
  icon: string | null
  color: string | null
  sort_order: number
  is_featured: boolean
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  unit_type: string
  unit_label: string | null
  unit_price: number
  weight_grams: number | null
  allows_fractional: boolean
  is_default: boolean
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  unit: ProductUnit
  image_url: string | null
  is_active: boolean
  deleted_at: string | null
  display_id: number
  created_at: string
  sku: string | null
  ean: string | null
  original_price: number | null
  nutritional_info: string | null
  storage_instructions: string | null
  on_sale: boolean
  sale_discount_pct: number | null
  sort_order: number | null
  /** Todas as categorias do produto (N-N via product_categories). */
  categories?: Category[]
  /** Atalho para a categoria marcada como primária. */
  primaryCategory?: Category | null
  variants?: ProductVariant[]
}

export interface UserAddress {
  id: string
  user_id: string
  zip_code: string | null
  street: string | null
  number: string | null
  district: string | null
  city: string | null
  state: string | null
  is_main: boolean
  created_at: string
}

export interface Order {
  id: string
  order_number: number
  user_id: string
  address_id: string | null
  status: OrderStatus
  payment_method: PaymentMethod | null  // null até cliente escolher em /pedido/:id/pagamento
  subtotal: number
  discount: number
  total: number
  estimated_delivery_date: string | null
  created_at: string
  // Campos do fluxo pós-separação
  separated_at: string | null
  separated_by: string | null
  paid_at: string | null
  mp_payment_id: string | null
  mp_preference_id: string | null
  original_subtotal: number | null
  original_total: number | null
  separation_notes: string | null
  delivery_change_for: number | null    // troco solicitado (só dinheiro_entrega + pediu troco)
  profile?: Profile
  address?: UserAddress
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  total_price: number
  unit_type: string | null
  created_at: string
  // Campos do fluxo pós-separação
  original_quantity: number | null
  original_total_price: number | null
  separation_status: SeparationStatus
  separation_note: string | null
  substituted_from_item_id: string | null
  product?: Product
}

export interface OrderSeparationAudit {
  id: string
  order_id: string
  order_item_id: string | null
  action: SeparationAuditAction
  user_id: string
  payload: Record<string, unknown>
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  variant_id: string | null
  quantity: number
  created_at: string
  product?: Product
  variant?: ProductVariant
}

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface AppConfig {
  id: string
  key: string
  value: Record<string, unknown>
  created_at: string
}

export interface TierDiscounts {
  platina: number
  diamante: number
}

// Supabase Database type for typed client
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      categories: { Row: Category; Insert: Partial<Category>; Update: Partial<Category> }
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> }
      user_addresses: { Row: UserAddress; Insert: Partial<UserAddress>; Update: Partial<UserAddress> }
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> }
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> }
      order_separation_audit: { Row: OrderSeparationAudit; Insert: Partial<OrderSeparationAudit>; Update: never }
      cart_items: { Row: CartItem; Insert: Partial<CartItem>; Update: Partial<CartItem> }
      favorites: { Row: Favorite; Insert: Partial<Favorite>; Update: Partial<Favorite> }
      app_config: { Row: AppConfig; Insert: Partial<AppConfig>; Update: Partial<AppConfig> }
    }
    Functions: {
      create_order_validated: {
        Args: { p_address_id: string; p_payment_method?: string | null; p_items: unknown }
        Returns: string
      }
      start_separation: {
        Args: { p_order_id: string }
        Returns: void
      }
      finalize_separation: {
        Args: { p_order_id: string }
        Returns: void
      }
      set_main_address: {
        Args: { target_address_id: string }
        Returns: void
      }
      get_admin_clients: {
        Args: { page?: number; page_size?: number; search_term?: string; filter_tiers?: string[]; filter_roles?: string[] }
        Returns: Array<Profile & { email: string; total_count: number }>
      }
    }
  }
}
