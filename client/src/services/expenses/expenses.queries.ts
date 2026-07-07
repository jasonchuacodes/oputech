import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getExpenses, createExpense, deleteExpense } from './expenses.api'
import { CreateExpenseInput } from './expenses.types'

export const useExpenses = (reportId?: string) =>
  useQuery({
    queryKey: ['expenses', reportId],
    queryFn: () => getExpenses(reportId!),
    enabled: !!reportId,
  })

const invalidateExpenseRelated = (
  queryClient: ReturnType<typeof useQueryClient>,
  reportId: string
) => {
  queryClient.invalidateQueries({ queryKey: ['expenses', reportId] })
  queryClient.invalidateQueries({ queryKey: ['reports'] })
  queryClient.invalidateQueries({ queryKey: ['report', reportId] })
  queryClient.invalidateQueries({ queryKey: ['analytics'] })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(input),
    onSuccess: (_data, variables) => {
      toast.success('Expense added')
      invalidateExpenseRelated(queryClient, variables.reportId)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: string; reportId: string }) => deleteExpense(id),
    onSuccess: (_data, variables) => {
      toast.success('Expense deleted')
      invalidateExpenseRelated(queryClient, variables.reportId)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
