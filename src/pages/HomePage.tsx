import ProductCard from '@/components/Cards/ProductCard'
import PromoCard from '@/components/Cards/PromoCard'
import Carousel from '@/components/Carousel'
import PageSection from '@/layouts/PageSection'
import CollectionCard from '@/components/Cards/CollectionCard'
import StoreCard from '@/components/Cards/StoreCard'
import ArticleCard from '@/components/Cards/ArticleCard'
import Banner from '@/components/Banner'
import { showcaseProducts } from '@/data/showcaseProducts'

const HomePage: React.FC = () => {
  return (
    <>
      {/* <Hero /> */}

      <CarouselSection
        name="All Products"
        type={CardType.ProductCard}
        variant="card"
      />

      <Banner />
    </>
  )
}

export default HomePage

const CardType = {
  ArticleCard: 'ArticleCard',
  CollectionCard: 'CollectionCard',
  ProductCard: 'ProductCard',
  PromoCard: 'PromoCard',
  StoreCard: 'StoreCard'
} as const

interface CarouselSectionProps {
  name: string
  type: string
  variant?: string
  visibleItems?: number
  visibleItemsMobile?: number
}

function CarouselSection({
  name,
  type,
  variant,
  visibleItems = undefined,
  visibleItemsMobile = undefined
}: CarouselSectionProps) {
  return (
    <PageSection>
      <div className="mb-4">
        <h2 className="voice-3l">{name}</h2>
      </div>
      <Carousel
        visibleItems={visibleItems}
        visibleItemsMobile={visibleItemsMobile}
      >
        {showcaseProducts.map((e, index) => {
            switch (type) {
              case CardType.ArticleCard:
                return <ArticleCard key={index} event={e} />
              case CardType.CollectionCard:
                return <CollectionCard key={index} event={e} />
              case CardType.ProductCard:
                return (
                  <ProductCard
                    key={index}
                    event={e}
                    variant={variant as undefined}
                  />
                )
              case CardType.PromoCard:
                return (
                  <PromoCard
                    key={index}
                    variant={variant as undefined}
                    event={e}
                  />
                )
              case CardType.StoreCard:
              default:
                return <StoreCard key={index} event={e} />
            }
          })}
      </Carousel>
    </PageSection>
  )
}
