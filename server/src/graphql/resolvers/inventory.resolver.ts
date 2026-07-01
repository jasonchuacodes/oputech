import { Query, Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { InventoryService } from '../../features/inventory/inventory.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { ProductDocument } from '../../features/inventory/schemas/inventory.schema'
import { LOW_STOCK_THRESHOLD } from '../../features/inventory/inventory.constants'

interface CreateProductInput {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

interface UpdateProductInput {
  name?: string
  price?: number
  addQuantity?: number
}

@UseGuards(JwtAuthGuard)
@Resolver('Product')
export class InventoryResolver {
  constructor(private readonly inventory: InventoryService) {}

  @Query()
  products(@Args('search') search?: string) {
    return this.inventory.findAll(search)
  }

  @Mutation()
  createProduct(@Args('input') input: CreateProductInput) {
    return this.inventory.create(input)
  }

  @Mutation()
  updateProduct(@Args('id') id: string, @Args('input') input: UpdateProductInput) {
    return this.inventory.update(id, input)
  }

  @Mutation()
  async deleteProduct(@Args('id') id: string): Promise<boolean> {
    const result = await this.inventory.remove(id)
    return result !== null
  }

  @ResolveField('id')
  id(@Parent() item: ProductDocument): string {
    return item._id.toString()
  }

  @ResolveField('status')
  status(@Parent() item: ProductDocument): string {
    if (item.quantity === 0) return 'OUT_OF_STOCK'
    if (item.quantity <= LOW_STOCK_THRESHOLD) return 'LOW'
    return 'IN_STOCK'
  }
}
