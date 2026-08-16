import 'dotenv/config'
import mongoose from 'mongoose'
import { ExpenseSchema } from '../src/features/expenses/schemas/expense.schema'
import { ReportSchema } from '../src/features/report/schemas/report.schema'
import {
  TransactionSchema,
  TransactionType,
  PaymentType,
} from '../src/features/transaction/schemas/transaction.schema'

const dryRun = process.argv.includes('--dry-run')

const ExpenseModel = mongoose.model('Expense', ExpenseSchema)
const ReportModel = mongoose.model('Report', ReportSchema)
const TransactionModel = mongoose.model('Transaction', TransactionSchema)

const main = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.error('MONGO_URI env var is required')
    process.exit(1)
  }

  await mongoose.connect(uri)
  console.log(`Connected. Dry run: ${dryRun}`)

  const expenses = await ExpenseModel.find().exec()
  console.log(`Found ${expenses.length} expense(s) to migrate.`)

  let migrated = 0
  let skipped = 0

  for (const expense of expenses) {
    const report = await ReportModel.findById(expense.reportId).exec()
    if (!report) {
      console.warn(`Skipping expense ${expense._id} — report ${expense.reportId} not found`)
      skipped++
      continue
    }

    console.log(
      `${dryRun ? '[DRY RUN] Would create' : 'Creating'} Transaction for expense ${expense._id} ` +
        `(label="${expense.label}", amount=${expense.amount}, report=${report._id}, date=${report.toDate.toISOString()})`
    )

    if (dryRun) {
      migrated++
      continue
    }

    const [transaction] = await TransactionModel.create(
      [
        {
          type: TransactionType.EXPENSE,
          label: expense.label,
          items: [],
          paymentType: PaymentType.CASH,
          total: expense.amount,
          processed: true,
          createdAt: report.toDate,
          updatedAt: report.toDate,
        } as any,
      ],
      { timestamps: false }
    )

    await ReportModel.updateOne(
      { _id: report._id },
      { $push: { transactionIds: transaction._id.toString() } }
    ).exec()

    migrated++
  }

  console.log(`Done. Migrated: ${migrated}, Skipped: ${skipped}, Total: ${expenses.length}`)
  await mongoose.disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
