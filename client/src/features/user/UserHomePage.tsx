import { Button } from '../../components'
import { useAuthContext } from '../../context/auth/useAuthContext'

export default function UserHomePage() {
  const { logout } = useAuthContext()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold tracking-tight">Oputech</h1>
      <p className="text-muted-foreground">Welcome home.</p>
      <div className="flex gap-1">
        <Button>Get started</Button>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  )
}
