import { useCartStore } from '@/stores/useCartStore'
import Icon from '@/components/Icon'
import ZapoutButton from '@/components/Buttons/ZapoutButton.tsx'
import { cn, formatPrice } from '@/lib/utils'
import Button from '@/components/Buttons/Button'
import { CartHUDItem } from '@/components/Cards/CartItemCard'
import Carousel from '@/components/Carousel'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'
import type { Cart } from '@/stores/useCartStore'

const CartDrawer: React.FC = () => {
  const {
    carts,
    toggleHUD,
    getCartTotal,
    selectedHUDCart,
    setSelectedHUDCart,
    isHUDOpen
  } = useCartStore()

  useEffect(() => {
    if (carts.length > 0) {
      setSelectedHUDCart(carts[0] as Cart)
    }
  }, [carts, setSelectedHUDCart])

  const PLACEHOLDER_IMAGE = 'https://avatar.iran.liara.run/public'

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

  const TabsTriggerClasses = (merchantPubkey: string) =>
    cn(
      'pb-4 pt-2 bg-accent rounded-t-[999px] from-primary-800 to-accent bg-gradient-to-t flex items-center gap-2 transition-all duration-300',
      {
        'rounded-t-lg': selectedHUDCart?.merchantPubkey === merchantPubkey
      }
    )

  const handleTabChange = (merchantPubkey: string) => {
    if (!isHUDOpen) {
      toggleHUD()
    }
    const cart = carts.find((cart) => cart.merchantPubkey === merchantPubkey)
    if (cart) {
      setSelectedHUDCart(cart)
    }
  }

  return (
    <div className="cart-drawer bg-primary grid grid-cols-3 justify-between gap-4 from-primary-800 to-primary/80 bg-gradient-to-b rounded-lg px-3 py-2 relative">
      {/* close */}
      <div className="absolute top-[-30px] right-10 z-1 pb-2 bg-accent rounded-t-full from-primary-800 to-accent bg-gradient-to-t">
        <Button variant="ghost" size="icon" onClick={() => toggleHUD()}>
          <Icon icon="xIcon" />
        </Button>
      </div>

      <div className="col-span-2">
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

      <div className="grid grid-cols-2 gap-4">
        {/* totals */}
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

        {/* actions */}
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
