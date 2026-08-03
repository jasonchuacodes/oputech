import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Transaction, TransactionDocument, PaymentType } from './schemas/transaction.schema'
import { Product, ProductDocument } from '../inventory/schemas/inventory.schema'
import { getDayBoundsUTC } from '../../common/utils/date'

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

  async getTransactionsByDate(date: string): Promise<TransactionDocument[]> {
    const { from, to } = getDayBoundsUTC(date)
    return this.transactionModel
      .find({ processed: { $ne: true }, createdAt: { $gte: from, $lte: to } })
      .sort({ createdAt: 1 })
      .exec()
  }

  async createTransaction(input: CreateTransactionInput): Promise<TransactionDocument> {
    const ids = input.items.map((i) => i.productId)
    const products = await this.product.find({ _id: { $in: ids } }).exec()

    for (const { productId } of input.items) {
      const item = products.find((p) => p._id.toString() === productId)
      if (!item) throw new BadRequestException(`Product ${productId} not found`)
    }

    const transactionItems = input.items.map(({ productId, quantity }) => {
      const item = products.find((p) => p._id.toString() === productId)!
      return { productId, name: item.name, price: item.price, quantity }
    })

    const total = transactionItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return this.transactionModel.create({
      items: transactionItems,
      paymentType: input.paymentType,
      total,
      processed: false,
    })
  }
}
