import { Button, Input, Label } from '../../shared/components';
import { Footer } from './components/Footer';
import { LoginLayout } from './components/LoginLayout';

export default function LoginPage() {
  return (
    <LoginLayout>
      <main className='flex flex-col items-center justify-center px-4 py-12'>
        <div className='w-full max-w-sm'>
          <div className='mb-8 text-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Sign in</h1>
            <p className='mt-1 text-sm text-gray-500'>
              Welcome back to Oputech
            </p>
          </div>

          <div className='rounded-sm px-8 py-8 shadow-sm'>
            <form className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  type='text'
                  placeholder='Enter your username'
                  autoComplete='username'
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                />
              </div>
              <Button type='submit' size='lg' className='mt-1 w-full'>
                Sign in
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </LoginLayout>
  );
}
