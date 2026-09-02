import type { NDKEvent } from '@nostr-dev-kit/ndk'

interface ShowcaseProduct {
  title: string
  price: string
  image: string
  stock: number
  merchant: string
}

const merchants = [
  '13f9c26c5f27409bb55598ce764f8f785a63bbfc8940065d92f1a8d90c01aa11',
  '24a8d37d6e3851acc66609df875a9a896b74ccad9a51176ea302b9e01d12bb22',
  '35b9e48e7f4962bdd77710ea986bab07c85ddbea1b62287fb413caf12e23cc33',
  '46caf59f805a73cee88821fb097cbc18d96eecfb2c73398ac524db023f34dd44'
]

const products: ShowcaseProduct[] = [
  ['Neon City Print', '38.00', '/images/hero1.jpg', 12, merchants[0]],
  ['Bitcoin Horizon Card', '12.50', '/images/hero2.jpg', 4, merchants[0]],
  ['Relay Runner Poster', '44.00', '/images/hero3.jpg', 8, merchants[0]],
  ['Purple Current Tee', '31.00', '/images/hero4.jpg', 20, merchants[1]],
  ['Nostr Night Zine', '16.00', '/images/hero5.jpg', 3, merchants[1]],
  ['Open Commerce Patch', '9.00', '/images/hero6.jpg', 18, merchants[1]],
  ['Lightning Desk Mat', '52.00', '/images/hero2.jpg', 9, merchants[2]],
  ['Cyber Market Tote', '27.00', '/images/hero3.jpg', 2, merchants[2]],
  ['Electric City Sticker Set', '8.50', '/images/hero1.jpg', 24, merchants[2]],
  ['Sovereign Seller Notebook', '22.00', '/images/hero5.jpg', 7, merchants[3]],
  ['Peer-to-Peer Cap', '34.00', '/images/hero4.jpg', 0, merchants[3]],
  ['No Middlemen Enamel Pin', '14.00', '/images/hero6.jpg', 15, merchants[3]]
].map(([title, price, image, stock, merchant]) => ({
  title: title as string,
  price: price as string,
  image: image as string,
  stock: stock as number,
  merchant: merchant as string
}))

export const showcaseProducts = products.map(
  ({ title, price, image, stock, merchant }, index) =>
    ({
      id: `showcase-product-${String(index + 1).padStart(2, '0')}`,
      pubkey: merchant,
      created_at: 1748736000 + index,
      kind: 30402,
      content: '',
      sig: '',
      tags: [
        ['d', `showcase-product-${index + 1}`],
        ['title', title],
        ['price', price, 'USD'],
        ['type', 'simple', 'physical'],
        ['visibility', 'on-sale'],
        ['stock', String(stock)],
        ['summary', 'Deterministic sample listing for the portfolio showcase.'],
        ['image', image, '1200x800', '0'],
        ['t', 'portfolio-showcase']
      ]
    }) as unknown as NDKEvent
)
