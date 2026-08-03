import { Query, Mutation, ResolveField, Resolver, Parent, Args } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ExpensesService } from '../../features/expenses/expenses.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { ExpenseDocument } from '../../features/expenses/schemas/expense.schema'

interface CreateExpenseInput {
  reportId: string
  label: string
  amount: number
}

@UseGuards(JwtAuthGuard)
@Resolver('Expense')
export class ExpensesResolver {
  constructor(private readonly expenses: ExpensesService) {}

  @Query('expenses')
  getExpenses(@Args('reportId') reportId: string) {
    return this.expenses.findByReport(reportId)
  }

  @Mutation()
  createExpense(@Args('input') input: CreateExpenseInput) {
    return this.expenses.create(input)
  }

  @Mutation()
  async deleteExpense(@Args('id') id: string): Promise<boolean> {
    const result = await this.expenses.remove(id)
    return result !== null
  }

  @ResolveField('id')
  id(@Parent() item: ExpenseDocument): string {
    return item._id.toString()
  }

  @ResolveField('createdAt')
  createdAt(@Parent() item: ExpenseDocument): string {
    return (item as any).createdAt.toISOString()
  }
}
