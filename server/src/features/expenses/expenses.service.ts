import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Expense, ExpenseDocument } from './schemas/expense.schema'
import { CreateExpenseDto } from './dto/create-expense.dto'
import { ReportService } from '../report/report.service'

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name)
    private expense: Model<ExpenseDocument>,
    private readonly report: ReportService,
  ) {}

  findByReport(reportId: string): Promise<ExpenseDocument[]> {
    return this.expense.find({ reportId }).exec()
  }

  async create(input: CreateExpenseDto): Promise<ExpenseDocument> {
    const report = await this.report.findById(input.reportId)
    if (!report) throw new NotFoundException('Report not found')

    const expense = await this.expense.create(input)
    await this.report.adjustDailyExpenses(report.toDate, input.amount)
    return expense
  }

  async remove(id: string): Promise<ExpenseDocument | null> {
    const expense = await this.expense.findById(id).exec()
    if (!expense) return null

    const report = await this.report.findById(expense.reportId)
    await expense.deleteOne()

    if (report) {
      await this.report.adjustDailyExpenses(report.toDate, -expense.amount)
    }

    return expense
  }
}
