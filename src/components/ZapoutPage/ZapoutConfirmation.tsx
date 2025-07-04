import { useEffect, useState, useCallback, useRef } from 'react'
import Button from '../Buttons/Button'
import Icon from '../Icon'
import Logo from '../Logo'
import { cn } from '@/lib/utils'

import { useZapoutStore } from '@/stores/useZapoutStore'
import { useAccountStore } from '@/stores/useAccountStore'
import { useParams } from 'wouter'
import { createOrder } from '@/lib/nostr/createOrder'
import postOrder from '@/lib/nostr/postOrder'
import { useLocation } from 'wouter'

const LoadingBar: React.FC<{
  duration?: number
  onComplete?: () => void
  onProgressUpdate?: (progress: number) => void
  className?: string
}> = ({ duration = 5000, onComplete, onProgressUpdate, className }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    let animationId: number

    const updateProgress = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)

      setProgress(newProgress)
      onProgressUpdate?.(newProgress)

      if (newProgress < 100) {
        animationId = requestAnimationFrame(updateProgress)
      } else {
        onComplete?.()
      }
    }

    animationId = requestAnimationFrame(updateProgress)

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [duration, onComplete, onProgressUpdate])

  return (
    <div className={cn('w-full max-w-md', className)}>
      <div className="h-1 bg-muted/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-ink rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

const ZapoutConfirmation: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)
  const [isOrderInProgress, setIsOrderInProgress] = useState(false)
  const hasOrderBeenSent = useRef(false)
  const [_, navigate] = useLocation()

  const { shippingInfo, paymentMethod, cartItems, notes } = useZapoutStore()
  const user = useAccountStore((s) => s.user)
  const pubkey = user?.pubkey

  const { merchantPubkey } = useParams()

  const TOTAL_DURATION = 8000

  const loadingSteps = [
    {
      heading: 'Preparing Your Order...',
      description: 'Gathering all your items and double-checking the details...'
    },
    {
      heading: 'Securing Your Transaction...',
      description: 'Making sure your zaps are ready to fly! ⚡️'
    },
    {
      heading: 'Almost There!',
      description:
        'Just putting the final touches on your order... Magic takes time! ✨'
    }
  ]

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false)
    setIsComplete(true)
  }, [])

  const handleProgressUpdate = useCallback(
    (progress: number) => {
      const stepSize = 100 / loadingSteps.length
      const stepIndex = Math.min(
        Math.floor(progress / stepSize),
        loadingSteps.length - 1
      )
      setCurrentStepIndex((prev) => (prev !== stepIndex ? stepIndex : prev))
    },
    [loadingSteps.length]
  )

  const sendOrder = useCallback(async () => {
    if (isOrderInProgress || hasOrderBeenSent.current) {
      // Order already in progress or sent, skipping
      return
    }

    if (
      !cartItems ||
      !shippingInfo ||
      !paymentMethod ||
      !pubkey ||
      !merchantPubkey
    ) {
      console.error('[ZapoutConfirmation] Missing order data.')
      return
    }

    setIsOrderInProgress(true)
    hasOrderBeenSent.current = true

    try {
      const addressString = JSON.stringify(shippingInfo)

      const orderData = {
        items: cartItems.map((item) => ({
          eventId: item.eventId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        address: addressString,
        message: `Order from Pubkey: ${pubkey}`
      }

      const order = await createOrder(orderData, merchantPubkey)

      if (!order || 'success' in order) {
        console.error('[ZapoutConfirmation] Failed to create order:', order)
        return
      }

      await postOrder(order, merchantPubkey)
    } catch (error) {
      console.error('[ZapoutConfirmation] Order error:', error)
    } finally {
      setIsOrderInProgress(false)
    }
  }, [cartItems, shippingInfo, paymentMethod, pubkey, merchantPubkey])

  useEffect(() => {
    if (isLoading && !hasOrderBeenSent.current) {
      sendOrder()
    }
  }, [isLoading])

  const currentStep = loadingSteps[currentStepIndex]

  const wrapperClasses = cn(
    'fixed inset-0 bg-primary-400 z-50 transition-all duration-300 ',
    isComplete && 'bg-paper'
  )

  return (
    <div className={wrapperClasses}>
      {/* header */}
      <div className="flex items-center justify-between gap-2 px-8 py-4">
        <Logo className="max-w-50 electric-shock" />
        <Button variant="ghost" size="lg">
          <Icon.Home className="size-6" />
          Back to Home
        </Button>
      </div>

      {/* body */}
      <div className="rounded-lg p-8 grid h-full content-start justify-items-center gap-16 pt-24">
        <Logo variant="icon" className={cn('max-w-20 electric-outline')} />

        <h1 className="voice-5l transition-all duration-300 text-center text-balance">
          {currentStep.heading}
        </h1>

        <LoadingBar
          duration={TOTAL_DURATION}
          onComplete={handleLoadingComplete}
          onProgressUpdate={handleProgressUpdate}
          className="electric-shock"
        />

        <p className="voice-base transition-all duration-300 text-center text-balance max-w-md">
          {currentStep.description}
        </p>

        {isComplete && (
          <>
            <p className="voice-2l transition-all duration-300 text-center text-balance max-w-md">
              This merchant doesn't have a coordinator to automatically accept
              transactions.
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/messages')}
              >
                <Icon.Messages />
                Go to Messages
              </Button>
              <Button
                variant="muted"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/shop')}
              >
                <Icon.ShoppingBag />
                Shop
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ZapoutConfirmation
