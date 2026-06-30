import axios from '../../lib/axios'
import { PaymentType } from './pos.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

export interface CreateTransactionItemInput {
  productId: string
  quantity: number
}

export interface CreateTransactionInput {
  items: CreateTransactionItemInput[]
  paymentType: PaymentType
}

export interface Transaction {
  id: string
  total: number
  paymentType: PaymentType
  createdAt: string
}

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

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_TRANSACTION,
    variables: { input },
  })
  return res.data.data.createTransaction
}
