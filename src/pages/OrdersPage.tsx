import React, { useState, useRef, useEffect } from 'react'
import {
  OrderEventType,
  type StoredOrderEvent,
  useOrderStore
} from '@/stores/useOrderStore'
import { useOrderSubscription } from '@/hooks/useOrderSubscription'
import { OrderUtils } from 'nostr-commerce-schema'
import PageSection from '@/layouts/PageSection'
import Icon from '@/components/Icon'
import Button from '@/components/Buttons/Button'
import OrderDetails from '@/components/OrderDetails'
import type { NostrEvent } from '@nostr-dev-kit/ndk'
import OrderPayQR from '@/components/OrderPayQR'
import Avatar from '@/components/Avatar'
import { useNostrProfile } from '@/hooks/useNostrProfile'
import { usePaymentExpiration } from '@/hooks/usePaymentExpiration'
import AuthGuard from '@/components/AuthGuard'
import { useRelayState } from '@/stores/useRelayState'
// Import split components
import OrderTimeline from '@/components/orders/OrderTimeline'
import OrderCard from '@/components/orders/OrderCard'
import OrderDetailsModal from '@/components/orders/OrderDetailsModal'
import {
  OrderTab,
  getTabLabel,
  getTabIcon,
  getUnreadCountForTab
} from '@/components/orders/orderTabUtils'

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OrderTab>(OrderTab.ALL)
  const [selectedOrder, setSelectedOrder] = useState<StoredOrderEvent | null>(
    null
  )
  const [showQRModal, setShowQRModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  // Add state for toggling older items

  const { getUnreadCount, getOrderById, clearAllOrders } = useOrderStore()

  const { relayPoolVersion } = useRelayState()
  const { isLoading, error, refreshSubscription } = useOrderSubscription()

  // Use Zustand selectors for reactivity
  const orders = useOrderStore((state) => state.orders)
  const paymentRequests = useOrderStore((state) => state.paymentRequests)
  const statusUpdates = useOrderStore((state) => state.statusUpdates)
  const shippingUpdates = useOrderStore((state) => state.shippingUpdates)
  const receipts = useOrderStore((state) => state.receipts)

  // Memoized derived data
  const filteredOrders = React.useMemo(
    () =>
      getFilteredOrders(
        activeTab,
        paymentRequests,
        statusUpdates,
        shippingUpdates,
        receipts
      ),
    [activeTab, paymentRequests, statusUpdates, shippingUpdates, receipts]
  )

  // Memoized all order timelines
  const allOrderTimelines = React.useMemo(
    () =>
      getAllOrderTimelines(
        orders,
        paymentRequests,
        statusUpdates,
        shippingUpdates,
        receipts
      ),
    [orders, paymentRequests, statusUpdates, shippingUpdates, receipts]
  )

  // Handler for Pay Now (opens QR modal)
  const handlePayNow = (order: StoredOrderEvent) => {
    setSelectedOrder(order)
    setShowQRModal(true)
    setShowDetailsModal(false)
  }

  // Handler for View (opens details modal)
  const handleView = (order: StoredOrderEvent) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
    setShowQRModal(false)
  }

  // For payment requests, find the original order event
  const getOrderDetailsEvent = (order: StoredOrderEvent) => {
    if (order.type === OrderEventType.PAYMENT_REQUEST) {
      return getOrderById(order.orderId, OrderEventType.ORDER)?.event
    }
    return undefined
  }

  useEffect(() => {
    window.addEventListener('beforeunload', () => {
      clearAllOrders()
      refreshSubscription()
    })
    return () => {
      window.removeEventListener('beforeunload', () => {
        clearAllOrders()
        refreshSubscription()
      })
    }
  }, [])

  // Modal close on ESC
  useEffect(() => {
    if (!selectedOrder) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrder(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedOrder])

  // Clear cache and refresh when relay pool changes
  useEffect(() => {
    if (relayPoolVersion > 1) {
      clearAllOrders()
      refreshSubscription()
    }
  }, [relayPoolVersion, clearAllOrders, refreshSubscription])

  return (
    <AuthGuard>
      <PageSection>
        <div className="overflow-x-hidden w-full">
          <div className="grid gap-8 lg:flex lg:justify-between max-w-full">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap justify-between items-end">
                <h1 className="voice-4l">Orders</h1>
                <div className="flex flex-col items-end gap-2"></div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-muted mt-8 overflow-x-auto max-w-full">
                {Object.values(OrderTab).map((tab) => {
                  const unreadCount = getUnreadCountForTab(tab, getUnreadCount)
                  return (
                    <button
                      key={tab}
                      className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-muted-foreground hover:text-ink'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {getTabIcon(tab)}
                      <span>{getTabLabel(tab)}</span>
                      {unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center p-12">
                  <div className="text-lg text-muted-foreground">
                    Loading orders...
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg mb-6">
                  Error: {error}
                </div>
              )}

              {/* Order list or timeline */}
              <div className="mt-8 space-y-4 max-w-full">
                {activeTab === OrderTab.ALL ? (
                  Object.keys(allOrderTimelines)?.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon.ShoppingBag className="size-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="voice-2l text-muted-foreground mb-2">
                        No orders yet
                      </h3>
                      <p className="voice-base text-muted-foreground">
                        Your order notifications will appear here
                      </p>
                    </div>
                  ) : (
                    // Render a timeline for each orderId, sorted newest-to-oldest
                    Object.entries(allOrderTimelines)
                      .sort((a, b) => {
                        const aLatest = a[1][0]?.timestamp || 0
                        const bLatest = b[1][0]?.timestamp || 0
                        return bLatest - aLatest
                      })
                      .map(([orderId, events]) => (
                        <OrderTimeline
                          key={orderId}
                          orderId={orderId}
                          events={events}
                          onPayNow={handlePayNow}
                          onView={handleView}
                        />
                      ))
                  )
                ) : filteredOrders?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon.ShoppingBag className="size-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="voice-2l text-muted-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="voice-base text-muted-foreground">
                      Your order notifications will appear here
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderCard
                      key={`${order.type}-${order.id}-${order.orderId}`}
                      order={order}
                      onClick={() => handleView(order)}
                      onPayNow={() => handlePayNow(order)}
                      receipts={receipts} // Pass receipts for paid status
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* QR Modal for Pay Now */}
        {showQRModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowQRModal(false)}
            showQROnly={true}
          />
        )}
        {/* Details Modal for View */}
        {showDetailsModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowDetailsModal(false)}
            showQROnly={false}
            getOrderDetailsEvent={getOrderDetailsEvent}
            onPayNow={() => {
              setShowDetailsModal(false)
              setShowQRModal(true)
            }}
          />
        )}
      </PageSection>
    </AuthGuard>
  )
}

