import axios from '../../lib/axios'
import { Transaction, PaymentType } from './transaction.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

export interface CreateTransactionItemInput {
  productId: string
  quantity: number
}

export interface CreateTransactionInput {
  items: CreateTransactionItemInput[]
  paymentType: PaymentType
}

export interface TransactionFilter {
  from?: string
  to?: string
  processed?: boolean
}

const GET_TRANSACTIONS = `
  query GetTransactions($filter: TransactionFilter) {
    transactions(filter: $filter) {
      id
      items { productId name price printCount quantity }
      paymentType
      total
      processed
      createdAt
    }
  }
`

const CREATE_TRANSACTION = `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      total
      paymentType
      createdAt
    }
  }
`

const DELETE_TRANSACTION = `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

export async function getTransactions(filter?: TransactionFilter): Promise<Transaction[]> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_TRANSACTIONS,
    variables: { filter },
  })
  return res.data.data.transactions
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_TRANSACTION,
    variables: { input },
  })
  return res.data.data.createTransaction
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const res = await axios.post(GRAPHQL_URL, {
    query: DELETE_TRANSACTION,
    variables: { id },
  })
  return res.data.data.deleteTransaction
}
