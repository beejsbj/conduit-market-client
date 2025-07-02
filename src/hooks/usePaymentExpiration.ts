import { useState, useEffect, useCallback } from 'react'
import type { NostrEvent } from '@nostr-dev-kit/ndk'
import { OrderUtils } from 'nostr-commerce-schema'
import {
  getLightningInvoiceExpiry,
  formatTimeRemaining
} from '@/lib/utils/lightningUtils'

interface UsePaymentExpirationReturn {
  timeRemaining: number | null
  formattedTime: string | null
  isExpired: boolean
  expirationSource: 'nostr' | 'lightning' | 'none'
}

/**
 * Hook to handle payment request expiration countdown
 * Prioritizes Lightning invoice expiration over Nostr event expiration tag
 * @param event - The Nostr event (payment request)
 * @returns Expiration information and countdown
 */
export function usePaymentExpiration(
  event: NostrEvent
): UsePaymentExpirationReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [expirationSource, setExpirationSource] = useState<
    'nostr' | 'lightning' | 'none'
  >('none')

  const paymentMethod = OrderUtils.getPaymentMethod(event)
  const isLightningPayment = paymentMethod?.type === 'lightning'

  const expirationTag = event.tags.find((t) => t[0] === 'expiration')
  const nostrExpiration = expirationTag ? parseInt(expirationTag[1]) : undefined

  const lightningExpiration =
    isLightningPayment && paymentMethod.value
      ? getLightningInvoiceExpiry(paymentMethod.value)
      : null

  // Determine which expiration to use (prioritize Lightning invoice)
  const effectiveExpiration = lightningExpiration || nostrExpiration
  const source = lightningExpiration
    ? 'lightning'
    : nostrExpiration
    ? 'nostr'
    : 'none'

  const updateTimeRemaining = useCallback(() => {
    if (!effectiveExpiration) {
      setTimeRemaining(null)
      setExpirationSource('none')
      return
    }

    const now = Math.floor(Date.now() / 1000)
    const remaining = Math.max(0, effectiveExpiration - now)

    setTimeRemaining(remaining)
    setExpirationSource(source)
  }, [effectiveExpiration, source])

  useEffect(() => {
    updateTimeRemaining()

    const interval = setInterval(updateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [updateTimeRemaining])

  const formattedTime =
    timeRemaining !== null ? formatTimeRemaining(timeRemaining) : null
  const isExpired = timeRemaining !== null && timeRemaining <= 0

  return {
    timeRemaining,
    formattedTime,
    isExpired,
    expirationSource
  }
}

/**
 * Legacy hook for backward compatibility - only uses Nostr expiration tag
 * @param expiration - Unix timestamp when the payment expires
 * @returns Simple countdown string
 */
export function useExpirationCountdown(expiration?: number): string | null {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!expiration) return

    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      setRemaining(Math.max(0, expiration - now))
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiration])

  if (remaining === null) return null
  if (remaining <= 0) return 'Expired'

  const m = Math.floor(remaining / 60)
  const s = remaining % 60
  return `${m > 0 ? m + 'm ' : ''}${s}s left`
}
