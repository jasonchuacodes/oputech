import axios from '../../lib/axios'
import { InventoryItem, CreateInventoryItemInput } from './inventory.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const GET_INVENTORY_ITEMS = `
  query GetInventoryItems($search: String) {
    inventoryItems(search: $search) {
      id
      name
      quantity
      price
      imageUrl
    }
  }
`

export async function getInventoryItems(search?: string): Promise<InventoryItem[]> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_INVENTORY_ITEMS,
    variables: { search: search || undefined },
  })
  return res.data.data.inventoryItems
}

const CREATE_INVENTORY_ITEM = `
  mutation CreateInventoryItem($input: CreateInventoryItemInput!) {
    createInventoryItem(input: $input) {
      id
      name
      quantity
      price
      imageUrl
    }
  }
`

export async function createInventoryItem(
  input: CreateInventoryItemInput,
): Promise<InventoryItem> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_INVENTORY_ITEM,
    variables: { input },
  })
  return res.data.data.createInventoryItem
}
