import { createContext, useCallback, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { type AuthUser } from '../../services/auth/auth.types'
import { PublicRoutes } from '../../routes'
import { useGetMe, useLogoutMutation } from '../../services/auth/auth.queries'

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
  const { data: auth, isPending, refetch } = useGetMe()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate, isPending: isLoggingOut } = useLogoutMutation()

  const logout = useCallback(() => {
    mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem('auth')
        queryClient.setQueryData(['auth'], null)
        queryClient.cancelQueries()
        navigate(PublicRoutes.Login)
      },
    })
  }, [mutate, queryClient, navigate])

  const hasToken = !!localStorage.getItem('auth')
  const loading = (hasToken && isPending) || isLoggingOut

  return (
    <AuthContext.Provider value={{ auth, loading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
