import { useQuery } from '@tanstack/react-query'
import { getMe } from '../api/auth'

export function useMe() {
  const token = localStorage.getItem('token')
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: !!token,
    retry: false,
  })
}
