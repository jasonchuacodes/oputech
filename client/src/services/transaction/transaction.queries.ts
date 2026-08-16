import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  CreateTransactionInput,
  TransactionFilter,
} from './transaction.api'

export const useTransactions = (filter?: TransactionFilter) =>
  useQuery({
    queryKey: ['transactions', filter],
    queryFn: () => getTransactions(filter),
  })

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Transaction completed successfully!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onError: (error: Error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Transaction deleted successfully!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
