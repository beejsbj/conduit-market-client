interface OrderItem {
  eventId: string
  productId: string
  quantity: number
  title: string
  unitPrice: number
  // shipping_tag: string | null; // TODO: Implement shipping tags
  [key: string]: string | number | boolean | undefined | null
}

interface OrderData {
  items: OrderItem[]

  customerPubkey: string
  address?: string
  email?: string
  phone?: string
  message?: string
}
