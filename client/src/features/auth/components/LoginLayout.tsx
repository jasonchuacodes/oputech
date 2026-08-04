import { cn } from '../../../utils/cn'

interface LoginLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function LoginLayout({
  children,
  className,
  ...props
}: LoginLayoutProps) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <div
        className={cn(
          'bg-background relative min-h-0 flex-1 overflow-auto',
          className
        )}
        {...props}
      >
        <img
          src="/pwa-512x512.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-25 -left-25 w-64 opacity-20 brightness-150 grayscale select-none sm:w-80"
        />
        <img
          src="/pwa-512x512.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-25 -right-25 w-64 -scale-x-100 opacity-20 brightness-150 grayscale select-none sm:w-80"
        />
        {children}
      </div>
    </div>
  )
}
