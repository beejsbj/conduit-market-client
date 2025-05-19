import PageSection from '@/layouts/PageSection'
import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/Cards/CardComponents'

// Base card style that applies to all cards
const baseCardStyle =
  'h-full border-none bg-center bg-no-repeat transition-all hover:bg-size-[120%]  hover:scale-102 bg-size-[110%]'

const heroCards = [
  {
    id: 1,
    title: 'Decentralized marketplace freedom',
    description:
      'The open social e-commerce platform powered by NOSTR, ensuring privacy and control over your transactions.',
    isMainCard: true,
    gridClass: 'col-span-2 row-span-2',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero1.jpg')] `
  },
  {
    id: 2,
    title: 'Instant payments with lightning BTC',
    description: null,
    gridClass: '',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero2.jpg')] `
  },
  {
    id: 3,
    title: 'Discover curated legal products from visionary brands and artisans',
    description: null,
    gridClass: 'row-span-3',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero3.jpg')] `
  },
  {
    id: 4,
    title: 'Build trust through a network of verified, meaningful interactions',
    description: null,
    gridClass: 'row-span-2',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero4.jpg')] `
  },
  {
    id: 5,
    title: 'Customize algorithms or create your own',
    description: null,
    gridClass: '',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero5.jpg')] `
  },
  {
    id: 6,
    title: 'Your data, your rules. No tracking, no manipulation.',
    description: null,
    gridClass: '',
    cardClass: `${baseCardStyle} bg-[url('../assets/images/hero6.jpg')] `
  }
]

const Hero: React.FC = () => {
  return (
    <PageSection width="wide">
      <ul className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-3 gap-4 min-h-[100vh] lg:min-h-[70vh]">
        {heroCards.map((card) => (
          <li key={card.id} className={card.gridClass}>
            <Card className={card.cardClass}>
              <CardHeader className="flex gap-8 justify-between flex-wrap lg:flex-nowrap p-6">
                {card.isMainCard ? (
                  <>
                    <h1 className="loud-voice">{card.title}</h1>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                  </>
                ) : (
                  <CardTitle className="text-sm max-w-1/2 flex-1">
                    {card.id + ' ' + card.title}
                  </CardTitle>
                )}
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
    </PageSection>
  )
}

export default Hero
