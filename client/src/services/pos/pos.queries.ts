import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createSale, CreateSaleInput } from './pos.api'

export const useCreateSale = () => {
  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: () => {
      toast.success('Sale completed successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
