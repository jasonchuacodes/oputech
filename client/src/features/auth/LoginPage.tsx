import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Button, Input, Label } from '../../shared/components'
import { Footer } from './components/Footer'
import { LoginLayout } from './components/LoginLayout'
import { login } from '../../shared/api/auth'
import { UserRoutes, PublicRoutes } from '../../shared/routes'

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.accessToken)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      navigate(UserRoutes.Home)
    },
  })

  return (
    <LoginLayout>
      <main className="flex h-full flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-sm px-8 py-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back to Oputech
              </p>
            </div>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                mutate({ email, password })
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-normal text-gray-500"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    to={PublicRoutes.ForgotPassword}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-500">
                  {isAxiosError(error)
                    ? (error.response?.data?.message ?? 'Invalid credentials')
                    : 'Invalid credentials'}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full"
                disabled={isPending}
              >
                {isPending ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="mt-6 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to={PublicRoutes.Register}
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </LoginLayout>
  )
}
