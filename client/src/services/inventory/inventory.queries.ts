import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInventoryItems, createInventoryItem } from './inventory.api'
import { CreateInventoryItemInput } from './inventory.types'

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
