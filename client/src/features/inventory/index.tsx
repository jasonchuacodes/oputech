import { useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { Button, Input, PageHeader } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { useProducts } from '../../services/inventory/inventory.queries'
import { Product, ProductStatus } from '../../services/inventory/inventory.types'
import { formatCurrency } from '../../utils/number'
import { cn } from '../../utils/cn'
import { AddItemModal } from './components/AddItemModal'
import { EditItemModal } from './components/EditItemModal'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { ActionsDropdown } from './components/ActionsDropdown'

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  IN_STOCK: { label: 'In Stock', className: 'bg-green-100 text-green-700' },
  LOW: { label: 'Low', className: 'bg-amber-100 text-amber-700' },
  OUT_OF_STOCK: { label: 'Out of Stock', className: 'bg-red-100 text-red-700' },
}

const InventoryPage = () => {
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
      orderable: true,
    },
    {
      id: 'quantity',
      heading: 'Quantity',
      cell: (item) => item.quantity,
      orderable: true,
    },
    {
      id: 'price',
      heading: 'Price',
      cell: (item) => formatCurrency(item.price),
      orderable: true,
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (item) => {
        const config = statusConfig[item.status]
        return (
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              config.className
            )}
          >
            {config.label}
          </span>
        )
      },
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

  const collection = DataTable.collection({
    items: data ?? [],
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Inventory"
        description="Track and manage your product stock"
        action={
          <Button className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus size={16} />
            Add Item
          </Button>
        }
      />

      <Input
        placeholder="Search by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <DataTable
        collection={collection}
        columns={columns}
        loading={isLoading}
        emptyMessage="No items found"
      />

      <AddItemModal open={addOpen} onClose={() => setAddOpen(false)} />

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
