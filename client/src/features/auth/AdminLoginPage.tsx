import { Button, Input, Label } from '../../shared/components';
import { LoginLayout } from './components/LoginLayout';

export default function AdminLoginPage() {
  return (
    <LoginLayout>
      <main className='flex h-full'>
        <div className='hidden md:flex md:w-1/2 lg:w-3/5 flex-col items-center justify-center bg-[#0a1f44]' />

        <div className='flex w-full md:w-1/2 lg:w-2/5 flex-col items-center justify-center bg-gray-50 px-6 py-12 sm:px-12'>
          <div className='w-full max-w-sm'>
            <div className='mb-8'>
              <p className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
                Admin Portal
              </p>
              <h1 className='mt-2 text-2xl font-bold text-gray-900'>Sign in</h1>
              <p className='mt-1 text-sm text-gray-500'>
                Restricted access — authorised users only
              </p>
            </div>

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
      </main>
    </LoginLayout>
  );
}
