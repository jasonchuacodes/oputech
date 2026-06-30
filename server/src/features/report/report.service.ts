import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Report, ReportDocument } from './schemas/report.schema'
import { Transaction, TransactionDocument, PaymentType } from '../pos/schemas/transaction.schema'
import { CreateReportDto } from './dto/create-report.dto'

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(input: CreateReportDto, userId: string): Promise<ReportDocument> {
    const from = new Date(input.fromDate)
    const to = new Date(input.toDate)

    const transactions = await this.transactionModel
      .find({ processed: { $ne: true }, createdAt: { $gte: from, $lte: to } })
      .exec()

    const ids = transactions.map((t) => t._id.toString())

    const productMap = new Map<string, { name: string; pricePerUnit: number; quantitySold: number }>()
    for (const tx of transactions) {
      for (const item of tx.items) {
        const existing = productMap.get(item.productId)
        if (existing) {
          existing.quantitySold += item.quantity
        } else {
          productMap.set(item.productId, {
            name: item.name,
            pricePerUnit: item.price,
            quantitySold: item.quantity,
          })
        }
      }
    }

    const products = Array.from(productMap.entries()).map(([productId, v]) => ({
      productId,
      ...v,
    }))

    await this.transactionModel.updateMany({ _id: { $in: ids } }, { processed: true }).exec()

    return this.reportModel.create({
      createdBy: userId,
      fromDate: from,
      toDate: to,
      transactionIds: ids,
      products,
    })
  }

  async getTotalByPaymentType(transactionIds: string[], paymentType: PaymentType): Promise<number> {
    const transactions = await this.transactionModel
      .find({ _id: { $in: transactionIds }, paymentType })
      .exec()
    return transactions.reduce((sum, t) => sum + t.total, 0)
  }

  findAll(): Promise<ReportDocument[]> {
    return this.reportModel.find().sort({ createdAt: -1 }).exec()
  }
}
