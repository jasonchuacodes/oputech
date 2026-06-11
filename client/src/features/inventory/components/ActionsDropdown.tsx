import { useEffect, useRef, useState } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../../utils/cn'

interface Props {
  onEdit: () => void
  onDelete: () => void
}

export const ActionsDropdown = ({ onEdit, onDelete }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleEdit = () => {
    setOpen(false)
    onEdit()
  }

  const handleDelete = () => {
    setOpen(false)
    onDelete()
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
        aria-label="More actions"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="border-border bg-white absolute right-0 z-10 mt-1 w-32 rounded-md border shadow-md">
          <button
            type="button"
            onClick={handleEdit}
            className={cn(
              'hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors'
            )}
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
