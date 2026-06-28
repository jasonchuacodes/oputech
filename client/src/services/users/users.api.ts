import axios from '../../lib/axios'
import { User, CreateUserInput, UpdateActivityStatusInput } from './users.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const GET_USERS = `
  query GetUsers {
    users {
      id
      username
      email
      role
      activityStatus {
        status
        message
      }
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

const UPDATE_ACTIVITY_STATUS = `
  mutation UpdateActivityStatus($id: ID!, $input: ActivityStatusInput!) {
    updateActivityStatus(id: $id, input: $input) {
      id
      activityStatus {
        status
        message
      }
    }
  }
`

export async function updateActivityStatus(id: string, input: UpdateActivityStatusInput): Promise<User> {
  const res = await axios.post(GRAPHQL_URL, {
    query: UPDATE_ACTIVITY_STATUS,
    variables: { id, input },
  })
  return res.data.data.updateActivityStatus
}
