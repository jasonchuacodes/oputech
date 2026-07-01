export interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
}

export interface CreateProductInput {
  name: string
  price: number
  imageUrl?: string
}

export interface UpdateProductInput {
  name?: string
  price?: number
}
