import { Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PosService } from '../../features/pos/pos.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { TransactionDocument, PaymentType } from '../../features/pos/schemas/transaction.schema'

interface TransactionItemInput {
  productId: string
  quantity: number
}

interface CreateTransactionInput {
  items: TransactionItemInput[]
  paymentType: PaymentType
}

@UseGuards(JwtAuthGuard)
@Resolver('Transaction')
export class PosResolver {
  constructor(private readonly pos: PosService) {}

  @Mutation()
  createTransaction(@Args('input') input: CreateTransactionInput) {
    return this.pos.createTransaction(input)
  }

  @ResolveField('id')
  id(@Parent() transaction: TransactionDocument): string {
    return transaction._id.toString()
  }

  @ResolveField('createdAt')
  createdAt(@Parent() transaction: TransactionDocument): string {
    return (transaction as any).createdAt.toISOString()
  }
}
