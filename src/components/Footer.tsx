import React from 'react'
import Button from './Buttons/Button'
import Icon from './Icon'
import NewsletterSignup from './NewsletterSignup'
import PageSection from '@/layouts/PageSection'
import ContactHelp from './Buttons/ContactHelp'
import Logo from './Logo'
import { SHOWCASE_MODE } from '@/lib/showcase.ts'

interface NavLink {
  name: string
  link: string
}

interface NavSection {
  heading: string
  links: NavLink[]
}

const navs: NavSection[] = [
  {
    heading: 'Shop',
    links: [
      {
        name: 'All',
        link: '/shop/all'
      },
      {
        name: 'Categories',
        link: '/shop/categories'
      },
      {
        name: 'Search',
        link: '/shop/search'
      },
      {
        name: 'Trending',
        link: '/shop/trending'
      }
    ]
  },
  {
    heading: 'Sell',
    links: [
      {
        name: 'Your stores',
        link: '/sell/stores'
      },
      {
        name: 'Your products',
        link: '/sell/products'
      },
      {
        name: 'Manage store',
        link: '/sell/manage'
      },
      {
        name: 'Messages',
        link: '/sell/messages'
      }
    ]
  },
  {
    heading: 'For Sellers',
    links: [
      {
        name: 'Book a demo',
        link: '/sellers/demo'
      },
      {
        name: 'Create a store',
        link: '/sellers/create'
      },
      {
        name: 'Features',
        link: '/sellers/features'
      },
      {
        name: 'Why Conduit',
        link: '/sellers/why-conduit'
      },
      {
        name: 'FAQ',
        link: '/sellers/faq'
      }
    ]
  },
  {
    heading: 'For Shoppers',
    links: [
      {
        name: 'Join waitlist',
        link: '/shoppers/waitlist'
      },
      {
        name: 'Features',
        link: '/shoppers/features'
      },
      {
        name: 'Why Conduit',
        link: '/shoppers/why-conduit'
      },
      {
        name: 'About us',
        link: '/shoppers/about'
      },
      {
        name: 'FAQ',
        link: '/shoppers/faq'
      }
    ]
  },
  {
    heading: 'Site Map',
    links: [
      {
        name: 'Home',
        link: '/'
      },
      {
        name: 'Style Guide',
        link: '/style-guide'
      },
      {
        name: 'How it Works',
        link: '/how-it-works'
      },
      {
        name: 'Auth',
        link: '/auth'
      },
      {
        name: 'List of Merchants',
        link: '/merchants'
      },
      {
        name: 'List of Merchant Products',
        link: '/merchant/conduit'
      },
      {
        name: 'List of Categories',
        link: '/categories'
      },
      {
        name: 'List of Products in a Category',
        link: '/category/Drinks'
      },
      {
        name: 'Product Detail Page',
        link: '/product/123'
      },
      {
        name: 'List of Carts',
        link: '/carts'
      },
      {
        name: 'Merchant Cart',
        link: '/cart/conduit'
      },
      {
        name: 'Profile',
        link: '/profile'
      },
      {
        name: 'Orders',
        link: '/profile/orders'
      },
      {
        name: 'Zapout',
        link: '/zapout'
      }
    ]
  }
]

const socials = [
  {
    name: 'GitHub',
    link: '#',
    icon: 'github'
  },
  {
    name: 'Facebook',
    link: '#',
    icon: 'facebook'
  },
  {
    name: 'Instagram',
    link: '#',
    icon: 'instagram'
  },
  {
    name: 'X',
    link: '#',
    icon: 'x'
  },
  {
    name: 'LinkedIn',
    link: '#',
    icon: 'linkedin'
  }
]

const legalLinks = [
  {
    name: 'Privacy Policy',
    link: '/privacy'
  },
  {
    name: 'Terms of Service',
    link: '/terms'
  },
  {
    name: 'Cookies Settings',
    link: '/cookies'
  }
]

const Footer = () => {
  if (SHOWCASE_MODE) {
    return (
      <footer className="bg-paper overflow-hidden mt-10 border-t border-muted">
        <PageSection width="wide">
          <div className="py-8 flex flex-wrap items-center justify-between gap-6">
            <Logo className="max-w-40" />
            <nav className="flex flex-wrap items-center gap-4">
              <Button variant="link" size="sm" isLink to="/" rounded={false}>
                Marketplace
              </Button>
              <Button variant="link" size="sm" isLink to="/carts" rounded={false}>
                Carts
              </Button>
              <Button variant="link" size="sm" isLink to="/style-guide" rounded={false}>
                Design system
              </Button>
              <a className="voice-sm underline underline-offset-4" href="https://github.com/beejsbj/conduit-market-client/tree/portfolio/showcase-2025" target="_blank" rel="noreferrer">
                Source
              </a>
              <a className="voice-sm underline underline-offset-4" href="https://conduit.market/" target="_blank" rel="noreferrer">
                Current Conduit
              </a>
            </nav>
          </div>
          <p className="voice-sm text-muted-foreground pb-8">
            Unofficial historical portfolio showcase. Collaborative work;
            attribution is preserved in Git history.
          </p>
        </PageSection>
      </footer>
    )
  }

  return (
    <footer className="bg-paper overflow-hidden mt-10">
      <PageSection width="wide">
        <div className="flex gap-30 gap-y-10 flex-wrap">
          <NewsletterSignup />
          <ContactHelp />
        </div>
      </PageSection>

      <PageSection width="wide">
        <div className=" pt-12 grid gap-8 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <Logo className="max-w-50" />
          {navs.map((nav) => (
            <nav key={nav.heading}>
              <h3 className="voice-base font-bold">{nav.heading}</h3>
              <ul className="mt-4 grid gap-1 justify-start">
                {nav.links.map((link) => (
                  <li key={link.name}>
                    <Button
                      variant="link"
                      size="sm"
                      isLink
                      to={link.link}
                      rounded={false}
                      className="justify-start pl-0"
                    >
                      {link.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </PageSection>

      <PageSection width="wide">
        <div className="border-t border-muted py-8 flex flex-col md:flex-row justify-between items-center">
          <div className="legal flex items-center flex-wrap gap-4">
            <span className="voice-sm text-muted-foreground">
              © 2025 Conduit. All rights reserved.
            </span>
            {legalLinks.map((link) => (
              <React.Fragment key={link.name}>
                <span className="text-base-400">|</span>
                <Button
                  variant="link"
                  size="sm"
                  isLink
                  to={link.link}
                  rounded={false}
                >
                  {link.name}
                </Button>
              </React.Fragment>
            ))}
          </div>

          <div className="social flex gap-2">
            {socials.map((social) => (
              <Button
                key={social.name}
                variant="link"
                size="icon"
                isLink
                to={social.link}
                rounded={false}
              >
                <Icon.Heart />
              </Button>
            ))}
          </div>
        </div>
      </PageSection>
    </footer>
  )
}

export default Footer
