import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { DatePicker } from '../../components/ui/date-picker'
import { useTransactions } from '../../services/transaction/transaction.queries'
import { Transaction, PaymentType } from '../../services/transaction/transaction.types'
import { dayjsLocal, formatDate, formatTime } from '../../utils/date'
import { formatCurrency } from '../../utils/number'
import { cn } from '../../utils/cn'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'

const TransactionsPage = () => {
  const [date, setDate] = useState(dayjsLocal().format('YYYY-MM-DD'))
  const [selectedItem, setSelectedItem] = useState<Transaction | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { data, isLoading } = useTransactions({
    from: dayjsLocal(date).startOf('day').toISOString(),
    to: dayjsLocal(date).endOf('day').toISOString(),
  })

  const openDelete = (item: Transaction) => {
    setSelectedItem(item)
    setDeleteOpen(true)
  }

  const columns: DataTableColumn<Transaction>[] = [
    {
      id: 'createdAt',
      heading: 'Time',
      orderable: true,
      cell: (t) => formatTime(t.createdAt),
    },
    {
      id: 'items',
      heading: 'Items',
      cell: (t) => t.items.map((i) => `${i.name} ×${i.quantity}`).join(', '),
    },
    {
      id: 'paymentType',
      heading: 'Payment',
      cell: (t) => (t.paymentType === PaymentType.Cash ? 'Cash' : 'Online'),
    },
    {
      id: 'total',
      heading: 'Total',
      align: 'right',
      cell: (t) => formatCurrency(t.total),
    },
    {
      id: 'status',
      heading: 'Status',
      cell: (t) => (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              t.processed ? 'bg-green-500' : 'bg-amber-500'
            )}
          />
          <span className="text-sm">
            {t.processed ? 'Processed' : 'Pending'}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      cell: (t) => (
        <button
          type="button"
          onClick={() => openDelete(t)}
          disabled={t.processed}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors disabled:pointer-events-none disabled:opacity-40"
          aria-label="Delete transaction"
          title={
            t.processed
              ? 'Processed transactions cannot be deleted'
              : 'Delete transaction'
          }
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  const collection = DataTable.collection({
    items: data ?? [],
    itemToValue: (t) => t.id,
    itemToString: (t) => t.id,
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Transactions"
        description={`Showing transactions for ${formatDate(date)}`}
      />

      <DatePicker
        value={dayjsLocal(date).toDate()}
        onChange={(next) =>
          next && setDate(dayjsLocal(next).format('YYYY-MM-DD'))
        }
        disableFuture
        className="w-48"
      />

      <DataTable
        collection={collection}
        columns={columns}
        loading={isLoading}
        emptyMessage="No transactions found for this date."
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

export default TransactionsPage
