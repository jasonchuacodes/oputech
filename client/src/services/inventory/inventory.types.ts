export interface InventoryItem {
  id: string
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface CreateInventoryItemInput {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}
