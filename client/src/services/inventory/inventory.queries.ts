import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProducts, createProduct, updateProduct, deleteProduct } from './inventory.api'
import { CreateProductInput, UpdateProductInput } from './inventory.types'

export function useProducts(search?: string) {
  return useQuery({
    queryKey: ['inventory', search],
    queryFn: () => getProducts(search),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductInput }) =>
      updateProduct(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
