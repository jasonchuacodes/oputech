import axios from '../../lib/axios'
import { PaymentMode } from './pos.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

export interface CreateSaleItemInput {
  inventoryItemId: string
  quantity: number
}

export interface CreateSaleInput {
  items: CreateSaleItemInput[]
  paymentMode: PaymentMode
}

export interface Sale {
  id: string
  total: number
  paymentMode: PaymentMode
  createdAt: string
}

const CREATE_SALE = `
  mutation CreateSale($input: CreateSaleInput!) {
    createSale(input: $input) {
      id
      total
      paymentMode
      createdAt
    }
  }
`

export async function createSale(input: CreateSaleInput): Promise<Sale> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_SALE,
    variables: { input },
  })
  return res.data.data.createSale
}
