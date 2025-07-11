import React, { useEffect, useState } from 'react'
import Button from '@/components/Buttons/Button'
import Icon from '@/components/Icon'
import { OrderEventType, type StoredOrderEvent } from '@/stores/useOrderStore'
import { OrderUtils } from 'nostr-commerce-schema'
import { usePaymentExpiration } from '@/hooks/usePaymentExpiration'

const ICONS: Record<OrderEventType, React.ReactNode> = {
  [OrderEventType.ORDER]: (
    <Icon.ShoppingBag className="size-6 text-blue-400 drop-shadow-glow" />
  ),
  [OrderEventType.PAYMENT_REQUEST]: (
    <Icon.Zap className="size-6 text-orange-400 drop-shadow-glow" />
  ),
  [OrderEventType.STATUS_UPDATE]: (
    <Icon.Alert className="size-6 text-purple-400 drop-shadow-glow" />
  ),
  [OrderEventType.SHIPPING_UPDATE]: (
    <Icon.ShoppingCart className="size-6 text-green-400 drop-shadow-glow" />
  ),
  [OrderEventType.PAYMENT_RECEIPT]: (
    <Icon.ReceiptText className="size-6 text-emerald-400 drop-shadow-glow" />
  )
}

const OrderTimeline: React.FC<{
  orderId: string
  events: StoredOrderEvent[]
  onPayNow: (order: StoredOrderEvent) => void
  onView: (order: StoredOrderEvent) => void
}> = ({ orderId, events, onPayNow, onView }) => {
  // Group and sort events by type and timestamp
  let timelineEvents = events
    .slice()
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((event) => {
      let label = ''
      switch (event.type) {
        case OrderEventType.ORDER:
          label = 'Order Placed'
          break
        case OrderEventType.PAYMENT_REQUEST:
          label = 'Payment Request'
          break
        case OrderEventType.STATUS_UPDATE:
          label = 'Status Update'
          break
        case OrderEventType.SHIPPING_UPDATE:
          label = 'Shipping Update'
          break
        case OrderEventType.PAYMENT_RECEIPT:
          label = 'Receipt'
          break
        default:
          label = 'Order Event'
      }
      return { ...event, label }
    })

  // Insert 'Awaiting Merchant response...' if needed
  const hasOrderPlaced = timelineEvents.some(
    (e) => e.type === OrderEventType.ORDER
  )
  const hasPaymentRequest = timelineEvents.some(
    (e) => e.type === OrderEventType.PAYMENT_REQUEST
  )
  const hasReceipt = timelineEvents.some(
    (e) => e.type === OrderEventType.PAYMENT_RECEIPT
  )

  // Insert 'Awaiting Merchant response...' if needed
  if (hasOrderPlaced && !hasPaymentRequest) {
    // Find the index of the last 'Order Placed' event
    const lastOrderIdx = timelineEvents
      .map((e) => e.type)
      .lastIndexOf(OrderEventType.ORDER)
    // Insert after the last 'Order Placed'
    const syntheticEvent = {
      id: 'awaiting-merchant',
      orderId,
      event: {
        id: 'awaiting-merchant',
        pubkey: '',
        created_at: 0,
        kind: 0,
        tags: [],
        content: '',
        sig: ''
      },
      type: OrderEventType.STATUS_UPDATE,
      unread: false,
      timestamp: timelineEvents[lastOrderIdx]?.timestamp + 1 || Date.now(),
      label: 'Awaiting Merchant response...'
    }
    timelineEvents = [
      ...timelineEvents.slice(0, lastOrderIdx + 1),
      syntheticEvent,
      ...timelineEvents.slice(lastOrderIdx + 1)
    ]
  }

  // Find the most recent Payment Request event (if any)
  const lastPaymentRequestIdx = timelineEvents
    .map((e) => e.type)
    .lastIndexOf(OrderEventType.PAYMENT_REQUEST)
  const lastPaymentRequestEvent =
    lastPaymentRequestIdx !== -1 ? timelineEvents[lastPaymentRequestIdx] : null

  // Determine expiration state for the most recent Payment Request
  let paymentRequestExpiration = null
  let paymentRequestIsExpired = false
  let paymentRequestExpirationSource = 'none'
  if (lastPaymentRequestEvent) {
    const exp = usePaymentExpiration(lastPaymentRequestEvent.event)
    paymentRequestExpiration = exp.formattedTime
    paymentRequestIsExpired = exp.isExpired
    paymentRequestExpirationSource = exp.expirationSource
  }

  // Insert 'Awaiting payment...' if PaymentRequest exists but no Receipt and not expired
  if (
    hasPaymentRequest &&
    !hasReceipt &&
    lastPaymentRequestEvent &&
    !paymentRequestIsExpired
  ) {
    // Insert after the last PaymentRequest event
    const syntheticEvent = {
      id: 'awaiting-payment',
      orderId,
      event: {
        id: 'awaiting-payment',
        pubkey: '',
        created_at: 0,
        kind: 0,
        tags: [],
        content: '',
        sig: ''
      },
      type: OrderEventType.STATUS_UPDATE,
      unread: false,
      timestamp:
        timelineEvents[lastPaymentRequestIdx]?.timestamp + 1 || Date.now(),
      label: 'Awaiting payment...'
    }
    timelineEvents = [
      ...timelineEvents.slice(0, lastPaymentRequestIdx + 1),
      syntheticEvent,
      ...timelineEvents.slice(lastPaymentRequestIdx + 1)
    ]
  }

  // Animation state: how many steps of the timeline are "drawn"
  const [drawnSteps, setDrawnSteps] = useState(0)
  const [pulsingIdx, setPulsingIdx] = useState<number | null>(null)
  const steps = timelineEvents?.length
  const ANIMATION_DURATION = 400 // ms per step

  useEffect(() => {
    setDrawnSteps(0)
    setPulsingIdx(null)
    if (steps === 0) return
    let step = 0
    const animate = () => {
      if (step < steps) {
        setDrawnSteps(step + 1)
        setPulsingIdx(step)
        setTimeout(() => {
          setPulsingIdx(null)
          step++
          animate()
        }, ANIMATION_DURATION)
      }
    }
    animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, steps])

  return (
    <div className="p-6 bg-paper">
      <h1 className="voice-3l font-bold">Order</h1>
      <p className="voice-sm mb-4">
        Order ID:{' '}
        {orderId.startsWith('order_id_') ? orderId.split('_')[2] : orderId}
      </p>
      <div className="relative">
        {timelineEvents.map((event, idx) => {
          const isPulsing = pulsingIdx === idx
          const showLine = idx < steps - 1 && idx < drawnSteps - 1
          const isLast = idx === timelineEvents?.length - 1

          // Custom rendering for synthetic event
          if (event.id === 'awaiting-merchant') {
            return (
              <div
                key={event.id}
                className="relative flex items-center mb-8 last:mb-0"
              >
                {/* Timeline icon */}
                <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div className="relative z-10">
                    <span
                      className={`absolute inset-0 rounded-full blur-sm opacity-60 transition-all duration-300 ${
                        isPulsing
                          ? 'scale-125 opacity-80'
                          : 'scale-100 opacity-40'
                      }`}
                      style={{ boxShadow: `0 0 8px 2px #64748b` }}
                    />
                    <span
                      className={`relative transition-transform duration-300 ${
                        isPulsing ? 'scale-125' : 'scale-100'
                      }`}
                    >
                      <Icon.Alert className="size-6 text-slate-400" />
                    </span>
                  </div>
                  {/* Vertical line connecting to next icon */}
                  {!isLast && (
                    <div
                      className="absolute top-12 left-1/2 w-1 bg-gradient-to-b from-slate-400/40 to-slate-400/80 rounded-full transition-all duration-500"
                      style={{
                        height: showLine ? '60px' : '0px',
                        opacity: showLine ? 1 : 0,
                        transformOrigin: 'top',
                        transform: `translateX(-50%) ${
                          showLine ? 'scaleY(1)' : 'scaleY(0)'
                        }`,
                        zIndex: 1
                      }}
                    />
                  )}
                </div>
                {/* Timeline content */}
                <div className="flex-1 ml-6 bg-gradient-to-r from-white/5 to-white/0 p-4 rounded-xl border border-muted/30 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="font-semibold text-lg text-slate-500 animate-pulse">
                        Awaiting Merchant response...
                      </span>
                    </div>
                    <div className="flex-1 text-muted-foreground">
                      <span className="text-slate-400">
                        The merchant has not yet sent a payment request for this
                        order.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // Custom rendering for expired Payment Request (show Expired instead of Awaiting Payment)
          if (
            event.type === OrderEventType.PAYMENT_REQUEST &&
            paymentRequestIsExpired &&
            event.id === lastPaymentRequestEvent?.id &&
            !hasReceipt // <-- Only show expired if no receipt exists
          ) {
            return (
              <div
                key={`${event.type}-${event.id}-${event.orderId}`}
                className="relative flex items-center mb-8 last:mb-0"
              >
                {/* Timeline icon */}
                <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div className="relative z-10">
                    <span
                      className={`absolute inset-0 rounded-full blur-sm opacity-60 transition-all duration-300 scale-100 opacity-40`}
                      style={{ boxShadow: `0 0 8px 2px #dc2626` }}
                    />
                    <span className="relative">
                      <Icon.Alert className="size-6 text-red-400" />
                    </span>
                  </div>
                </div>
                {/* Timeline content */}
                <div className="flex-1 ml-6 bg-gradient-to-r from-white/5 to-white/0 p-4 rounded-xl border border-red-500/30 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="font-mono text-xs text-red-400">
                        {OrderUtils.formatOrderTime(event.timestamp)}
                      </span>
                      <span className="font-semibold text-lg text-red-500">
                        Payment Request Expired
                      </span>
                    </div>
                    <div className="flex-1 text-red-400 flex items-center gap-4">
                      {OrderUtils.getOrderSummary(event.event)}
                      <span className="inline-block bg-red-100 text-red-700 font-bold px-3 py-1 rounded-full ml-2">
                        EXPIRED
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mt-2 md:mt-0">
                      <span className="font-mono text-base mb-2 px-2 py-1 rounded-lg bg-red-900 text-red-300">
                        Expired
                        {paymentRequestExpiration
                          ? `: ${paymentRequestExpiration}`
                          : ''}
                        {paymentRequestExpirationSource !== 'none' && (
                          <span className="ml-2 text-xs opacity-75">
                            (Source:{' '}
                            {paymentRequestExpirationSource === 'lightning'
                              ? 'Lightning Invoice'
                              : 'Nostr Event'}
                            )
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          if (event.id === 'awaiting-payment') {
            // Only render if the latest Payment Request is not expired
            if (!paymentRequestIsExpired && event.id === 'awaiting-payment') {
              return (
                <div
                  key={event.id}
                  className="relative flex items-center mb-8 last:mb-0"
                >
                  {/* Timeline icon */}
                  <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <div className="relative z-10">
                      <span
                        className={`absolute inset-0 rounded-full blur-sm opacity-60 transition-all duration-300 ${
                          isPulsing
                            ? 'scale-125 opacity-80'
                            : 'scale-100 opacity-40'
                        }`}
                        style={{ boxShadow: `0 0 8px 2px #fbbf24` }}
                      />
                      <span
                        className={`relative transition-transform duration-300 ${
                          isPulsing ? 'scale-125' : 'scale-100'
                        }`}
                      >
                        <Icon.Zap className="size-6 text-orange-400" />
                      </span>
                    </div>
                    {/* Vertical line connecting to next icon */}
                    {!isLast && (
                      <div
                        className="absolute top-12 left-1/2 w-1 bg-gradient-to-b from-orange-400/40 to-orange-400/80 rounded-full transition-all duration-500"
                        style={{
                          height: showLine ? '60px' : '0px',
                          opacity: showLine ? 1 : 0,
                          transformOrigin: 'top',
                          transform: `translateX(-50%) ${
                            showLine ? 'scaleY(1)' : 'scaleY(0)'
                          }`,
                          zIndex: 1
                        }}
                      />
                    )}
                  </div>
                  {/* Timeline content */}
                  <div className="flex-1 ml-6 bg-gradient-to-r from-white/5 to-white/0 p-4 rounded-xl border border-muted/30 shadow-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <div className="flex flex-col min-w-[120px]">
                        <span className="font-semibold text-lg text-orange-500 animate-pulse">
                          Awaiting payment...
                        </span>
                      </div>
                      <div className="flex-1 text-muted-foreground">
                        <span className="text-orange-400">
                          Please pay the invoice to complete your order. If
                          you've already paid, the Merchant will issue a
                          Receipt. <br />
                          <br />
                          Contact the Merchant if a Receipt isn't issued in a
                          timely manner.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            // Otherwise, don't render anything for this synthetic event
            return null
          }

          // Custom rendering for PaymentRequest when Receipt exists or not expired
          if (
            event.type === OrderEventType.PAYMENT_REQUEST &&
            !hasReceipt &&
            !paymentRequestIsExpired &&
            event.id === lastPaymentRequestEvent?.id
          ) {
            return (
              <div
                key={`${event.type}-${event.id}-${event.orderId}`}
                className="relative flex items-center mb-8 last:mb-0"
              >
                {/* Timeline icon */}
                <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <div className="relative z-10">
                    <span
                      className={`absolute inset-0 rounded-full blur-sm opacity-60 transition-all duration-300 ${
                        isPulsing
                          ? 'scale-125 opacity-80'
                          : 'scale-100 opacity-40'
                      }`}
                      style={{ boxShadow: `0 0 8px 2px #6366f1` }}
                    />
                    <span
                      className={`relative transition-transform duration-300 ${
                        isPulsing ? 'scale-125' : 'scale-100'
                      }`}
                    >
                      {ICONS[event.type] || (
                        <Icon.ShoppingBag className="size-6 text-gray-400" />
                      )}
                    </span>
                  </div>
                  {/* Vertical line connecting to next icon */}
                  {!isLast && (
                    <div
                      className="absolute top-12 left-1/2 w-1 bg-gradient-to-b from-primary/40 to-primary/80 rounded-full transition-all duration-500"
                      style={{
                        height: showLine ? '60px' : '0px',
                        opacity: showLine ? 1 : 0,
                        transformOrigin: 'top',
                        transform: `translateX(-50%) ${
                          showLine ? 'scaleY(1)' : 'scaleY(0)'
                        }`,
                        zIndex: 1
                      }}
                    />
                  )}
                </div>
                {/* Timeline content */}
                <div className="flex-1 ml-6 bg-gradient-to-r from-white/5 to-white/0 p-4 rounded-xl border border-muted/30 shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="font-mono text-xs text-muted-foreground">
                        {OrderUtils.formatOrderTime(event.timestamp)}
                      </span>
                      <span className="font-semibold text-lg">
                        Payment Request
                      </span>
                      {/* Countdown timer for Payment Request */}
                      <span
                        className={`font-mono text-base mb-2 mt-2 px-2 py-1 rounded-lg shadow-sm ${
                          paymentRequestIsExpired
                            ? 'bg-red-900 text-red-300'
                            : 'bg-orange-900 text-orange-300'
                        }`}
                      >
                        {paymentRequestIsExpired ? 'Expired' : 'Expires:'}{' '}
                        {paymentRequestExpiration || 'No expiration'}
                        {paymentRequestExpirationSource !== 'none' && (
                          <span className="ml-2 text-xs opacity-75">
                            (Source:{' '}
                            {paymentRequestExpirationSource === 'lightning'
                              ? 'Lightning Invoice'
                              : 'Nostr Event'}
                            )
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex-1 text-muted-foreground flex items-center gap-4">
                      {OrderUtils.getOrderSummary(event.event)}
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(event)}
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onPayNow(event)}
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // Default rendering for all other events
          return (
            <div
              key={`${event.type}-${event.id}-${event.orderId}`}
              className="relative flex items-center mb-8 last:mb-0"
            >
              {/* Timeline icon */}
              <div className="relative flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <div className="relative z-10">
                  <span
                    className={`absolute inset-0 rounded-full blur-sm opacity-60 transition-all duration-300 ${
                      isPulsing
                        ? 'scale-125 opacity-80'
                        : 'scale-100 opacity-40'
                    }`}
                    style={{ boxShadow: `0 0 8px 2px #6366f1` }}
                  />
                  <span
                    className={`relative transition-transform duration-300 ${
                      isPulsing ? 'scale-125' : 'scale-100'
                    }`}
                  >
                    {ICONS[event.type] || (
                      <Icon.ShoppingBag className="size-6 text-gray-400" />
                    )}
                  </span>
                </div>

                {/* Vertical line connecting to next icon */}
                {!isLast && (
                  <div
                    className="absolute top-12 left-1/2 w-1 bg-gradient-to-b from-primary/40 to-primary/80 rounded-full transition-all duration-500"
                    style={{
                      height: showLine ? '60px' : '0px',
                      opacity: showLine ? 1 : 0,
                      transformOrigin: 'top',
                      transform: `translateX(-50%) ${
                        showLine ? 'scaleY(1)' : 'scaleY(0)'
                      }`,
                      zIndex: 1
                    }}
                  />
                )}
              </div>

              {/* Timeline content */}
              <div className="flex-1 ml-6 bg-gradient-to-r from-white/5 to-white/0 p-4 rounded-xl border border-muted/30 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <div className="flex flex-col min-w-[120px]">
                    <span className="font-mono text-xs text-muted-foreground">
                      {OrderUtils.formatOrderTime(event.timestamp)}
                    </span>
                    <span className="font-semibold text-lg">{event.label}</span>
                  </div>
                  <div className="flex-1 text-muted-foreground">
                    {OrderUtils.getOrderSummary(event.event)}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(event)}
                    >
                      View
                    </Button>
                    {event.type === OrderEventType.PAYMENT_REQUEST && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onPayNow(event)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OrderTimeline
