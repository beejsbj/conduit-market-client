import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { useAccountStore } from '@/stores/useAccountStore'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * AuthGuard component that protects routes requiring authentication.
 * Redirects to auth page if user is not logged in, preserving the intended destination.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  redirectTo = '/auth'
}) => {
  const isLoggedIn = useAccountStore((state) => state.isLoggedIn)
  const [location, navigate] = useLocation()

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the current location as a redirect parameter
      const currentPath = location
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(
        currentPath
      )}`
      navigate(redirectUrl, { replace: true })
    }
  }, [isLoggedIn, navigate, redirectTo, location])

  // If not logged in, don't render anything (redirect will happen in useEffect)
  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}

export default AuthGuard
