import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from './analytics.api'
import { AnalyticsRange } from './analytics.types'

export const useAnalytics = (range: AnalyticsRange) =>
  useQuery({
    queryKey: ['analytics', range],
    queryFn: () => getAnalytics(range),
  })
