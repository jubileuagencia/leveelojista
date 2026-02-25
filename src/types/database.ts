export type UserRole = 'customer' | 'admin' | 'super_admin'
export type UserTier = 'bronze' | 'silver' | 'gold'
export type PaymentMethod = 'pix' | 'boleto'
export type OrderStatus = 'pending' | 'approved' | 'preparing' | 'shipped' | 'delivered' | 'rejected' | 'cancelled'
export type ProductUnit = 'un' | 'kg' | 'cx' | 'maco' | 'dz'

export interface Profile {
  id: string
  company_name: string | null
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
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  unit: ProductUnit
  image_url: string | null
  category_id: string | null
  is_active: boolean
  deleted_at: string | null
  display_id: number
  created_at: string
  categories?: Category
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
  payment_method: PaymentMethod
  subtotal: number
  discount: number
  total: number
  created_at: string
  profile?: Profile
  address?: UserAddress
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  product?: Product
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
  silver: number
  gold: number
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
      cart_items: { Row: CartItem; Insert: Partial<CartItem>; Update: Partial<CartItem> }
      favorites: { Row: Favorite; Insert: Partial<Favorite>; Update: Partial<Favorite> }
      app_config: { Row: AppConfig; Insert: Partial<AppConfig>; Update: Partial<AppConfig> }
    }
    Functions: {
      create_order_validated: {
        Args: { p_address_id: string; p_payment_method: string; p_items: unknown }
        Returns: string
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
