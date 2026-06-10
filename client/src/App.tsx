import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ApolloProvider } from '@apollo/client/react'
import { AuthProvider } from './context/auth/AuthContext'
import { apolloClient } from './lib/apollo'

const queryClient = new QueryClient()

export const AppLayout = () => {
  return <Outlet />
}

export const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppLayout />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
