import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './schemas/inventory.schema'
import { InventoryService } from './inventory.service'
import { InventoryResolver } from '../../graphql/resolvers/inventory.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [InventoryService, InventoryResolver],
})
export class InventoryModule {}
