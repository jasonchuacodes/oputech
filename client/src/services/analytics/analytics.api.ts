import axios from '../../lib/axios'
import { Analytics, AnalyticsRange } from './analytics.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const GET_ANALYTICS = `
  query GetAnalytics($range: AnalyticsRange!) {
    analytics(range: $range) {
      series {
        date
        totalSales
        totalExpenses
      }
      topProducts {
        productId
        name
        quantitySold
      }
      lowStock {
        id
        name
        quantity
      }
      totalSales
      totalExpenses
    }
  }
`

export async function getAnalytics(range: AnalyticsRange): Promise<Analytics> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_ANALYTICS,
    variables: { range },
  })
  return res.data.data.analytics
}
