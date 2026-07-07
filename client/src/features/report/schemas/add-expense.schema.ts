import { z } from 'zod'

export const AddExpenseSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
})

export type AddExpenseInput = z.infer<typeof AddExpenseSchema>
