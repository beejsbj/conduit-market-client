import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export const LightningQR = ({
  lightningInvoice,
  width = 300
}: {
  lightningInvoice: string
  width?: number
}) => {
  const lightningUri = `lightning:${lightningInvoice}`

  return (
    <div className="relative group flex items-center justify-center mb-2">
      <div className="absolute inset-0 rounded-xl blur-sm" />
      <QRCodeSVG
        value={lightningUri}
        size={Math.max(width, 240)}
        className="w-full h-auto bg-white p-3 rounded-xl shadow-lg"
        level="M"
      />
    </div>
  )
}

export default LightningQR
