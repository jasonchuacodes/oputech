import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileBarChart,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react'
import { useAuthContext } from '../../../context/auth/useAuthContext'
import { cn } from '../../../utils/cn'

const navGroups = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
      { label: 'Report', icon: FileBarChart, to: '/report' },
      { label: 'POS', icon: ShoppingCart, to: '/pos' },
      { label: 'Users', icon: Users, to: '/users' },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Settings', icon: Settings, to: '/settings' }],
  },
]

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isMobile: boolean
}

export function Sidebar({ open, onOpenChange, isMobile }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuthContext()

  return (
    <>
      {isMobile && open && (
        <div
          className="fixed inset-0 z-[1199] bg-black/40"
          onClick={() => onOpenChange(false)}
        />
      )}

      <aside
        className={cn(
          'bg-white z-[1200] flex h-full flex-col border-r border-gray-200 transition-all duration-200',
          open ? 'w-60' : 'w-18',
          isMobile ? 'fixed inset-y-0 left-0' : 'relative',
          isMobile && !open && '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200 px-3">
          {open && <span className="text-md font-semibold">Oputech</span>}
          <button
            onClick={() => onOpenChange(!open)}
            className={cn(
              'hover:bg-muted rounded p-1',
              open ? 'ml-auto' : 'flex w-full justify-center'
            )}
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-2">
          {navGroups.map((group, gi) => (
            <div key={gi} className="flex flex-col gap-1">
              {open && (
                <span className="text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase">
                  {group.label}
                </span>
              )}
              {group.items.map(({ label, icon: Icon, to }, ii) => {
                const active = location.pathname === to
                return (
                  <Link
                    key={ii}
                    to={to}
                    title={!open ? label : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors',
                      active
                        ? 'bg-surface-selected text-brand font-medium'
                        : 'text-slate-600 hover:bg-surface-hover hover:text-foreground',
                      !open && 'justify-center'
                    )}
                  >
                    <Icon size={18} />
                    {open && <span>{label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="border-t px-2 py-3">
          <button
            onClick={logout}
            title={!open ? 'Logout' : undefined}
            className={cn(
              'text-slate-600 hover:bg-surface-hover hover:text-foreground flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors',
              !open && 'justify-center'
            )}
          >
            <LogOut size={18} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
