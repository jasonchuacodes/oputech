import axios from '../../lib/axios'
import { User, CreateUserInput } from './users.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const GET_USERS = `
  query GetUsers {
    users {
      id
      username
      email
      role
    }
  }
`

export async function getUsers(): Promise<User[]> {
  const res = await axios.post(GRAPHQL_URL, { query: GET_USERS })
  return res.data.data.users
}

const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      email
      role
    }
  }
`
export async function createUser(input: CreateUserInput): Promise<User> {
  const res = await axios.post(GRAPHQL_URL, {
    query: CREATE_USER,
    variables: { input },
  })
  return res.data.data.createUser
}
