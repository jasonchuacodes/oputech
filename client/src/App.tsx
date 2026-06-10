import { Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './context/auth/AuthContext'

const queryClient = new QueryClient()

export const AppLayout = () => {
  return <Outlet />
}

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  )
}
