import { useEffect, useState } from 'react'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import { getNdk } from '@/services/ndkService'

interface OrderItem {
  productId: string
  eventId: string
  quantity: number
  price: number
  productRef?: string
  [key: string]: any
}

interface ProductListingMap {
  [productId: string]: NDKEvent | null
}

export function useOrderProductListings(items: OrderItem[]) {
  const [productListings, setProductListings] = useState<ProductListingMap>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchListings() {
      setLoading(true)
      const ndk = await getNdk()
      const results: ProductListingMap = {}
      await Promise.all(
        items.map(async (item) => {
          try {
            const ref = item.productRef || `30402::${item.productId}`
            const parts = ref.split(':')
            const kind = parts[0]
            const merchantPubkey = parts[1]
            const productId = parts[2]
            if (kind !== '30402' || !merchantPubkey || !productId) {
              results[item.productId] = null
              return
            }
            console.debug('[OrderProductListings] Subscribing for product:', {
              kind,
              merchantPubkey,
              productId,
              filter: {
                kinds: [30402],
                authors: [merchantPubkey],
                '#d': [productId],
                limit: 1
              }
            })
            const sub = ndk.subscribe({
              kinds: [30402],
              authors: [merchantPubkey],
              '#d': [productId],
              limit: 1
            })
            let found: NDKEvent | null = null
            await new Promise<void>((resolve) => {
              sub.on('event', (event: any) => {
                found = event as NDKEvent
                resolve()
                sub.stop()
              })
              setTimeout(() => {
                resolve()
                sub.stop()
              }, 4000)
            })
            results[item.productId] = found
          } catch (e) {
            results[item.productId] = null
          }
        })
      )
      if (isMounted) {
        setProductListings(results)
        setLoading(false)
      }
    }
    if (items.length > 0) fetchListings()
    else setLoading(false)
    return () => {
      isMounted = false
    }
  }, [JSON.stringify(items)])

  return { productListings, loading }
}
