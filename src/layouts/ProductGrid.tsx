import React from 'react'
import ProductCard from '@/components/Cards/ProductCard.tsx'
import PageSection from '@/layouts/PageSection'
import { showcaseProducts } from '@/data/showcaseProducts'

const ProductGrid: React.FC = () => {
  return (
    <PageSection>
      <h1 className="voice-3l">Products</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 list-none p-0">
        {showcaseProducts.map((event) => (
          <li key={event.id}>
            <ProductCard event={event} />
          </li>
        ))}
      </ul>
    </PageSection>
  )
}

export default ProductGrid
