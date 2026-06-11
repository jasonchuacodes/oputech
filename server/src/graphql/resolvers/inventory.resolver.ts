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

  @ResolveField('id')
  id(@Parent() item: InventoryItemDocument): string {
    return item._id.toString()
  }
}
