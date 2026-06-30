import axios from '../../lib/axios'
import { Report, CreateReportInput } from './report.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const REPORT_FIELDS = `
  id
  createdBy { id username }
  fromDate
  toDate
  products {
    productId
    name
    quantitySold
    pricePerUnit
    total
  }
  totalCash
  totalGCash
  totalIncome
  createdAt
`

const GET_REPORTS = `
  query GetReports {
    reports {
      ${REPORT_FIELDS}
    }
  }
`

const CREATE_REPORT = `
  mutation CreateReport($input: CreateReportInput!) {
    createReport(input: $input) {
      ${REPORT_FIELDS}
    }
  }
`

export async function getReports(): Promise<Report[]> {
  const res = await axios.post(GRAPHQL_URL, { query: GET_REPORTS })
  return res.data.data.reports
}

export async function createReport(input: CreateReportInput): Promise<Report> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_REPORT,
    variables: { input },
  })
  return res.data.data.createReport
}
