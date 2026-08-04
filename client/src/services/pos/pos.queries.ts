import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getTransactions,
  createTransaction,
  CreateTransactionInput,
  TransactionFilter,
} from './pos.api'

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
    },
  })
}
