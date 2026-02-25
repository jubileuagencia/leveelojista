import { create } from 'zustand'
import type { UserAddress, PaymentMethod, Order, CartItem } from '@/types/database'
import {
  getUserAddresses,
  createOrder,
  getOrderById,
} from '@/features/checkout/services/checkout'

interface CheckoutState {
  step: number
  addresses: UserAddress[]
  selectedAddressId: string | null
  paymentMethod: PaymentMethod | null
  loading: boolean
  orderResult: Order | null

  fetchAddresses: (userId: string) => Promise<void>
  selectAddress: (id: string) => void
  setPaymentMethod: (method: PaymentMethod) => void
  setStep: (step: number) => void
  submitOrder: (
    cartItems: CartItem[],
    tierDiscountRate: number
  ) => Promise<void>
  reset: () => void
}

const initialState = {
  step: 1,
  addresses: [] as UserAddress[],
  selectedAddressId: null as string | null,
  paymentMethod: null as PaymentMethod | null,
  loading: false,
  orderResult: null as Order | null,
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  fetchAddresses: async (userId) => {
    set({ loading: true })
    try {
      const addresses = await getUserAddresses(userId)
      const mainAddress = addresses.find((a) => a.is_main)
      set({
        addresses,
        selectedAddressId: mainAddress?.id ?? addresses[0]?.id ?? null,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  selectAddress: (id) => {
    set({ selectedAddressId: id })
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method })
  },

  setStep: (step) => {
    set({ step })
  },

  submitOrder: async (cartItems, tierDiscountRate) => {
    const { selectedAddressId, paymentMethod } = get()
    if (!selectedAddressId || !paymentMethod) return

    set({ loading: true })
    try {
      const items = cartItems.map((item) => {
        const basePrice = item.product?.price ?? 0
        const unitPrice = basePrice - basePrice * tierDiscountRate
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: unitPrice,
        }
      })

      const orderId = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        items,
      })

      const order = await getOrderById(orderId)
      set({ orderResult: order, step: 4, loading: false })
    } catch {
      set({ loading: false })
      throw new Error('Erro ao criar pedido')
    }
  },

  reset: () => {
    set(initialState)
  },
}))
