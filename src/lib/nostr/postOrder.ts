import { DEFAULT_RELAYS } from '@/lib/constants/defaultRelays.ts'
import { getNdk } from '@/services/ndkService'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import { NDKRelay } from '@nostr-dev-kit/ndk'

function getActiveRelayPool(): string[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('conduit.activeRelayPool')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed?.length > 0) return parsed
      } catch {}
    }
  }
  return [...DEFAULT_RELAYS]
}

const postOrder = async (orderEvent: NDKEvent, merchantPubkey: string) => {
  const ndk = await getNdk()

  // Get merchant's preferred DM relays from their kind:10050 event
  const relayList = await ndk.fetchEvent({
    kinds: [10050],
    authors: [merchantPubkey]
  })

  let relayUrls: string[] = [...getActiveRelayPool()]

  // Add merchant's preferred relays if available
  if (relayList) {
    const merchantRelays: string[] = relayList.tags
      .filter((tag) => tag[0] === 'relay')
      .map((tag) => tag[1])
    relayUrls = [...merchantRelays, ...relayUrls]
  }

  console.log('📤 [PostOrder] Publishing to relays:', relayUrls)

  const relays = relayUrls.map((url) => {
    const relay = new NDKRelay(url, undefined, ndk)
    ndk.pool.addRelay(relay)
    return relay
  })

  // Ensure the event has the NDK instance
  orderEvent.ndk = ndk

  // Publish the order event to the connected relays
  try {
    await orderEvent.publish()
    console.log('✅ [PostOrder] Order published successfully')
  } catch (publishError) {
    console.error('❌ [PostOrder] Publishing failed:', publishError)
    throw publishError
  }

  return true
}

export default postOrder