function getAllOrderTimelines(
  orders: StoredOrderEvent[],
  paymentRequests: StoredOrderEvent[],
  statusUpdates: StoredOrderEvent[],
  shippingUpdates: StoredOrderEvent[],
  receipts: StoredOrderEvent[]
) {
  const allEvents = [
    ...orders,
    ...paymentRequests,
    ...statusUpdates,
    ...shippingUpdates,
    ...receipts
  ]
  const grouped: Record<string, StoredOrderEvent[]> = {}
  allEvents.forEach((event) => {
    if (!grouped[event.orderId]) grouped[event.orderId] = []
    grouped[event.orderId].push(event)
  })
  Object.values(grouped).forEach((arr) =>
    arr.sort((a, b) => b.timestamp - a.timestamp)
  )
  return grouped
}

function getFilteredOrders(
  activeTab: OrderTab,
  paymentRequests: StoredOrderEvent[],
  statusUpdates: StoredOrderEvent[],
  shippingUpdates: StoredOrderEvent[],
  receipts: StoredOrderEvent[]
): StoredOrderEvent[] {
  switch (activeTab) {
    case OrderTab.PAYMENT_REQUESTS:
      return paymentRequests
    case OrderTab.STATUS_UPDATES:
      return statusUpdates
    case OrderTab.SHIPPING_UPDATES:
      return shippingUpdates
    case OrderTab.RECEIPTS:
      return receipts
    case OrderTab.ALL:
    default:
      return [] // Not used anymore
  }
}

export default OrdersPage
