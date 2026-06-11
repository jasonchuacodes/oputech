import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInventoryItems, createInventoryItem, updateInventoryItem, deleteInventoryItem } from './inventory.api'
import { CreateInventoryItemInput, UpdateInventoryItemInput } from './inventory.types'

export function useInventoryItems(search?: string) {
  return useQuery({
    queryKey: ['inventory', search],
    queryFn: () => getInventoryItems(search),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInventoryItemInput) => createInventoryItem(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateInventoryItemInput }) =>
      updateInventoryItem(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
