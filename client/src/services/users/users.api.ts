import axios from '../../lib/axios'
import { User, CreateUserInput, UpdateUserInput, UpdateActivityStatusInput } from './users.types'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL

const GET_USERS = `
  query GetUsers {
    users {
      id
      username
      fullName
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
      fullName
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

const UPDATE_USER = `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      username
      fullName
      email
      role
    }
  }
`

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const res = await axios.post(GRAPHQL_URL, {
    query: UPDATE_USER,
    variables: { id, input },
  })
  return res.data.data.updateUser
}

const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`

export async function deleteUser(id: string): Promise<boolean> {
  const res = await axios.post(GRAPHQL_URL, {
    query: DELETE_USER,
    variables: { id },
  })
  return res.data.data.deleteUser
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
