import { Button, Input, Label } from '../../shared/components';
import { LoginLayout } from './components/LoginLayout';

export default function RegisterPage() {
  return (
    <LoginLayout>
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-1 text-sm text-gray-500">Get started with Oputech</p>
          </div>

          <div className="rounded-sm px-8 py-8 shadow-sm">
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" size="lg" className="mt-1 w-full">
                Create account
              </Button>
            </form>
          </div>
        </div>
      </main>
    </LoginLayout>
  );
}
