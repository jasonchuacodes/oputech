import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Transaction, TransactionSchema } from './schemas/transaction.schema'
import { Product, ProductSchema } from '../product/schemas/product.schema'
import { PosService } from './pos.service'
import { PosResolver } from '../../graphql/resolvers/pos.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [PosService, PosResolver],
})
export class PosModule {}
