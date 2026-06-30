import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Transaction, TransactionDocument, PaymentType } from './schemas/transaction.schema'
import { Product, ProductDocument } from '../inventory/schemas/inventory.schema'

interface TransactionItemInput {
  productId: string
  quantity: number
}

interface CreateTransactionInput {
  items: TransactionItemInput[]
  paymentType: PaymentType
}

@Injectable()
export class PosService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Product.name) private product: Model<ProductDocument>,
  ) {}

  async createTransaction(input: CreateTransactionInput): Promise<TransactionDocument> {
    const ids = input.items.map((i) => i.productId)
    const products = await this.product.find({ _id: { $in: ids } }).exec()

    for (const { productId, quantity } of input.items) {
      const item = products.find((p) => p._id.toString() === productId)
      if (!item) throw new BadRequestException(`Product ${productId} not found`)

      if (quantity > item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.name}": requested ${quantity}, available ${item.quantity}`,
        )
      }
    }

    const transactionItems = input.items.map(({ productId, quantity }) => {
      const item = products.find((p) => p._id.toString() === productId)!
      return { productId, name: item.name, price: item.price, quantity }
    })

    const total = transactionItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    await Promise.all(
      input.items.map(({ productId, quantity }) =>
        this.product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } }),
      ),
    )

    return this.transactionModel.create({
      items: transactionItems,
      paymentType: input.paymentType,
      total,
      processed: false,
    })
  }
}
