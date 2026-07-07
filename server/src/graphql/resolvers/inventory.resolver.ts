import { Query, Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { InventoryService } from '../../features/inventory/inventory.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { ProductDocument, ProductCategory } from '../../features/inventory/schemas/inventory.schema'

interface CreateProductInput {
  name: string
  price: number
  imageUrl?: string
  category: ProductCategory
}

interface UpdateProductInput {
  name?: string
  price?: number
  category?: ProductCategory
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
}
