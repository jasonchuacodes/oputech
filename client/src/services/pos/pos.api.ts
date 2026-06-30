import axios from '../../lib/axios'
import { Transaction, PaymentType } from './pos.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

export interface CreateTransactionItemInput {
  productId: string
  quantity: number
}

export interface CreateTransactionInput {
  items: CreateTransactionItemInput[]
  paymentType: PaymentType
}

const GET_TRANSACTIONS = `
  query GetTransactions($date: String!) {
    transactions(date: $date) {
      id
      items { productId name price quantity }
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

export async function getTransactions(date: string): Promise<Transaction[]> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_TRANSACTIONS,
    variables: { date },
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
