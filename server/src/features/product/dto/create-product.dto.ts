import { ProductCategory } from '../schemas/product.schema'

export class CreateProductDto {
  name: string
  price: number
  imageUrl?: string
  printCount?: number
  category: ProductCategory
}
