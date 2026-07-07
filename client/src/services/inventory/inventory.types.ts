export type ProductCategory = 'main' | 'add-on'

export interface Product {
  id: string
  name: string
  price: number
  imageUrl?: string
  category: ProductCategory
}

export interface CreateProductInput {
  name: string
  price: number
  imageUrl?: string
  category: ProductCategory
}

export interface UpdateProductInput {
  name?: string
  price?: number
  category?: ProductCategory
}
