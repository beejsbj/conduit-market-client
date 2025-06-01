import MerchantCartCard from '@/components/Cards/MerchantCartCard'
import SkeletonCard from '@/components/Cards/SkeletonCard'
import PageSection from '@/layouts/PageSection'
import { useCartStore } from '@/stores/useCartStore'
import React from 'react'

const CartsPage: React.FC = () => {
  const { carts, getCartsItemCount } = useCartStore()

  const totalItems = getCartsItemCount()
  const cartCount = carts.length

  return (
    <PageSection>
      <div className="grid gap-8 lg:flex lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-end">
            <h1 className="voice-4l">All Carts Page</h1>

            <p className="voice-sm font-bold">
              {cartCount} stores <span className="inline-block mx-2">/</span>{' '}
              {totalItems} items
            </p>
          </div>

          <ul className="mt-8 grid gap-4">
            {carts.map((cart) => (
              <li key={cart.merchantPubkey}>
                <MerchantCartCard merchantPubkey={cart.merchantPubkey} />
              </li>
            ))}
          </ul>
        </div>
        <div className="border-muted border-1 rounded-lg p-4 basis-1/5">
          <h2 className="voice-lg font-bold">Related Products</h2>

          <ul className="mt-8 grid gap-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <li key={num}>
                <SkeletonCard variant="slide" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageSection>
  )
}

export default CartsPage
