import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Sale, SaleSchema } from './schemas/sale.schema'
import { InventoryItem, InventoryItemSchema } from '../inventory/schemas/inventory.schema'
import { PosService } from './pos.service'
import { PosResolver } from '../../graphql/resolvers/pos.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sale.name, schema: SaleSchema },
      { name: InventoryItem.name, schema: InventoryItemSchema },
    ]),
  ],
  providers: [PosService, PosResolver],
})
export class PosModule {}
