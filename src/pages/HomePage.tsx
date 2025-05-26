import ProductCard from '@/components/Cards/ProductCard'
import PromoCard from '@/components/Cards/PromoCard'
import Carousel from '@/components/Carousel'
import Hero from '@/components/HomePage/Hero'

import PageSection from '@/layouts/PageSection'

import { useState } from 'react'
import { ProductListingMocks } from 'nostr-commerce-schema'
import { useEffect } from 'react'
import { NDKEvent } from '@nostr-dev-kit/ndk'
import CollectionCard from '@/components/Cards/CollectionCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '@/components/Cards/ArticleCard'
import RankingTable from '@/components/RankingTable'
import ContactHelp from '@/components/Buttons/ContactHelp'
import NewsletterSignup from '@/components/NewsletterSignup'
import Banner from '@/components/Banner'
const content = [
  {
    header: 'For You',
    component: PromoCard
  }
]

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<NDKEvent[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const events = (await ProductListingMocks.generateEventsArray(
          10
        )) as unknown as NDKEvent[]
        setProducts(events)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      }
    }

    fetchProducts()
  }, [])
  return (
    <>
      <Hero />

      {/* For You */}
      <PageSection>
        <h2 className="attention-voice">For You</h2>
        <Carousel>
          {products.map((event, index) => {
            return <PromoCard key={index} variant="1item" event={event} />
          })}
        </Carousel>
      </PageSection>

      {/* Whats HOt */}
      <PageSection>
        <h2 className="attention-voice">What's Hot</h2>
        <div className="grid grid-cols-2 gap-12">
          <RankingTable />
          <RankingTable />
        </div>
      </PageSection>

      {/* Holiday discounts */}
      <PageSection>
        <h2 className="attention-voice">Holiday discounts</h2>
        <Carousel visibleItems={6}>
          {products.map((event, index) => {
            return <ProductCard key={index} event={event} isHomeCard />
          })}
        </Carousel>
      </PageSection>

      {/* Curated by the community */}
      <PageSection>
        <h2 className="attention-voice">Curated by the community</h2>
        <Carousel>
          {products.map((event, index) => {
            return <CollectionCard key={index} event={event} />
          })}
        </Carousel>
      </PageSection>

      {/* Trending Stores */}
      <PageSection>
        <h2 className="attention-voice">Trending Stores</h2>
        <Carousel>
          {products.map((event, index) => {
            return <StoreCard key={index} event={event} />
          })}
        </Carousel>
      </PageSection>

      {/* Real Coffee Beans */}
      <PageSection>
        <h2 className="attention-voice">Real Coffee Beans</h2>
        <Carousel>
          {products.map((event, index) => {
            return <ProductCard key={index} event={event} />
          })}
        </Carousel>
      </PageSection>

      {/* Handmade Goods */}
      <PageSection>
        <h2 className="attention-voice">Handmade Goods</h2>
        <Carousel visibleItems={6}>
          {products.map((event, index) => {
            return <ProductCard key={index} event={event} isHomeCard />
          })}
        </Carousel>
      </PageSection>

      {/* Tech Gadgets */}
      <PageSection>
        <h2 className="attention-voice">Tech Gadgets</h2>
        <Carousel>
          {products.map((event, index) => {
            return <PromoCard key={index} variant="1item" event={event} />
          })}
        </Carousel>
      </PageSection>

      {/* Nostr 101 */}
      <PageSection>
        <h2 className="attention-voice">Nostr 101</h2>
        <Carousel>
          {products.map((event, index) => {
            return <ArticleCard key={index} event={event} />
          })}
        </Carousel>
      </PageSection>

      <Banner />
    </>
  )
}

export default HomePage
