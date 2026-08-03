import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './schemas/product.schema'
import { ProductService } from './product.service'
import { ProductResolver } from '../../graphql/resolvers/product.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
