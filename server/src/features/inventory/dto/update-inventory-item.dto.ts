import { ProductCategory } from '../schemas/inventory.schema'

export class UpdateProductDto {
  name?: string
  price?: number
  category?: ProductCategory
}
