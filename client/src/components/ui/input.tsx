import * as React from 'react'

import { cn } from '@/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-border bg-white placeholder:text-slate-400 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/10 aria-invalid:border-danger aria-invalid:ring-danger/20 h-10 w-full min-w-0 rounded-sm border px-3 text-sm transition-colors outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&:-webkit-autofill]:bg-white',
        className
      )}
      {...props}
    />
  )
}

export { Input }
