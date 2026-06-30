export type ProductStatus = 'IN_STOCK' | 'LOW' | 'OUT_OF_STOCK'

export interface Product {
  id: string
  name: string
  quantity: number
  price: number
  imageUrl?: string
  status: ProductStatus
}

export interface CreateProductInput {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface UpdateProductInput {
  name?: string
  price?: number
  addQuantity?: number
}
