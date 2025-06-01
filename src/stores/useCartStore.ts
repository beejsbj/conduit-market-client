import type { NDKTag } from '@nostr-dev-kit/ndk'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface CartItem {
  merchantPubkey: string
  productId: string
  eventId: string
  tags: NDKTag[]
  currency: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Cart {
  merchantPubkey: string
  items: CartItem[]
}

interface CartState {
  carts: Cart[]

  // HUD UI
  isHUDOpen: boolean
  toggleHUD: (force?: boolean) => void

  // Cart actions
  addToCart: (product: CartItem) => void
  increaseQuantity: (product: CartItem) => void
  decreaseQuantity: (product: CartItem) => void
  removeFromCart: (product: CartItem) => void

  // Cart getters
  getCartsTotal: () => number
  getCartsItemCount: () => number

  // Cart getters
  getCart: (merchantPubkey: string) => Cart | undefined
  getCartTotal: (merchantPubkey: string) => number
  getCartItemCount: (merchantPubkey: string) => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      carts: [],
      isHUDOpen: false,

      // HUD UI actions
      toggleHUD: (force?: boolean) =>
        set((state) => ({
          isHUDOpen: force !== undefined ? force : !state.isHUDOpen
        })),

      // Cart actions
      addToCart: (product: CartItem) => {
        // #TODO: Fix cart creation logic to properly handle existing carts and items
        // Currently always creating a new cart as a temporary solution
        set((state) => ({
          carts: [
            ...state.carts,
            {
              merchantPubkey: product.merchantPubkey,
              items: [{ ...product, quantity: 1 }]
            }
          ]
        }))

        console.log(product, get().carts)

        // Original implementation:
        /*
        const existingCart = get().getCart(product.merchantPubkey)

        if (!existingCart) {
          // Create a new cart if it doesn't exist
          set((state) => ({
            carts: [
              ...state.carts,
              {
                merchantPubkey: product.merchantPubkey,
                items: [{ ...product, quantity: 1 }]
              }
            ]
          }))
          return
        }

        const existingItem = existingCart.items.find(
          (item) => item.productId === product.productId
        )

        if (existingItem) {
          get().increaseQuantity(product)
          return
        }

        // Add new item to existing cart
        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.merchantPubkey === product.merchantPubkey
              ? {
                  ...cart,
                  items: [...cart.items, { ...product, quantity: 1 }]
                }
              : cart
          )
        }))
        */
      },

      increaseQuantity: (product: CartItem) => {
        const existingCart = get().getCart(product.merchantPubkey)
        if (!existingCart) {
          throw new Error(
            'Cannot increase quantity: Merchant cart not initialized'
          )
        }

        set((state) => ({
          carts: state.carts.map((cart) =>
            cart.merchantPubkey === product.merchantPubkey
              ? {
                  ...cart,
                  items: cart.items.map((item) =>
                    item.productId === product.productId
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  )
                }
              : cart
          )
        }))
      },

      decreaseQuantity: (product: CartItem) => {
        set((state) => ({
          carts: state.carts
            .map((cart) => {
              if (cart.merchantPubkey !== product.merchantPubkey) return cart

              const updatedItems = cart.items
                .map((item) =>
                  item.productId === product.productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
                .filter((item) => item.quantity > 0)

              return updatedItems.length > 0
                ? { ...cart, items: updatedItems }
                : cart
            })
            .filter((cart) => cart.items.length > 0)
        }))
      },

      removeFromCart: (product: CartItem) => {
        set((state) => ({
          carts: state.carts
            .map((cart) => {
              if (cart.merchantPubkey !== product.merchantPubkey) return cart

              return {
                ...cart,
                items: cart.items.filter(
                  (item) => item.productId !== product.productId
                )
              }
            })
            .filter((cart) => cart.items.length > 0)
        }))
      },

      // Cart getters
      getCart: (merchantPubkey: string) =>
        get().carts.find((cart) => cart.merchantPubkey === merchantPubkey),

      getCartTotal: (merchantPubkey: string) => {
        const cart = get().getCart(merchantPubkey)
        return cart
          ? cart.items.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )
          : 0
      },

      getCartItemCount: (merchantPubkey: string) => {
        const cart = get().getCart(merchantPubkey)
        return cart
          ? cart.items.reduce((count, item) => count + item.quantity, 0)
          : 0
      },

      // Global cart getters
      getCartsTotal: () =>
        get().carts.reduce(
          (total, cart) =>
            total +
            cart.items.reduce(
              (cartTotal, item) => cartTotal + item.price * item.quantity,
              0
            ),
          0
        ),

      getCartsItemCount: () => {
        return get().carts.reduce(
          (total, cart) =>
            total +
            cart.items.reduce((count, item) => count + item.quantity, 0),
          0
        )
      }
    }),
    {
      name: 'conduit-market-carts',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ carts: state.carts })
    }
  )
)
