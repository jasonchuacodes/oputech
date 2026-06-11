import { Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PosService } from '../../features/pos/pos.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { SaleDocument, PaymentMode } from '../../features/pos/schemas/sale.schema'

interface SaleItemInput {
  inventoryItemId: string
  quantity: number
}

interface CreateSaleInput {
  items: SaleItemInput[]
  paymentMode: PaymentMode
}

@UseGuards(JwtAuthGuard)
@Resolver('Sale')
export class PosResolver {
  constructor(private readonly pos: PosService) {}

  @Mutation()
  createSale(@Args('input') input: CreateSaleInput) {
    return this.pos.createSale(input)
  }

  @ResolveField('id')
  id(@Parent() sale: SaleDocument): string {
    return sale._id.toString()
  }

  @ResolveField('createdAt')
  createdAt(@Parent() sale: SaleDocument): string {
    return (sale as any).createdAt.toISOString()
  }
}
