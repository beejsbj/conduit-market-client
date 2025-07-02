import Button from '@/components/Buttons/Button.tsx'
import Icon from './Icon'
import { useAccountStore } from '@/stores/useAccountStore'
import { useLocation, useSearch } from 'wouter'

export const SignerLoginButton = () => {
  const { login, isLoggedIn, user } = useAccountStore()
  const [, navigate] = useLocation()
  const searchParams = useSearch()

  return (
    <Button
      variant="outline"
      size="lg"
      className="border-primary"
      rounded={false}
      onClick={async (e) => {
        e?.preventDefault()
        if (isLoggedIn) {
          console.log('Already logged in: ', user)
          return
        }

        try {
          await login()

          // Check for redirect parameter and navigate back
          const params = new URLSearchParams(searchParams)
          const redirectPath = params.get('redirect')

          if (redirectPath) {
            navigate(redirectPath, { replace: true })
          } else {
            // Default redirect to home if no specific redirect
            navigate('/', { replace: true })
          }
        } catch (error) {
          console.error('Login failed:', error)
        }
      }}
    >
      <Icon.Lock />
      Nostr Signer
    </Button>
  )
}
