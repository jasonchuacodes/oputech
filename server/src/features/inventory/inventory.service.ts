import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from './schemas/inventory.schema'
import { CreateProductDto } from './dto/create-inventory-item.dto'
import { UpdateProductDto } from './dto/update-inventory-item.dto'

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name)
    private product: Model<ProductDocument>,
  ) {}

  findAll(search?: string): Promise<ProductDocument[]> {
    if (search) {
      return this.product
        .find({ name: { $regex: search, $options: 'i' } })
        .exec()
    }
    return this.product.find().exec()
  }

  create(input: CreateProductDto): Promise<ProductDocument> {
    return this.product.create(input)
  }

  update(id: string, input: UpdateProductDto): Promise<ProductDocument | null> {
    const { addQuantity, ...fields } = input
    const update: Record<string, unknown> = {}
    if (Object.keys(fields).length) update.$set = fields
    if (addQuantity) update.$inc = { quantity: addQuantity }
    return this.product.findByIdAndUpdate(id, update, { returnDocument: 'after' }).exec()
  }

  remove(id: string): Promise<ProductDocument | null> {
    return this.product.findByIdAndDelete(id).exec()
  }
}
