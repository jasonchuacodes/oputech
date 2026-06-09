import { cn } from '../../../shared/lib/utils';

interface LoginLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function LoginLayout({
  children,
  className,
  ...props
}: LoginLayoutProps) {
  return (
    <div className='flex h-dvh flex-col'>
      <div
        className={cn('flex-1 min-h-0 overflow-auto bg-background', className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
