export interface Product {
  id: string
  name: string
  price: number
  stock: number
  image?: string
  category?: string
}

export interface SaleItem {
  product: Product
  quantity: number
}

export enum PaymentMode {
  Cash = 'CASH',
  GCash = 'GCASH',
}
