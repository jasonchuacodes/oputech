import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button, Input } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { useInventoryItems } from '../../services/inventory/inventory.queries'
import { InventoryItem } from '../../services/inventory/inventory.types'
import { formatCurrency } from '../../utils/number'
import { AddItemModal } from './components/AddItemModal'

const columns: DataTableColumn<InventoryItem>[] = [
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
]

const InventoryPage = () => {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading } = useInventoryItems(search || undefined)

  const collection = DataTable.collection({
    items: data ?? [],
    itemToValue: (item) => item.id,
    itemToString: (item) => item.name,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Add Item
        </Button>
      </div>

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

      <AddItemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

export default InventoryPage
