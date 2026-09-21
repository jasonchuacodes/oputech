import { requestGraphQL } from '../../lib/graphql'
import { Transaction, PaymentType, TransactionType } from './transaction.types'

export interface CreateTransactionItemInput {
  productId: string
  quantity: number
}

export interface CreateTransactionInput {
  type?: TransactionType
  items?: CreateTransactionItemInput[]
  label?: string
  amount?: number
  paymentType: PaymentType
  clientMutationId?: string
  occurredAt?: string
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
      clientMutationId
      type
      items { productId name price printCount quantity }
      label
      paymentType
      total
      processed
      occurredAt
      createdAt
    }
  }
`

const CREATE_TRANSACTION = `
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      clientMutationId
      type
      total
      label
      paymentType
      processed
      occurredAt
      createdAt
    }
  }
`

const DELETE_TRANSACTION = `
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`

export async function getTransactions(
  filter?: TransactionFilter
): Promise<Transaction[]> {
  const data = await requestGraphQL<{ transactions: Transaction[] }>(
    GET_TRANSACTIONS,
    { filter }
  )
  return data.transactions
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<Transaction> {
  const data = await requestGraphQL<{ createTransaction: Transaction }>(
    CREATE_TRANSACTION,
    { input }
  )
  return data.createTransaction
}

export async function deleteTransaction(id: string): Promise<boolean> {
  const data = await requestGraphQL<{ deleteTransaction: boolean }>(
    DELETE_TRANSACTION,
    { id }
  )
  return data.deleteTransaction
}
