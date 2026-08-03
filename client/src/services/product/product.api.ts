import axios from '../../lib/axios'
import { Product, CreateProductInput, UpdateProductInput } from './product.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const PRODUCT_FIELDS = `
  id
  name
  price
  imageUrl
  printCount
  category
`

const GET_PRODUCTS = `
  query GetProducts($search: String) {
    products(search: $search) {
      ${PRODUCT_FIELDS}
    }
  }
`

export async function getProducts(search?: string): Promise<Product[]> {
  const res = await axios.post(GRAPHQL_URL, {
    query: GET_PRODUCTS,
    variables: { search: search || undefined },
  })
  return res.data.data.products
}

const CREATE_PRODUCT = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ${PRODUCT_FIELDS}
    }
  }
`

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_PRODUCT,
    variables: { input },
  })
  return res.data.data.createProduct
}

const UPDATE_PRODUCT = `
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      ${PRODUCT_FIELDS}
    }
  }
`

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const res = await axios.post(GRAPHQL_URL, {
    query: UPDATE_PRODUCT,
    variables: { id, input },
  })
  return res.data.data.updateProduct
}

const DELETE_PRODUCT = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export async function deleteProduct(id: string): Promise<boolean> {
  const res = await axios.post(GRAPHQL_URL, {
    query: DELETE_PRODUCT,
    variables: { id },
  })
  return res.data.data.deleteProduct
}
