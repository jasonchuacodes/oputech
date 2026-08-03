import { ProductCategory } from '../schemas/product.schema'

export class UpdateProductDto {
  name?: string
  price?: number
  imageUrl?: string
  printCount?: number
  category?: ProductCategory
}
