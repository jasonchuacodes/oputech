import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../api/health'

export const useHealthQuery = () =>
  useQuery({
    queryKey: ['health'],
    queryFn: getHealth,
  })
