/*
- zap button
- login/signup button
- add to cart button




*/

import { useCartStore, type CartItem } from '@/stores/useCartStore.ts'
import { Minus, Plus, Trash, ShoppingCart } from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'
import Field from '../Form/Field'
// Add to cart button
interface AddToCartButtonProps {
  product: CartItem
  disabled?: boolean
  variant?: 'default' | 'slide'
}
const AddToCartButton = ({
  product,
  disabled,
  variant = 'default'
}: AddToCartButtonProps) => {
  const { addToCart, getCartItemCount } = useCartStore()
  const cartQuantity = getCartItemCount(product.merchantPubkey)

  if (cartQuantity > 0) {
    return <UpdateCartItemQuantityButtons product={product} />
  }

  if (variant === 'slide') {
    return (
      <Button
        onClick={() => addToCart(product)}
        disabled={disabled}
        rounded={false}
        variant="outline"
        className="border-primary"
      >
        <ShoppingCart className="size-4" />
        Add
      </Button>
    )
  }

  return (
    <Button
      onClick={() => addToCart(product)}
      disabled={disabled}
      rounded={false}
    >
      <ShoppingCart className="size-4" />
      Add to Cart
    </Button>
  )
}

// Update cart item quantity buttons
export const UpdateCartItemQuantityButtons = ({
  product,
  className
}: {
  product: CartItem
  className?: string
}) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart, getCart } =
    useCartStore()

  // Get the current cart and find the specific product's quantity
  const cart = getCart(product.merchantPubkey)
  const item = cart?.items.find((item) => item.productId === product.productId)
  const quantity = item?.quantity || 0

  return (
    <div
      className={cn(
        'flex items-center gap-4 border border-muted  rounded-full px-2 py-1 justify-between',
        className
      )}
    >
      <div className="flex items-center rounded-full">
        <Button
          size="icon"
          rounded={false}
          onClick={() => removeFromCart(product)}
          variant="destructive"
          className={cn(
            'max-w-7 transition-all duration-200 ease-in-out',
            quantity === 1 ? 'rounded-full' : 'rounded-l-full border-r-0'
          )}
        >
          <Trash />
        </Button>
        <div
          className={cn(
            'transition-all duration-200 ease-in-out',
            quantity > 1 ? 'w-7 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <Button
            size="icon"
            rounded={false}
            onClick={() => decreaseQuantity(product)}
            variant="primary"
            className="max-w-7 border-l-0 rounded-r-full"
          >
            <Minus />
          </Button>
        </div>
      </div>
      <Field
        inputWrapperClassName="voice-2l border-none bg-transparent max-w-5 p-0"
        inputClassName="text-center"
        value={quantity}
        name="cart-quantity"
      />
      <Button
        size="icon"
        onClick={() => increaseQuantity(product)}
        className="max-w-7"
      >
        <Plus />
      </Button>
    </div>
  )
}

export default AddToCartButton
