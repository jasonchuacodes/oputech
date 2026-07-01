import { z } from 'zod'

export const EditProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be at least 0'),
})

export type EditProductInput = z.infer<typeof EditProductSchema>
