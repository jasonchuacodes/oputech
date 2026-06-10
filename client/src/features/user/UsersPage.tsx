import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { useUsers } from '../../services/users/users.queries'
import { User } from '../../services/users/users.types'
import { AddUserModal } from './components/AddUserModal'

const columns: DataTableColumn<User>[] = [
  {
    id: 'username',
    heading: 'Username',
    cell: (u) => u.username,
    orderable: true,
  },
  {
    id: 'email',
    heading: 'Email',
    cell: (u) => u.email ?? '—',
    orderable: true,
  },
  {
    id: 'role',
    heading: 'Role',
    cell: (u) => u.role,
    orderable: true,
  },
]

const UsersPage = () => {
  const { data, isLoading } = useUsers()
  const [modalOpen, setModalOpen] = useState(false)

  const collection = DataTable.collection({
    items: data ?? [],
    itemToValue: (u) => u.id,
    itemToString: (u) => u.username,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Add User
        </Button>
      </div>

      <DataTable
        collection={collection}
        columns={columns}
        loading={isLoading}
        emptyMessage="No users found"
      />

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default UsersPage
