import { useState, useEffect } from 'react'
import { ProductListingMocks } from 'nostr-commerce-schema'
import type { NDKEvent } from '@nostr-dev-kit/ndk'

interface UseMockProductsOptions {
  count?: number
  modifyStock?: boolean
}

const mockStores = [
  {
    pubkey: '1234567890-Store-1'
  },
  {
    pubkey: '1234567891-Store-2'
  },
  {
    pubkey: '1234567892-Store-3'
  }
]

export function useMockProducts({
  count = 9,
  modifyStock = true
}: UseMockProductsOptions = {}) {
  const [products, setProducts] = useState<NDKEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const events = (await ProductListingMocks.generateEventsArray(
          count
        )) as unknown as NDKEvent[]

        // Assign store pubkeys to every third event
        events.forEach((event, index) => {
          const storeIndex = Math.floor(index / 3) % mockStores.length
          event.pubkey = mockStores[storeIndex].pubkey
        })

        if (modifyStock) {
          // Modify stock for specific products after fetching
          const modifiedEvents = [...events]
          if (modifiedEvents[1]) {
            modifiedEvents[1].tags = modifiedEvents[1].tags.map(
              (tag: string[]) => (tag[0] === 'stock' ? ['stock', '0'] : tag)
            )
          }
          if (modifiedEvents[2]) {
            modifiedEvents[2].tags = modifiedEvents[2].tags.map(
              (tag: string[]) => (tag[0] === 'stock' ? ['stock', '4'] : tag)
            )
          }

          setProducts(modifiedEvents)
        } else {
          setProducts(events)
        }
      } catch (error) {
        console.error('Error fetching mock products:', error)
        setError(error instanceof Error ? error : new Error('Unknown error'))
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [count, modifyStock])

  return { products, loading, error }
}
