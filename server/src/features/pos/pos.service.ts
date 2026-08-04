import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { QueryFilter, Model } from 'mongoose'
import { Transaction, TransactionDocument, PaymentType } from './schemas/transaction.schema'
import { Product, ProductDocument } from '../product/schemas/product.schema'
import { TransactionFilter } from './pos.types'

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

  async getTransactions(filter?: TransactionFilter): Promise<TransactionDocument[]> {
    const query: QueryFilter<TransactionDocument> = {}

    if (filter?.from || filter?.to) {
      query.createdAt = {
        ...(filter.from && { $gte: new Date(filter.from) }),
        ...(filter.to && { $lte: new Date(filter.to) }),
      }
    }

    if (filter?.processed !== undefined) query.processed = filter.processed

    return this.transactionModel.find(query).sort({ createdAt: 1 }).exec()
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
      return {
        productId,
        name: item.name,
        price: item.price,
        printCount: item.printCount ?? 0,
        quantity,
      }
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
