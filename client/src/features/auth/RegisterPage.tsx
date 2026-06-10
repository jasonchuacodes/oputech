import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Button, Input, Label } from '../../shared/components'
import { LoginLayout } from './components/LoginLayout'
import { register } from '../../shared/api/auth'
import { PublicRoutes } from '../../shared/routes'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate, isPending, error } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate(PublicRoutes.Login)
    },
  })

  return (
    <LoginLayout>
      <main className="flex h-full items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">
              Get started with Oputech
            </p>
          </div>

          <div className="rounded-sm px-8 py-8 shadow-sm">
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                mutate({ username, email, password })
              }}
            >
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">
                  {isAxiosError(error)
                    ? (error.response?.data?.message ?? 'Registration failed')
                    : 'Registration failed'}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="mt-1 w-full"
                disabled={isPending}
              >
                {isPending ? 'Creating account…' : 'Create account'}
              </Button>
              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to={PublicRoutes.Login}
                  className="font-medium text-gray-900 hover:underline"
                >
                  Sign up here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </LoginLayout>
  )
}
