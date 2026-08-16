export interface TransactionItem {
  productId: string
  name: string
  price: number
  printCount: number
  quantity: number
}

export interface Transaction {
  id: string
  type: TransactionType
  items: TransactionItem[]
  label?: string
  paymentType: PaymentType
  total: number
  processed: boolean
  createdAt: string
}

export enum PaymentType {
  Cash = 'CASH',
  Online = 'ONLINE',
}

export enum TransactionType {
  Sale = 'SALE',
  Expense = 'EXPENSE',
}
