import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import canteenService from '@/lib/services/canteen.service'
import type { Tables } from '@/lib/supabase/types'

type CanteenProduct = Tables<'canteen_products'>

interface CartItem {
  product: CanteenProduct
  quantity: number
}

interface CartState {
  items: CartItem[]
  
  // Actions
  addItem: (product: CanteenProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalAmount: () => number
  getTotalItems: () => number
  checkout: (studentId: string, semesterId: string) => Promise<boolean>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set(state => {
          const existingItem = state.items.find(item => item.product.id === product.id)
          
          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            }
          } else {
            // Add new item
            return {
              items: [...state.items, { product, quantity }]
            }
          }
        })
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalAmount: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          return total + ((item.product.price || 0) * item.quantity)
        }, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      checkout: async (studentId, semesterId) => {
        const { items, clearCart } = get()
        
        if (items.length === 0) {
          return false
        }

        try {
          const orderItems = items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            priceAtOrder: item.product.price || 0
          }))

          const result = await canteenService.createOrder({
            studentId,
            semesterId,
            items: orderItems
          })

          if (result.success) {
            clearCart()
            return true
          }

          return false
        } catch (error) {
          console.error('Checkout error:', error)
          return false
        }
      }
    }),
    {
      name: 'cart-storage', // localStorage key
      partialize: (state) => ({ items: state.items }) // Only persist items
    }
  )
)

export default useCartStore
