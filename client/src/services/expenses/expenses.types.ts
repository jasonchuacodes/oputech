export interface Expense {
  id: string
  reportId: string
  label: string
  amount: number
  createdAt: string
}

export interface CreateExpenseInput {
  reportId: string
  label: string
  amount: number
}
