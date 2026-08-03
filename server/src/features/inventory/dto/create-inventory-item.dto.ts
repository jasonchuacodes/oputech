import { ProductCategory } from '../schemas/inventory.schema'

export class CreateProductDto {
  name: string
  price: number
  imageUrl?: string
  printCount?: number
  category: ProductCategory
}
