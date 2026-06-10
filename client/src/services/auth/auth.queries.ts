import { useMutation, useQuery } from '@tanstack/react-query'
import { AuthUser } from './auth.types'
import { getMe, login, logout, register } from './auth.api'

const useGetMe = () => {
  return useQuery<AuthUser | null>({
    queryFn: getMe,
    queryKey: ['auth'],
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: false,
  })
}

const useRegisterMutation = () =>
  useMutation({
    mutationFn: register,
  })

const useLoginMutation = () =>
  useMutation({
    mutationFn: login,
  })

const useLogoutMutation = () =>
  useMutation({
    mutationFn: logout,
  })

export { useGetMe, useRegisterMutation, useLoginMutation, useLogoutMutation }
