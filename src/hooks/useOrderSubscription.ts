import { useEffect, useRef, useCallback } from 'react'
import { useSubscription } from 'nostr-hooks'
import { type NostrEvent } from '@nostr-dev-kit/ndk'
import {
  validateOrder,
  validatePaymentRequest,
  validateOrderStatusUpdate,
  validateShippingUpdate,
  validatePaymentReceipt,
  decryptNip17Message
} from 'nostr-commerce-schema'
import {
  useOrderStore,
  OrderEventType,
  OrderProcessingStatus,
  type StoredOrderEvent
} from '@/stores/useOrderStore'
import { getNdk } from '@/services/ndkService'
import { useAccountStore } from '@/stores/useAccountStore'
import { useRelayState } from '@/stores/useRelayState'

/**
 * Hook to handle subscription to order events
 * This separates the React hooks (useEffect, useSubscription) from the Zustand store
 * Note: This hook works with the new refactored store structure with separate arrays
 */
export const useOrderSubscription = () => {
  const {
    isSubscribed,
    isLoading,
    error,
    setIsSubscribed,
    setIsLoading,
    setError,
    addOrderEvent
  } = useOrderStore()

  const { user } = useAccountStore()
  const { relayPoolVersion } = useRelayState()

  // Use a ref to track initialization state to prevent double subscription
  const hasInitializedRef = useRef(false)
  const currentRelayVersionRef = useRef(relayPoolVersion)

  const subId = 'order-events'
  const { events, createSubscription, removeSubscription } =
    useSubscription(subId)

  const refreshSubscription = useCallback(() => {
    removeSubscription()
    hasInitializedRef.current = false
    setIsSubscribed(false)
    setIsLoading(false)
  }, [setIsSubscribed, setIsLoading, removeSubscription])

  // Restart subscription when relay pool changes
  useEffect(() => {
    if (currentRelayVersionRef.current !== relayPoolVersion) {
      removeSubscription()
      hasInitializedRef.current = false
      setIsSubscribed(false)
      setIsLoading(false)
      currentRelayVersionRef.current = relayPoolVersion
    }
  }, [relayPoolVersion, removeSubscription, setIsSubscribed, setIsLoading])

  // Create the subscription
  useEffect(() => {
    if (isSubscribed || isLoading || hasInitializedRef.current || !user) return

    // Mark as initialized to prevent duplicate attempts
    hasInitializedRef.current = true

    const initializeSubscription = async () => {
      try {
        // Set loading state once at the beginning
        setIsLoading(true)

        const filters = {
          filters: [
            {
              kinds: [1059],
              '#p': [user.pubkey]
            }
          ]
        }

        createSubscription(filters)

        setIsSubscribed(true)
        setIsLoading(false)
      } catch (err) {
        console.error('Error creating subscription:', err)
        setError(String(err))
        setIsLoading(false)
      }
    }

    initializeSubscription()
  }, [
    user,
    relayPoolVersion,
    createSubscription,
    setIsSubscribed,
    setIsLoading,
    setError
  ])

  // Process events when they arrive
  useEffect(() => {
    if (!events || events.length === 0) return

    const processEvents = async () => {
      for (const event of events) {
        try {
          const decryptedEvent: NostrEvent | null = await decryptNip17Message(
            await getNdk(),
            event.rawEvent()
          )
          if (!decryptedEvent) {
            continue
          }

          // Get the type tag for kind 16 events and order ID
          const typeTag = decryptedEvent.tags.find((tag) => tag[0] === 'type')
          const orderIdTag = decryptedEvent.tags.find(
            (tag) => tag[0] === 'order'
          )

          if (!orderIdTag || !orderIdTag[1]) {
            console.error('Missing order ID tag')
            continue
          }

          const orderId = orderIdTag[1]
          let orderType: OrderEventType
          let isValid = false

          // Determine event type and validate against schema
          if (decryptedEvent.kind === 16 && typeTag && typeTag[1]) {
            switch (typeTag[1]) {
              case '1': // Order creation
                const orderResult = validateOrder(decryptedEvent)
                if (orderResult.success) {
                  orderType = OrderEventType.ORDER
                  isValid = true
                } else {
                  console.error(`Invalid Order: ${orderResult.error.message}`)
                }
                break

              case '2': // Payment request
                const paymentRequestResult =
                  validatePaymentRequest(decryptedEvent)
                if (paymentRequestResult.success) {
                  orderType = OrderEventType.PAYMENT_REQUEST
                  isValid = true
                } else {
                  console.error(
                    `Invalid Payment Request: ${paymentRequestResult.error.message}`
                  )
                }
                break

              case '3': // Status update
                const statusUpdateResult =
                  validateOrderStatusUpdate(decryptedEvent)
                if (statusUpdateResult.success) {
                  orderType = OrderEventType.STATUS_UPDATE
                  isValid = true
                } else {
                  console.error(
                    `Invalid Status Update: ${statusUpdateResult.error.message}`
                  )
                }
                break

              case '4': // Shipping update
                const shippingUpdateResult =
                  validateShippingUpdate(decryptedEvent)
                if (shippingUpdateResult.success) {
                  orderType = OrderEventType.SHIPPING_UPDATE
                  isValid = true
                } else {
                  console.error(
                    `Invalid Shipping Update: ${shippingUpdateResult.error.message}`
                  )
                }
                break

              default:
              // Unknown type tag value
            }
          } else if (decryptedEvent.kind === 17) {
            // Receipt
            const receiptResult = validatePaymentReceipt(decryptedEvent)
            if (receiptResult.success) {
              orderType = OrderEventType.PAYMENT_RECEIPT
              isValid = true
            } else {
              console.error(`Invalid Receipt: ${receiptResult.error.message}`)
            }
          } else {
            // Event does not match expected patterns
          }

          // Add valid order to store
          if (isValid) {
            const storedOrderEvent: StoredOrderEvent = {
              id: decryptedEvent.id!,
              orderId,
              event: decryptedEvent,
              type: orderType!,
              unread: true,
              timestamp: decryptedEvent.created_at || event.created_at || 0,
              processingStatus: OrderProcessingStatus.PENDING
            }

            addOrderEvent(storedOrderEvent)
          }
        } catch (err) {
          console.error('Error processing order event:', err)
        }
      }
    }

    processEvents()
  }, [events, addOrderEvent])

  return {
    isLoading,
    error,
    isSubscribed,
    refreshSubscription
  }
}
