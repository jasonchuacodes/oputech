export interface TransactionItem {
  productId: string
  name: string
  price: number
  printCount: number
  quantity: number
}

export interface Transaction {
  id: string
  items: TransactionItem[]
  paymentType: PaymentType
  total: number
  processed: boolean
  createdAt: string
}

export enum PaymentType {
  Cash = 'CASH',
  Online = 'ONLINE',
}
