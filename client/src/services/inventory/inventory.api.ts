import axios from '../../lib/axios'
import { InventoryItem, CreateInventoryItemInput, UpdateInventoryItemInput } from './inventory.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const INVENTORY_ITEM_FIELDS = `
  id
  name
  quantity
  price
  imageUrl
  status
`

const GET_INVENTORY_ITEMS = `
  query GetInventoryItems($search: String) {
    inventoryItems(search: $search) {
      ${INVENTORY_ITEM_FIELDS}
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
      ${INVENTORY_ITEM_FIELDS}
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

const UPDATE_INVENTORY_ITEM = `
  mutation UpdateInventoryItem($id: ID!, $input: UpdateInventoryItemInput!) {
    updateInventoryItem(id: $id, input: $input) {
      ${INVENTORY_ITEM_FIELDS}
    }
  }
`

export async function updateInventoryItem(
  id: string,
  input: UpdateInventoryItemInput,
): Promise<InventoryItem> {
  const res = await axios.post(GRAPHQL_URL, {
    query: UPDATE_INVENTORY_ITEM,
    variables: { id, input },
  })
  return res.data.data.updateInventoryItem
}

const DELETE_INVENTORY_ITEM = `
  mutation DeleteInventoryItem($id: ID!) {
    deleteInventoryItem(id: $id)
  }
`

export async function deleteInventoryItem(id: string): Promise<boolean> {
  const res = await axios.post(GRAPHQL_URL, {
    query: DELETE_INVENTORY_ITEM,
    variables: { id },
  })
  return res.data.data.deleteInventoryItem
}
