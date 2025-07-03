import React, { useEffect, useRef } from 'react'
import OrderPayQR from '@/components/OrderPayQR'
import OrderDetails from '@/components/OrderDetails'
import { OrderEventType, type StoredOrderEvent } from '@/stores/useOrderStore'
import type { NostrEvent } from '@nostr-dev-kit/ndk'

const OrderDetailsModal: React.FC<{
  order: StoredOrderEvent
  onClose: () => void
  showQROnly?: boolean
  getOrderDetailsEvent?: (order: StoredOrderEvent) => NostrEvent | undefined
  onPayNow?: () => void
}> = ({ order, onClose, showQROnly, getOrderDetailsEvent, onPayNow }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // For payment requests, get the original order details event
  const orderDetailsEvent = getOrderDetailsEvent
    ? getOrderDetailsEvent(order)
    : undefined
  if (order.type === OrderEventType.PAYMENT_REQUEST) {
  }
  const detailsEventToShow =
    order.type === OrderEventType.PAYMENT_REQUEST && orderDetailsEvent
      ? orderDetailsEvent
      : order.event

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-paper rounded-lg shadow-lg max-w-4xl w-full max-h-full p-0 relative animate-fade-in"
      >
        <button
          className="absolute top-4 right-4 text-2xl text-muted-foreground hover:text-ink z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        {/* QR modal: only show QR and invoice */}
        {showQROnly ? (
          <OrderPayQR event={order.event} />
        ) : (
          <OrderDetails
            event={detailsEventToShow}
            orderNotFound={
              order.type === OrderEventType.PAYMENT_REQUEST &&
              !orderDetailsEvent
            }
          />
        )}
      </div>
    </div>
  )
}

export default OrderDetailsModal
