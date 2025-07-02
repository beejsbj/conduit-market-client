import React, { useState } from 'react'
import { Copy } from 'lucide-react'

export const LightningInvoiceCopyArea = ({
  lightningInvoice
}: {
  lightningInvoice: string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lightningInvoice)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="relative w-full">
      <div className="font-mono text-base break-all text-primary-100 p-4 bg-primary-900 rounded-xl shadow-inner">
        {lightningInvoice}
        <button
          onClick={handleCopy}
          className="absolute right-3 p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
          aria-label="Copy invoice"
        >
          <Copy
            className={`w-5 h-5 ${
              copied ? 'text-green-400' : 'text-primary-400'
            }`}
          />
        </button>
      </div>
    </div>
  )
}

export default LightningInvoiceCopyArea
