import React from 'react'
import Icon from '@/components/Icon'
import { OrderEventType } from '@/stores/useOrderStore'

export enum OrderTab {
  ALL = 'all',
  PAYMENT_REQUESTS = 'payment_requests',
  STATUS_UPDATES = 'status_updates',
  SHIPPING_UPDATES = 'shipping_updates',
  RECEIPTS = 'receipts'
}

export function getTabLabel(tab: OrderTab): string {
  switch (tab) {
    case OrderTab.ALL:
      return 'All Orders'
    case OrderTab.PAYMENT_REQUESTS:
      return 'Payment Requests'
    case OrderTab.STATUS_UPDATES:
      return 'Status Updates'
    case OrderTab.SHIPPING_UPDATES:
      return 'Shipping Updates'
    case OrderTab.RECEIPTS:
      return 'Receipts'
    default:
      return 'Orders'
  }
}

export function getTabIcon(tab: OrderTab) {
  switch (tab) {
    case OrderTab.ALL:
      return <Icon.ShoppingBag />
    case OrderTab.PAYMENT_REQUESTS:
      return <Icon.Zap />
    case OrderTab.STATUS_UPDATES:
      return <Icon.Alert />
    case OrderTab.SHIPPING_UPDATES:
      return <Icon.ShoppingCart />
    case OrderTab.RECEIPTS:
      return <Icon.ReceiptText />
    default:
      return <Icon.ShoppingBag />
  }
}

export function getUnreadCountForTab(
  tab: OrderTab,
  getUnreadCount: (type: OrderEventType) => number
): number {
  switch (tab) {
    case OrderTab.PAYMENT_REQUESTS:
      return getUnreadCount(OrderEventType.PAYMENT_REQUEST)
    case OrderTab.STATUS_UPDATES:
      return getUnreadCount(OrderEventType.STATUS_UPDATE)
    case OrderTab.SHIPPING_UPDATES:
      return getUnreadCount(OrderEventType.SHIPPING_UPDATE)
    case OrderTab.RECEIPTS:
      return getUnreadCount(OrderEventType.PAYMENT_RECEIPT)
    case OrderTab.ALL:
    default:
      return (
        getUnreadCount(OrderEventType.ORDER) +
        getUnreadCount(OrderEventType.PAYMENT_REQUEST) +
        getUnreadCount(OrderEventType.STATUS_UPDATE) +
        getUnreadCount(OrderEventType.SHIPPING_UPDATE) +
        getUnreadCount(OrderEventType.PAYMENT_RECEIPT)
      )
  }
}
