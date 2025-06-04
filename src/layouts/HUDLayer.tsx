import CartDrawer from '@/layouts/CartDrawer'
import PageSection from './PageSection'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/useCartStore'
import { useEffect } from 'react'

/*  #todo
// -  there should be a way to individually control each Hud element but also a way to control all of them at once. */

const HUDLayer: React.FC = () => {
  const { isHUDOpen, toggleHUD } = useCartStore()

  const INACTIVITY_DELAY = 2000

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout
    let inactivityTimeout: NodeJS.Timeout

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimeout)
      inactivityTimeout = setTimeout(() => {
        // Auto-open HUD after 5 seconds of inactivity if it's closed
        if (!isHUDOpen) {
          toggleHUD(true)
        }
      }, INACTIVITY_DELAY)
    }

    const handleScroll = () => {
      if (isHUDOpen) {
        toggleHUD(false)
      }
      // Reset the timeout on each scroll
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        // Handle potential auto-show after scroll stops if needed
      }, 1000)

      // Reset inactivity timer on scroll
      resetInactivityTimer()
    }

    const handleUserActivity = () => {
      // Reset inactivity timer on any user activity
      resetInactivityTimer()
    }

    // Add event listeners for various user activities
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('touchstart', handleUserActivity)

    // Start the inactivity timer initially
    resetInactivityTimer()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      clearTimeout(scrollTimeout)
      clearTimeout(inactivityTimeout)
    }
  }, [isHUDOpen, toggleHUD])

  const cartSectionClassName = cn(
    'self-end pointer-events-auto transition-all duration-600 ease-bounce',
    {
      'translate-y-0 opacity-100': isHUDOpen,
      'translate-y-9/10  opacity-50 hover:translate-y-7/10': !isHUDOpen
    }
  )

  return (
    <div className="fixed inset-0 z-50 pointer-events-none grid">
      <PageSection sectionClassName={cartSectionClassName}>
        <CartDrawer />
      </PageSection>
    </div>
  )
}

export default HUDLayer
