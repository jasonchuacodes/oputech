import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryItem, InventoryItemSchema } from './schemas/inventory.schema'
import { InventoryService } from './inventory.service'
import { InventoryResolver } from '../../graphql/resolvers/inventory.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InventoryItem.name, schema: InventoryItemSchema },
    ]),
  ],
  providers: [InventoryService, InventoryResolver],
})
export class InventoryModule {}
