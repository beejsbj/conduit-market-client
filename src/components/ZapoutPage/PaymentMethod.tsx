import { useCallback, useState } from 'react'
import { useLocation, useParams } from 'wouter'
import Button from '../Buttons/Button'
import Field from '../Form/Field'

import Icon from '../Icon'
import { IconPill } from '../Pill'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { useCartStore } from '@/stores/useCartStore'

import { useZapoutStore } from '@/stores/useZapoutStore'
import { paymentMethods } from '@/lib/constants/paymentMethods'

const PaymentMethod: React.FC = () => {
  const [location, navigate] = useLocation()
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const { carts, getCart } = useCartStore()
  const { merchantPubkey } = useParams()
  const cart = useCallback(
    () => merchantPubkey && getCart(merchantPubkey),
    [merchantPubkey]
  )

  const paymentMethod = useZapoutStore((s) => s.paymentMethod)
  const setPaymentMethod = useZapoutStore((s) => s.setPaymentMethod)
  const [selectedMethod, setSelectedMethod] = useState(
    paymentMethod ?? 'lightning'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // when submitted, ie generate invoice, then the tabs content is shown
    navigate(`?zapoutStep=confirmation`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs
        className="mt-8"
        value={selectedMethod}
        onValueChange={(val) => {
          console.log('Setting payment method: ', val)
          setSelectedMethod(val)
          setPaymentMethod(val)
        }}
      >
        <TabsList>
          {paymentMethods.map((method) => (
            <TabsTrigger
              key={method.value}
              value={method.value}
              isSelectedClassName="bg-ink text-primary border-ink"
              className="flex items-center gap-2 rounded-full p-0 bg-muted"
            >
              <IconPill
                text={method.label}
                leftIcon={method.icon as keyof typeof Icon}
                size="md"
                className="border-none bg-transparent"
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {paymentMethods.map((method) => {
          if (isGenerated) {
            return (
              <TabsContent key={method.value} value={method.value}>
                {method.value === 'lightning' && <LightningPaymentMethod />}
              </TabsContent>
            )
          }
        })}
      </Tabs>

      <Button variant="primary" className="w-full mt-8" rounded={false}>
        Generate Invoice
      </Button>
    </form>
  )
}

const LightningPaymentMethod: React.FC = () => {
  return (
    <div className="grid gap-4 border-muted border-2 rounded-lg p-4 bg-primary-900/50">
      <picture className="max-w-2/3 mx-auto rounded-lg">
        <img
          src="/images/placeholders/square.jpg"
          alt="Lightning"
          className="w-full h-full object-cover"
        />
      </picture>

      <Field
        name="lightningAddress"
        placeholder="npub1q2w3e4r5t64392f3921u... "
      />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-primary flex-1"
          rounded={false}
          size="lg"
        >
          <Icon.Copy className="size-5" />
          <span>Copy</span>
        </Button>

        <Button
          variant="outline"
          className="border-primary flex-1"
          rounded={false}
          size="lg"
        >
          <Icon.Share className="size-5" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod
