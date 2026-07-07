import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Expense, ExpenseSchema } from './schemas/expense.schema'
import { ExpensesService } from './expenses.service'
import { ExpensesResolver } from '../../graphql/resolvers/expenses.resolver'
import { ReportModule } from '../report/report.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    ReportModule,
  ],
  providers: [ExpensesService, ExpensesResolver],
})
export class ExpensesModule {}
