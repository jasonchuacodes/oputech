import axios from '../../lib/axios'
import { Expense, CreateExpenseInput } from './expenses.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const EXPENSE_FIELDS = `
  id
  reportId
  label
  amount
  createdAt
`

const GET_EXPENSES = `
  query GetExpenses($reportId: ID!) {
    expenses(reportId: $reportId) {
      ${EXPENSE_FIELDS}
    }
  }
`

export async function getExpenses(reportId: string): Promise<Expense[]> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_EXPENSES,
    variables: { reportId },
  })
  return res.data.data.expenses
}

const CREATE_EXPENSE = `
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      ${EXPENSE_FIELDS}
    }
  }
`

export async function createExpense(input: CreateExpenseInput): Promise<Expense> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_EXPENSE,
    variables: { input },
  })
  return res.data.data.createExpense
}

const DELETE_EXPENSE = `
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`

export async function deleteExpense(id: string): Promise<boolean> {
  const res = await axios.post(GRAPHQL_URL, {
    query: DELETE_EXPENSE,
    variables: { id },
  })
  return res.data.data.deleteExpense
}
