import React from 'react'
import { useAccountStore } from '@/stores/useAccountStore'
import SlideDrawer from './SlideDrawer'
import Button from './Buttons/Button'
import Icon from './Icon'
import Field from './Form/Field'
import { RelayPoolSelector } from '@/components/Filters/RelayPoolSelector'
import { SHOWCASE_MODE } from '@/lib/showcase.ts'

const MobileMenu: React.FC = () => {
  const { isLoggedIn } = useAccountStore()

  return (
    <SlideDrawer>
      <div className="space-y-4 mt-4">
        {!SHOWCASE_MODE && (
          <Field
            name="search"
            type="text"
            rightIcon="Search"
            className="w-full"
            placeholder="Search..."
          />
        )}

        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            isLink
            to="/shop"
            className="w-full justify-start"
          >
            <Icon.ShoppingCart className="max-w-5 mr-2" />
            <span>Shop</span>
          </Button>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              isLink
              to="/orders"
              className="w-full justify-start"
            >
              <Icon.Wand className="max-w-5 mr-2" />
              <span>Orders</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              isLink
              to={SHOWCASE_MODE ? '/carts' : '/how-it-works'}
              className="w-full justify-start"
            >
              <Icon.ShoppingBag className="max-w-5 mr-2" />
              <span>{SHOWCASE_MODE ? 'Carts' : 'How it works'}</span>
            </Button>
          )}

          {isLoggedIn && (
            <Button
              variant="ghost"
              isLink
              to="/messages"
              className="w-full justify-start"
            >
              <Icon.Messages className="max-w-5 mr-2" />
              <span>Messages</span>
            </Button>
          )}

          <Button
            variant="ghost"
            isLink
            to={SHOWCASE_MODE ? '/style-guide' : '/sell'}
            className="w-full justify-start"
          >
            <Icon.Wand className="max-w-5 mr-2" />
            <span>{SHOWCASE_MODE ? 'Design system' : 'Sell'}</span>
          </Button>

          {isLoggedIn ? (
            <Button
              variant="ghost"
              isLink
              to="/user"
              className="w-full justify-start"
            >
              <Icon.User className="max-w-5 mr-2" />
              <span>Profile</span>
            </Button>
          ) : SHOWCASE_MODE ? (
            <Button variant="primary" disabled className="w-full justify-start">
              <Icon.User className="max-w-5 mr-2" />
              <span>Demo mode</span>
            </Button>
          ) : (
            <Button
              variant="primary"
              isLink
              to="/auth"
              className="w-full justify-start"
            >
              <Icon.User className="max-w-5 mr-2" />
              <span>Login</span>
            </Button>
          )}
        </div>

        {/* Relay Editor at bottom of sidebar */}
        {!SHOWCASE_MODE && (
          <div className="pt-4 border-t border-base-700">
            <RelayPoolSelector
              className="w-full"
              label="Relay Settings"
              placeholder="Select relays..."
            />
          </div>
        )}
      </div>
    </SlideDrawer>
  )
}

export default MobileMenu
