import { Product } from '../inventory/inventory.types'

export interface TransactionItem {
  product: Product
  quantity: number
}

export enum PaymentType {
  Cash = 'CASH',
  GCash = 'GCASH',
}
