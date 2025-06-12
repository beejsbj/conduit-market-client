import { useCartStore } from '@/stores/useCartStore'
import Icon from '@/components/Icon'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import { CartHUDItem } from '@/components/Cards/CartItemCard'
import Carousel from '@/components/Carousel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { useEffect } from 'react'
import Avatar from '@/components/Avatar'
import type { Cart } from '@/stores/useCartStore'
import { useInterfaceStore } from '@/stores/useInterfaceStore'
import { useCartInteractions } from '@/hooks/useCartInteractions'

// when touch drag down on the cart drawer, it should close
// #todo place hlder icon is smaller than main image.
//find  a wa yo to fix caroself on phone

const CartDrawer: React.FC = () => {
  // ===========================================================================
  // State & Hooks
  // ===========================================================================
  const { carts, getCartTotal, selectedHUDCart, setSelectedHUDCart } =
    useCartStore()

  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()

  const { ref } = useCartInteractions()

  useEffect(() => {
    if (carts.length > 0 && !selectedHUDCart) {
      setSelectedHUDCart(carts[0] as Cart)
    }
  }, [carts, selectedHUDCart, setSelectedHUDCart])

  // ===========================================================================
  // Constants
  // ===========================================================================
  const PLACEHOLDER_IMAGE = 'https://avatar.iran.liara.run/public'

  // ===========================================================================
  // Handlers & Helpers
  // ===========================================================================
  const getItemsWithPlaceholders = (items: any[] = []) => {
    if (items.length >= 5) {
      // If we have 5 or more items, show all of them
      return items
    }
    // If we have less than 5 items, fill with placeholders up to 5
    return Array(5)
      .fill(null)
      .map((_, index) => items[index] || null)
  }

  const handleTabChange = (merchantPubkey: string) => {
    if (!isCartHUDOpen) {
      toggleCartHUD(true)
    }
    const cart = carts.find((cart) => cart.merchantPubkey === merchantPubkey)
    if (cart) {
      setSelectedHUDCart(cart)
    }
  }

  const handleCartClick = () => {
    if (!isCartHUDOpen) {
      toggleCartHUD(true)
    }
  }

  const handleCloseClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()
    toggleCartHUD(false)
  }

  // ===========================================================================
  // Styles
  // ===========================================================================
  const TabsTriggerClasses = (merchantPubkey: string) =>
    cn(
      'pb-4 pt-2 bg-accent rounded-t-[999px] from-primary-800 to-accent bg-gradient-to-t flex items-center gap-2 transition-all duration-300',
      {
        'rounded-t-lg': selectedHUDCart?.merchantPubkey === merchantPubkey
      }
    )

  const cartDrawerClassName = cn(
    'bg-primary grid sm:grid-cols-3 justify-between gap-4 from-primary-800 to-primary/80 bg-gradient-to-b rounded-lg px-3 py-2 relative cursor-pointer relative z-1',
    //  after
    'after:absolute after:inset-[-1px] after:bg-gradient-to-b after:from-ink after:to-transparent after:rounded-lg after:z-[-5]'
  )

  // ===========================================================================
  // Render
  // ===========================================================================
  return (
    <div ref={ref} className={cartDrawerClassName} onClick={handleCartClick}>
      {/* Close Button */}
      {isCartHUDOpen && (
        <div className="absolute top-[-30px] right-10 z-1 pb-2 bg-accent rounded-t-full from-primary-800 to-accent bg-gradient-to-t">
          <Button variant="ghost" size="icon" onClick={handleCloseClick}>
            <Icon icon="xIcon" />
          </Button>
        </div>
      )}

      {/* Cart Tabs */}
      <div className="sm:col-span-2">
        <Tabs
          defaultValue={selectedHUDCart?.merchantPubkey || 'empty'}
          className="w-full"
          onValueChange={handleTabChange}
          value={selectedHUDCart?.merchantPubkey || 'empty'}
        >
          {carts.length > 0 && (
            <TabsList className="absolute -top-[30px] left-3 z-1">
              {carts.map((cart) => (
                <TabsTrigger
                  key={cart.merchantPubkey}
                  value={cart.merchantPubkey}
                  className={TabsTriggerClasses(cart.merchantPubkey)}
                >
                  <Avatar imageUrl={PLACEHOLDER_IMAGE} size="md" />
                  {selectedHUDCart?.merchantPubkey === cart.merchantPubkey && (
                    <span>Merchant Name</span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          )}

          {/* Cart Content */}
          {carts.length > 0 ? (
            carts.map((cart) => (
              <TabsContent
                key={cart.merchantPubkey}
                value={cart.merchantPubkey}
              >
                <div className="flex items-center gap-4">
                  <Carousel
                    variant="hud"
                    visibleItems={5}
                    visibleItemsMobile={2}
                    indicatorVariant="lines"
                  >
                    {getItemsWithPlaceholders(cart.items).map(
                      (product, index) => (
                        <CartHUDItem
                          product={product}
                          key={product?.productId || `placeholder-${index}`}
                        />
                      )
                    )}
                  </Carousel>

                  {cart.items.length > 5 && (
                    <div
                      className="flex items-center gap-2 bg-muted/60 border border-ink 
          border-dashed aspect-square rounded-full"
                    >
                      <div
                        className="size-20 rounded-full bg-primary-800 grid 
            place-items-center"
                      >
                        <p className="voice-2l">+{cart.items.length - 5}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))
          ) : (
            <TabsContent value="empty">
              <div className="flex items-center gap-4">
                <Carousel
                  variant="hud"
                  visibleItems={5}
                  visibleItemsMobile={2}
                  indicatorVariant="lines"
                >
                  {getItemsWithPlaceholders().map((_, index) => (
                    <CartHUDItem product={null} key={`placeholder-${index}`} />
                  ))}
                </Carousel>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Cart Summary & Actions */}
      <div className="grid sm:place-content-center sm:grid-cols-2 gap-6">
        {/* Totals */}
        <div className="grid gap-2 items-center content-center text-center">
          <h3 className="voice-base font-bold">Subtotal</h3>
          <p className="voice-3l">
            {formatPrice(getCartTotal(selectedHUDCart?.merchantPubkey || ''))}
          </p>
          <p className="voice-sm text-muted-foreground">
            {formatPrice(
              getCartTotal(selectedHUDCart?.merchantPubkey || ''),
              'USD'
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="grid gap-2 items-center content-center">
          <Button variant="outline" rounded={false} isLink to="/carts">
            <Icon icon="ShoppingBag" />
            View Cart(s)
          </Button>
          <ZapoutButton
            rounded={false}
            merchantPubkey={selectedHUDCart?.merchantPubkey || ''}
          >
            Zap out
          </ZapoutButton>
        </div>
      </div>
    </div>
  )
}

export default CartDrawer
