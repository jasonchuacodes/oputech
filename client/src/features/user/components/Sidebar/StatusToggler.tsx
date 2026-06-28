import { useState } from 'react'
import { Coffee } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../../../components'
import { cn } from '../../../../utils/cn'
import type { AuthUser } from '../../../../services/auth/auth.types'

interface StatusTogglerProps {
  open: boolean
  status: string
  setStatus: (status: string) => void
  auth?: AuthUser | null
}

export const StatusToggler = ({
  open,
  status,
  setStatus,
  auth,
}: StatusTogglerProps) => {
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)

  const handleSetManualStatus = () => {
    if (manualInput.trim()) {
      setStatus(manualInput)
      setManualInput('')
      setShowManualInput(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'hover:bg-surface-hover flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors',
            !open && 'justify-center px-0'
          )}
        >
          <div className="bg-brand relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white uppercase">
            {auth?.username?.[0]}
            <span
              className={cn(
                'absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white',
                status === 'active' ? 'bg-green-500' : 'bg-yellow-400'
              )}
            />
          </div>

          {open && (
            <div className="flex min-w-0 flex-col text-left leading-tight">
              <span className="text-foreground truncate text-sm font-medium">
                {auth?.username}
              </span>
              <span className="text-muted-foreground text-xs">
                {status === 'on-break'
                  ? 'On Break'
                  : status === 'active'
                    ? 'Active'
                    : status}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" side="top" className="w-56">
        <div className="px-1 py-1.5">
          <div className="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">
            Status
          </div>
          <DropdownMenuItem
            onClick={() => setStatus('active')}
            className={cn(status === 'active' && 'bg-accent')}
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
            Active
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStatus('on-break')}
            className={cn(status === 'on-break' && 'bg-accent')}
          >
            <Coffee size={16} />
            On Break
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-2">
          {!showManualInput ? (
            <button
              onClick={() => setShowManualInput(true)}
              className="w-full rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent transition-colors"
            >
              Set custom status
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Enter your status..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSetManualStatus()
                  }
                }}
                className="rounded-md border border-border bg-white px-2 py-1.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
                autoFocus
              />
              <div className="flex gap-1">
                <button
                  onClick={handleSetManualStatus}
                  className="flex-1 rounded-md bg-brand px-2 py-1 text-xs font-medium text-white hover:bg-brand-hover transition-colors"
                >
                  Set
                </button>
                <button
                  onClick={() => {
                    setShowManualInput(false)
                    setManualInput('')
                  }}
                  className="flex-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-surface-hover transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
