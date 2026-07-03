import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Navbar } from './components/Navbar'
import { StatusOverlay } from './components/StatusOverlay'
import { useCurrentUserActivityStatus } from './hooks/useCurrentUserActivityStatus'
import { UserStatus } from '../../services/users/users.types'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export function MainLayout() {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(!isMobile)
  const { status, setActive } = useCurrentUserActivityStatus()

  return (
    <>
      <StatusOverlay
        open={status === UserStatus.Inactive}
        onActive={setActive}
      />
      <div className="flex h-dvh">
        <Sidebar open={open} onOpenChange={setOpen} isMobile={isMobile} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenuClick={() => setOpen(true)} />
          <main className="min-h-0 flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
