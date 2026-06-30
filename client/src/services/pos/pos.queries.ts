import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getTransactions, createTransaction, CreateTransactionInput } from './pos.api'
import { Product } from '../inventory/inventory.types'

export const useTransactions = (date: string) =>
  useQuery({
    queryKey: ['transactions', date],
    queryFn: () => getTransactions(date),
  })

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) => createTransaction(input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] })

      const previousData = queryClient.getQueriesData<Product[]>({ queryKey: ['inventory'] })

      queryClient.setQueriesData<Product[]>({ queryKey: ['inventory'] }, (old) => {
        if (!old) return old
        return old.map((product) => {
          const sold = input.items.find((i) => i.productId === product.id)
          if (!sold) return product
          return { ...product, quantity: Math.max(0, product.quantity - sold.quantity) }
        })
      })

      return { previousData }
    },
    onError: (error: Error, _input, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Transaction completed successfully!')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
