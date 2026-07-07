import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Report, ReportDocument } from './schemas/report.schema'
import { Aggregate, AggregateDocument } from './schemas/aggregate.schema'
import { Transaction, TransactionDocument, PaymentType } from '../pos/schemas/transaction.schema'
import { Expense, ExpenseDocument } from '../expenses/schemas/expense.schema'
import { CreateReportDto } from './dto/create-report.dto'

export enum AnalyticsRange {
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_15_DAYS = 'LAST_15_DAYS',
  LAST_MONTH = 'LAST_MONTH',
  LAST_6_MONTHS = 'LAST_6_MONTHS',
}

const RANGE_DAYS: Record<AnalyticsRange, number> = {
  [AnalyticsRange.LAST_7_DAYS]: 7,
  [AnalyticsRange.LAST_15_DAYS]: 15,
  [AnalyticsRange.LAST_MONTH]: 30,
  [AnalyticsRange.LAST_6_MONTHS]: 180,
}

export interface AnalyticsPoint {
  date: string
  totalSales: number
  totalExpenses: number
}

export interface TopProduct {
  productId: string
  name: string
  quantitySold: number
}

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(Aggregate.name) private aggregateModel: Model<AggregateDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
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

    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
    await this.aggregate(this.startOfDay(to), totalSales, 0)

    return this.reportModel.create({
      createdBy: userId,
      fromDate: from,
      toDate: to,
      transactionIds: ids,
      products,
    })
  }

  async delete(reportId: string): Promise<boolean> {
    const report = await this.reportModel.findById(reportId).exec()
    if (!report) throw new NotFoundException('Report not found')

    const transactions = await this.transactionModel
      .find({ _id: { $in: report.transactionIds } })
      .exec()
    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0)
    const totalExpenses = await this.getTotalExpenses(reportId)

    await this.deaggregate(this.startOfDay(report.toDate), totalSales, totalExpenses)
    await this.transactionModel
      .updateMany({ _id: { $in: report.transactionIds } }, { processed: false })
      .exec()
    await this.expenseModel.deleteMany({ reportId }).exec()
    await report.deleteOne()

    return true
  }

  async getTotalByPaymentType(transactionIds: string[], paymentType: PaymentType): Promise<number> {
    const transactions = await this.transactionModel
      .find({ _id: { $in: transactionIds }, paymentType })
      .exec()
    return transactions.reduce((sum, t) => sum + t.total, 0)
  }

  async getTotalExpenses(reportId: string): Promise<number> {
    const expenses = await this.expenseModel.find({ reportId }).exec()
    return expenses.reduce((sum, e) => sum + e.amount, 0)
  }

  async adjustDailyExpenses(date: Date, delta: number): Promise<void> {
    await this.aggregate(this.startOfDay(date), 0, delta)
  }

  findAll(): Promise<ReportDocument[]> {
    return this.reportModel.find().sort({ createdAt: -1 }).exec()
  }

  findById(id: string): Promise<ReportDocument | null> {
    return this.reportModel.findById(id).exec()
  }

  async getAnalytics(range: AnalyticsRange) {
    const start = this.startOfDay(new Date())
    start.setDate(start.getDate() - (RANGE_DAYS[range] - 1))

    const aggregates = await this.aggregateModel
      .find({ date: { $gte: start } })
      .sort({ date: 1 })
      .exec()

    let series: AnalyticsPoint[] = aggregates.map((a) => ({
      date: a.date.toISOString(),
      totalSales: a.totalSales,
      totalExpenses: a.totalExpenses,
    }))

    if (range === AnalyticsRange.LAST_6_MONTHS) {
      series = this.bucketWeekly(aggregates)
    }

    const topProducts = await this.getTopProducts(start)

    return {
      series,
      topProducts,
      totalSales: series.reduce((sum, p) => sum + p.totalSales, 0),
      totalExpenses: series.reduce((sum, p) => sum + p.totalExpenses, 0),
    }
  }

  private async getTopProducts(start: Date): Promise<TopProduct[]> {
    const rows = await this.reportModel.aggregate([
      { $match: { toDate: { $gte: start } } },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          name: { $first: '$products.name' },
          quantitySold: { $sum: '$products.quantitySold' },
        },
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 10 },
    ])
    return rows.map((r) => ({ productId: r._id, name: r.name, quantitySold: r.quantitySold }))
  }

  private bucketWeekly(aggregates: AggregateDocument[]): AnalyticsPoint[] {
    const buckets = new Map<string, AnalyticsPoint>()
    for (const a of aggregates) {
      const weekStart = this.startOfWeek(a.date)
      const key = weekStart.toISOString()
      const existing = buckets.get(key)
      if (existing) {
        existing.totalSales += a.totalSales
        existing.totalExpenses += a.totalExpenses
      } else {
        buckets.set(key, {
          date: key,
          totalSales: a.totalSales,
          totalExpenses: a.totalExpenses,
        })
      }
    }
    return Array.from(buckets.values())
  }

  private async aggregate(date: Date, sales: number, expenses: number): Promise<void> {
    await this.aggregateModel
      .updateOne(
        { date },
        { $inc: { totalSales: sales, totalExpenses: expenses }, $setOnInsert: { date } },
        { upsert: true },
      )
      .exec()
  }

  private async deaggregate(date: Date, sales: number, expenses: number): Promise<void> {
    await this.aggregate(date, -sales, -expenses)
  }

  // Truncate to local midnight. Assumes the deployment runs in a single locale;
  // sales are attributed to the report's toDate day.
  private startOfDay(d: Date): Date {
    const day = new Date(d)
    day.setHours(0, 0, 0, 0)
    return day
  }

  // Monday-anchored start of the week containing d (local time).
  private startOfWeek(d: Date): Date {
    const day = this.startOfDay(d)
    const offset = (day.getDay() + 6) % 7
    day.setDate(day.getDate() - offset)
    return day
  }
}
