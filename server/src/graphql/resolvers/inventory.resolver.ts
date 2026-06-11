import { Query, Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { InventoryService } from '../../features/inventory/inventory.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { InventoryItemDocument } from '../../features/inventory/schemas/inventory.schema'

interface CreateInventoryItemInput {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

interface UpdateInventoryItemInput {
  name?: string
  price?: number
  addQuantity?: number
}

@UseGuards(JwtAuthGuard)
@Resolver('InventoryItem')
export class InventoryResolver {
  constructor(private readonly inventory: InventoryService) {}

  @Query()
  inventoryItems(@Args('search') search?: string) {
    return this.inventory.findAll(search)
  }

  @Mutation()
  createInventoryItem(@Args('input') input: CreateInventoryItemInput) {
    return this.inventory.create(input)
  }

  @Mutation()
  updateInventoryItem(@Args('id') id: string, @Args('input') input: UpdateInventoryItemInput) {
    return this.inventory.update(id, input)
  }

  @Mutation()
  async deleteInventoryItem(@Args('id') id: string): Promise<boolean> {
    const result = await this.inventory.remove(id)
    return result !== null
  }

  @ResolveField('id')
  id(@Parent() item: InventoryItemDocument): string {
    return item._id.toString()
  }

  @ResolveField('status')
  status(@Parent() item: InventoryItemDocument): string {
    if (item.quantity === 0) return 'OUT_OF_STOCK'
    if (item.quantity <= 10) return 'LOW'
    return 'IN_STOCK'
  }
}
