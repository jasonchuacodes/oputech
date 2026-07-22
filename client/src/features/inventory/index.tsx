import { useState } from 'react'
import { Plus, Pencil, ImageOff } from 'lucide-react'
import { Button, Input, PageHeader } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { useProducts } from '../../services/inventory/inventory.queries'
import { Product } from '../../services/inventory/inventory.types'
import { formatCurrency } from '../../utils/number'
import { useAuthContext } from '../../context/auth/useAuthContext'
import { UserRole } from '../../types'
import { AddItemModal } from './components/AddItemModal'
import { EditItemModal } from './components/EditItemModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { ActionsDropdown } from './components/ActionsDropdown'

const InventoryPage = () => {
  const { auth } = useAuthContext()
  const isAdmin = auth?.role === UserRole.ADMIN

  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Product | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data, isLoading } = useProducts(search || undefined)

  const openEdit = (item: Product) => {
    setSelectedItem(item)
    setEditOpen(true)
  }

  const openDelete = (item: Product) => {
    setSelectedItem(item)
    setDeleteOpen(true)
  }

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'name',
      heading: 'Name',
      cell: (item) => item.name,
      width: 320,
      orderable: true,
    },
    {
      id: 'image',
      heading: '',
      width: 48,
      cell: (item) =>
        item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="h-10 w-10 rounded-md object-cover"
          />
        ) : (
          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
            <ImageOff size={16} className="text-muted-foreground" />
          </div>
        ),
    },
    {
      id: 'price',
      heading: 'Price',
      cell: (item) => formatCurrency(item.price),
      orderable: true,
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => openEdit(item)}
            className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
            aria-label="Edit item"
          >
            <Pencil size={16} />
          </button>
          <ActionsDropdown
            onEdit={() => openEdit(item)}
            onDelete={() => openDelete(item)}
          />
        </div>
      ),
    },
  ]

  const mainProducts = (data ?? []).filter((item) => item.category === 'main')
  const addOnProducts = (data ?? []).filter(
    (item) => item.category === 'add-on'
  )

  const mainCollection = DataTable.collection({
    items: mainProducts,
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
  })

  const addOnCollection = DataTable.collection({
    items: addOnProducts,
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Inventory"
        description="Track and manage your product stock"
        action={
          isAdmin && (
            <Button className="gap-2" onClick={() => setAddOpen(true)}>
              <Plus size={16} />
              Add Item
            </Button>
          )
        }
      />

      <Input
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-700">Main</h2>
        <DataTable
          collection={mainCollection}
          columns={columns}
          loading={isLoading}
          emptyMessage="No items found"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-slate-700">Add-ons</h2>
        <DataTable
          collection={addOnCollection}
          columns={columns}
          loading={isLoading}
          emptyMessage="No items found"
        />
      </div>

      <AddItemModal
        open={isAdmin && addOpen}
        onClose={() => setAddOpen(false)}
      />

      <EditItemModal
        item={selectedItem}
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
          setSelectedItem(null)
        }}
      />

      <DeleteConfirmModal
        item={selectedItem}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedItem(null)
        }}
      />
    </div>
  )
}

export default InventoryPage
