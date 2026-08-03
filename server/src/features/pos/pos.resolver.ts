import { Query, Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PosService } from './pos.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TransactionDocument, PaymentType } from './schemas/transaction.schema'

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

  @Query()
  transactions(@Args('date') date: string) {
    return this.pos.getTransactionsByDate(date)
  }

  @Mutation()
  createTransaction(@Args('input') input: CreateTransactionInput) {
    return this.pos.createTransaction(input)
  }

  @ResolveField('createdAt')
  createdAt(@Parent() transaction: TransactionDocument): string {
    return (transaction as any).createdAt.toISOString()
  }
}
