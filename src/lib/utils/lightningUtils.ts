import { decode } from 'light-bolt11-decoder'

export interface LightningInvoiceInfo {
  amount: number | null
  description: string | null
  timestamp: number | null
  expiry: number | null
  paymentHash: string | null
  signature: string | null
  isValid: boolean
}

/**
 * Parses a Lightning invoice (BOLT11) and extracts relevant information including expiration
 * @param invoice - The BOLT11 Lightning invoice string
 * @returns Parsed invoice information or null if invalid
 */
export function parseLightningInvoice(
  invoice: string
): LightningInvoiceInfo | null {
  try {
    const decoded = decode(invoice)

    if (!decoded || !decoded.sections) {
      return null
    }

    const info: LightningInvoiceInfo = {
      amount: null,
      description: null,
      timestamp: null,
      expiry: null,
      paymentHash: null,
      signature: null,
      isValid: true
    }

    const amountSection = decoded.sections.find(
      (section) => section.name === 'amount'
    )
    if (amountSection && amountSection.value) {
      info.amount = parseInt(String(amountSection.value), 10)
    }

    const descriptionSection = decoded.sections.find(
      (section) => section.name === 'description'
    )
    if (descriptionSection && descriptionSection.value) {
      info.description = String(descriptionSection.value)
    }

    const timestampSection = decoded.sections.find(
      (section) => section.name === 'timestamp'
    )
    if (timestampSection && timestampSection.value) {
      info.timestamp = parseInt(String(timestampSection.value), 10)
    }

    const expirySection = decoded.sections.find(
      (section) => section.name === 'expiry'
    )
    if (expirySection && expirySection.value) {
      info.expiry = parseInt(String(expirySection.value), 10)
    }

    const paymentHashSection = decoded.sections.find(
      (section) => section.name === 'payment_hash'
    )
    if (paymentHashSection && paymentHashSection.value) {
      info.paymentHash = String(paymentHashSection.value)
    }

    if ('signature' in decoded && decoded.signature) {
      info.signature = String(decoded.signature)
    }

    return info
  } catch (error) {
    console.error('Error parsing Lightning invoice:', error)
    return null
  }
}

/**
 * Gets the expiration timestamp for a Lightning invoice
 * @param invoice - The BOLT11 Lightning invoice string
 * @returns Unix timestamp when the invoice expires, or null if invalid/no expiry
 */
export function getLightningInvoiceExpiry(invoice: string): number | null {
  const info = parseLightningInvoice(invoice)
  if (!info || !info.timestamp || !info.expiry) {
    return null
  }

  return info.timestamp + info.expiry
}

/**
 * Checks if a Lightning invoice has expired
 * @param invoice - The BOLT11 Lightning invoice string
 * @returns true if the invoice has expired, false otherwise
 */
export function isLightningInvoiceExpired(invoice: string): boolean {
  const expiry = getLightningInvoiceExpiry(invoice)
  if (!expiry) {
    return false // If we can't determine expiry, assume it's still valid
  }

  const now = Math.floor(Date.now() / 1000)
  return now > expiry
}

/**
 * Gets the time remaining until a Lightning invoice expires
 * @param invoice - The BOLT11 Lightning invoice string
 * @returns Seconds remaining until expiry, or null if invalid/expired
 */
export function getLightningInvoiceTimeRemaining(
  invoice: string
): number | null {
  const expiry = getLightningInvoiceExpiry(invoice)
  if (!expiry) {
    return null
  }

  const now = Math.floor(Date.now() / 1000)
  const remaining = expiry - now

  return remaining > 0 ? remaining : null
}

/**
 * Formats remaining time in a human-readable format
 * @param seconds - Number of seconds remaining
 * @returns Formatted string like "5m 30s left" or "Expired"
 */
export function formatTimeRemaining(seconds: number | null): string {
  if (seconds === null || seconds <= 0) {
    return 'Expired'
  }

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s left`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s left`
  } else {
    return `${secs}s left`
  }
}
