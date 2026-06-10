import * as React from 'react'

import { cn } from '@/utils/cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 h-8 w-full min-w-0 rounded-sm border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-2 md:text-sm [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:shadow-[0_0_0_1000px_transparent_inset]',
        className
      )}
      {...props}
    />
  )
}

export { Input }
