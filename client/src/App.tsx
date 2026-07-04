import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ApolloProvider } from '@apollo/client/react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/auth/AuthContext'
import { apolloClient } from './lib/apollo'
import { PWAReloadPrompt } from './components/PWAReloadPrompt'

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
          <PWAReloadPrompt />
          <Toaster position="top-right" />
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthProvider>
      </QueryClientProvider>
    </ApolloProvider>
  )
}
