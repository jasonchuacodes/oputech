export type InventoryStatus = 'IN_STOCK' | 'LOW' | 'OUT_OF_STOCK'

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  price: number
  imageUrl?: string
  status: InventoryStatus
}

export interface CreateInventoryItemInput {
  name: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface UpdateInventoryItemInput {
  name?: string
  price?: number
  addQuantity?: number
}
