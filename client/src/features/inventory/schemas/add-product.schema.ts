import { z } from 'zod'

export const AddProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or more'),
  price: z.number().min(0, 'Price must be at least ₱0.01'),
})

export type AddProductInput = z.infer<typeof AddProductSchema>
