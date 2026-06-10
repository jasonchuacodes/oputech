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
    <div className="flex h-dvh flex-col">
      <div
        className={cn('bg-background min-h-0 flex-1 overflow-auto', className)}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
