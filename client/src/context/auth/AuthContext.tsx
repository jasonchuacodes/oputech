import { createContext, useCallback, useEffect, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { type AuthUser } from '../../services/auth/auth.types'
import { PublicRoutes } from '../../routes/paths'
import { useGetMe, useLogoutMutation } from '../../services/auth/auth.queries'
import { refresh } from '../../services/auth/auth.api'

// Keep comfortably under the access-token TTL (currently 15m) so the
// access_token cookie is renewed before it ever expires under normal use.
const SESSION_POLL_INTERVAL_MS = 5 * 60 * 1000

type AuthContextType = {
  auth?: AuthUser | null
  loading: boolean
  refetch: () => void
  logout: () => void
}

const initialState: AuthContextType = {
  auth: null,
  loading: true,
  refetch: () => null,
  logout: () => null,
}

const AuthContext = createContext<AuthContextType>(initialState)

function AuthProvider({ children }: { children?: ReactNode }) {
  const { data: auth, isLoading, isFetching, refetch } = useGetMe()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending: isLoggingOut } = useLogoutMutation()

  const endSession = useCallback(() => {
    queryClient.setQueryData(['auth'], null)
    queryClient.cancelQueries()

    navigate(PublicRoutes.Login)
  }, [queryClient, navigate])

  const logout = useCallback(() => {
    mutate(undefined, { onSuccess: endSession })
  }, [mutate, endSession])

  useEffect(() => {
    if (!auth) return

    const interval = setInterval(() => {
      refresh().catch(endSession)
    }, SESSION_POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [auth, endSession])

  const loading = isLoading || isFetching || isLoggingOut

  return (
    <AuthContext.Provider value={{ auth, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
