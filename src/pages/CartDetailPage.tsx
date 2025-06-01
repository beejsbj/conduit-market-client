import React from 'react'
import { useParams } from 'wouter'
import { useCartStore } from '@/stores/useCartStore'

const CartDetailPage: React.FC = () => {
  const { merchantPubkey } = useParams()

  const { getCart } = useCartStore()
  const cart = getCart(merchantPubkey as string)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Single Cart Page</h1>
    </div>
  )
}

export default CartDetailPage
