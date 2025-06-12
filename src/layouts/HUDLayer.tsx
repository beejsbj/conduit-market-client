import CartDrawer from '@/layouts/CartDrawer'
import PageSection from './PageSection'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useInterfaceStore } from '@/stores/useInterfaceStore'

/*  #todo
// -  there should be a way to individually control each Hud element but also a way to control all of them at once. */
// - draging on the cart drawer ends up scrolling the page in the background

const HUDLayer: React.FC = () => {
  const { isCartHUDOpen, toggleCartHUD } = useInterfaceStore()
  const [isHealthBarOpen, setIsHealthBarOpen] = useState(false)

  const [anyHudOpen, setAnyHudOpen] = useState(false)

  // Update anyHudOpen whenever any HUD element state changes
  useEffect(() => {
    setAnyHudOpen(isCartHUDOpen || isHealthBarOpen)
  }, [isCartHUDOpen, isHealthBarOpen])

  const hideAllHud = () => {
    toggleCartHUD(false)
    setIsHealthBarOpen(false)
  }

  //   conditional classes

  // hud layer container
  const hudLayerContainerClassName = cn(
    'fixed inset-0 z-50 pointer-events-none grid transition-all duration-300',
    {
      'bg-paper/40 md:bg-transparent': anyHudOpen
    }
  )

  const cartSectionClassName = cn(
    'self-end pointer-events-auto transition-all duration-600 ease-bounce',
    {
      'translate-y-0 opacity-100': isCartHUDOpen,
      'translate-y-9/10  opacity-50 hover:translate-y-7/10': !isCartHUDOpen
    }
  )

  const handleHudLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //  if (anyHudOpen) {
    //    e.stopPropagation()
    //    hideAllHud()
    //  }
  }

  return (
    <div className={hudLayerContainerClassName} onClick={handleHudLayerClick}>
      <PageSection>
        <div>health bar</div>
      </PageSection>
      <PageSection sectionClassName={cartSectionClassName}>
        <CartDrawer />
      </PageSection>
    </div>
  )
}

export default HUDLayer
