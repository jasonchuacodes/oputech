import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createTransaction, CreateTransactionInput } from './pos.api'

export const useCreateTransaction = () => {
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onSuccess: () => {
      toast.success('Transaction completed successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
