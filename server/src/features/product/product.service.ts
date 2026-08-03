import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Product, ProductDocument } from './schemas/product.schema'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductService {
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
    return this.product
      .findByIdAndUpdate(id, { $set: input }, { returnDocument: 'after' })
      .exec()
  }

  remove(id: string): Promise<ProductDocument | null> {
    return this.product.findByIdAndDelete(id).exec()
  }
}
