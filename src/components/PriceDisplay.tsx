import React from 'react'
import { cn } from '@/lib/utils'
import Icon from './Icon'

export interface PriceDisplayProps {
  price: number
  currency?: string
  convertToSats?: (currency: string, value: number) => number
  showIcon?: boolean
  iconClassName?: string
  className?: string
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency = 'SAT',
  convertToSats,
  showIcon = true,
  iconClassName = 'w-4 h-4',
  className
}) => {
  // Handle satoshi/sats currency
  if (currency === 'SAT' || currency === 'SATS') {
    if (showIcon) {
      return (
        <span className={cn('flex items-center gap-1', className)}>
          <Icon.Satoshi className={iconClassName} />
          <span>{new Intl.NumberFormat('en-US').format(price)}</span>
        </span>
      )
    }
    return (
      <span className={className}>
        S {new Intl.NumberFormat('en-US').format(price)}
      </span>
    )
  }

  // Handle USD conversion to sats
  if (convertToSats && currency.toUpperCase() === 'USD') {
    const sats = convertToSats(currency, price)
    if (showIcon) {
      return (
        <span className={cn('flex items-center gap-1', className)}>
          <Icon.Satoshi className={iconClassName} />
          <span>{new Intl.NumberFormat('en-US').format(sats)}</span>
        </span>
      )
    }
    return (
      <span className={className}>
        S {new Intl.NumberFormat('en-US').format(sats)}
      </span>
    )
  }

  // Handle other currencies
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(price)}
    </span>
  )
}

export default PriceDisplay 