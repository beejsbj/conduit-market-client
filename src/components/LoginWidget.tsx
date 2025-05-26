import { useLogin } from 'nostr-hooks'
import Button from '@/components/Buttons/Button.tsx'

export const LoginWidget = () => {
  const { loginWithExtension } = useLogin()

  return (
    <div>
      <Button onClick={loginWithExtension}>Login with Nostr Extension</Button>
    </div>
  )
}
