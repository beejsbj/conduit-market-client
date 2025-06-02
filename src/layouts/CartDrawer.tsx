import { useCartStore } from '@/stores/useCartStore'
import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import CartHUDItem from '@/components/Cards/CartItemCard'

const CartDrawer: React.FC = () => {
  const { carts, isHUDOpen, toggleHUD, getCartsTotal } = useCartStore()

  const [cartTotal, setCartTotal] = useState(0)

  // Calculate cart total whenever carts change
  useEffect(() => {
    setCartTotal(getCartsTotal())
  }, [carts, getCartsTotal])

  // Get first 5 items from all carts combined
  const allCartItems = carts.flatMap((cart) => cart.items)
  const cartItemsWithPlaceholders = Array(5)
    .fill(null)
    .map((_, index) => allCartItems[index] || null)

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full z-50 transition-all duration-600 ease-bounce',
        isHUDOpen ? 'translate-y-0 opacity-90' : 'translate-y-full  opacity-50'
      )}
    >
      <div className="inner-column cart-drawer px-10 relative">
        {/* close */}
        <div className="absolute top-[-40px] right-10 z-[-1] pb-2 bg-accent rounded-t-full from-primary-800 to-accent/80 bg-gradient-to-t">
          <Button variant="ghost" size="icon" onClick={() => toggleHUD()}>
            <X />
          </Button>
        </div>

        {/* cart items */}
        <ul className="grid grid-cols-[repeat(5,120px)] gap-2">
          {cartItemsWithPlaceholders.map((product, index) => (
            <li
              className="max-w-[120px]"
              key={product?.productId || `placeholder-${index}`}
            >
              <CartHUDItem product={product} />
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-4">
          {/* totals */}
          <div className="grid gap-2 items-center content-center text-center">
            <h3 className="voice-base font-bold">Subtotal</h3>
            <p className="voice-3l">{formatPrice(cartTotal)}</p>
            <p className="voice-sm text-muted-foreground text-primary-foreground">
              {formatPrice(cartTotal)}
            </p>
          </div>

          {/* actions */}
          <div className="grid gap-2 items-center content-center">
            <Button variant="outline">View Cart(s)</Button>
            <ZapoutButton>Zap out</ZapoutButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
