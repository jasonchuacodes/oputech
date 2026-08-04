import { useState } from 'react'
import { PageHeader } from '../../components'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { DatePicker } from '../../components/ui/date-picker'
import { useTransactions } from '../../services/pos/pos.queries'
import { Transaction, PaymentType } from '../../services/pos/pos.types'
import { dayjsLocal, formatDate, formatTime } from '../../utils/date'
import { formatCurrency } from '../../utils/number'
import { cn } from '../../utils/cn'

const TransactionsPage = () => {
  const [date, setDate] = useState(dayjsLocal().format('YYYY-MM-DD'))

  const { data, isLoading } = useTransactions({
    from: dayjsLocal(date).startOf('day').toISOString(),
    to: dayjsLocal(date).endOf('day').toISOString(),
  })

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
    </div>
  )
}

export default TransactionsPage
