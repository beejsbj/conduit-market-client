import ProductCard from '@/components/Cards/ProductCard'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import CartItemCard from '@/components/Cards/CartItemCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '../Cards/ArticleCard'
import CollectionCard from '../Cards/CollectionCard'
import PromoCard from '../Cards/PromoCard'
import RankProductCard from '../Cards/RankProductCard'
import SkeletonCard from '../Cards/SkeletonCard'
import Carousel from '@/components/Carousel'
import { Card, CardContent } from '../Cards/CardComponents'
import { useState, useEffect } from 'react'

interface Card<T = any> {
  name: string
  component?: React.ComponentType<T>
  variants?: T[]
}

const PLACEHOLDER_IMAGE = 'https://prd.place/600/400'

export function CardsGuide() {
  const [products, setProducts] = useState<NDKEvent[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const events = (await ProductListingMocks.generateEventsArray(
          3
        )) as unknown as NDKEvent[]

        // Modify stock for specific products after fetching
        const modifiedEvents = [...events]
        if (modifiedEvents[1]) {
          modifiedEvents[1].tags = modifiedEvents[1].tags.map((tag: string[]) =>
            tag[0] === 'stock' ? ['stock', '0'] : tag
          )
        }
        if (modifiedEvents[2]) {
          modifiedEvents[2].tags = modifiedEvents[2].tags.map((tag: string[]) =>
            tag[0] === 'stock' ? ['stock', '4'] : tag
          )
        }

        setProducts(modifiedEvents)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }

    fetchProducts()
  }, [])

  const cards: Card[] = [
    {
      name: 'Skeleton Card',
      component: SkeletonCard,
      variants: [1, 2, 3]
    },
    {
      name: 'Product Card',
      component: ProductCard,
      variants: products.map((event) => ({
        event,
        variant: 'card'
      }))
    },
    {
      name: 'Product Card',
      component: ProductCard,
      variants: products.map((event) => ({
        event,
        variant: 'home'
      }))
    },
    {
      name: 'Product Card',
      component: ProductCard,
      variants: products.map((event) => ({
        event,
        variant: 'slide'
      }))
    },
    {
      name: 'Store Card',
      component: StoreCard,
      variants: products
    },
    {
      name: 'Article Card',
      component: ArticleCard,
      variants: products
    },
    {
      name: 'Collection Card',
      component: CollectionCard,
      variants: products
    },
    {
      name: 'Promo Card',
      component: PromoCard,
      variants: products.map((event, index) => ({
        event,
        variant: index % 2 === 0 ? '1item' : '4items'
      }))
    },
    {
      name: 'Cart Item',
      component: CartItemCard,
      variants: [
        {
          product: {
            productId: 123,
            name: 'Cart Item 1',
            price: 59,
            image: PLACEHOLDER_IMAGE,
            quantity: 3,
            eventId: 'mock-event-id',
            tags: [],
            currency: 'SAT',
            merchantPubkey: 'mock-pubkey'
          }
        },
        { product: null }
      ]
    }
  ]

  return (
    <div>
      <h3 className="voice-2l">Cards</h3>
      <div className="grid gap-8">
        {cards.map(
          (card) =>
            card.component &&
            card.variants && (
              <div key={card.name}>
                <h4 className="voice-lg font-bold mt-4">{card.name}</h4>
                <ul className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
                  {card.variants.map((variant, index) => {
                    const Component = card.component!
                    return (
                      <li key={index}>
                        <Component {...variant} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  )
}
