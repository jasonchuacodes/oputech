import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '../../../components'
import { DataTable, DataTableColumn } from '../../../components/ui/data-table'
import { formatCurrency } from '../../../utils/number'
import {
  useExpenses,
  useDeleteExpense,
} from '../../../services/expenses/expenses.queries'
import { Expense } from '../../../services/expenses/expenses.types'
import { AddExpenseModal } from './AddExpenseModal'

interface Props {
  reportId: string
}

export const ExpensesSection = ({ reportId }: Props) => {
  const [addOpen, setAddOpen] = useState(false)
  const { data: expenses, isLoading } = useExpenses(reportId)
  const deleteExpense = useDeleteExpense()

  const columns: DataTableColumn<Expense>[] = [
    {
      id: 'label',
      heading: 'Label',
      cell: (e) => e.label,
    },
    {
      id: 'amount',
      heading: 'Amount',
      cell: (e) => formatCurrency(e.amount),
    },
    {
      id: 'actions',
      heading: '',
      align: 'right',
      cell: (e) => (
        <button
          type="button"
          onClick={() => deleteExpense.mutate({ id: e.id, reportId })}
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors"
          aria-label="Delete expense"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  const collection = DataTable.collection({
    items: expenses ?? [],
    itemToValue: (e) => e.id,
    itemToString: (e) => e.label,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Expenses</h3>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={() => setAddOpen(true)}
        >
          <Plus size={16} />
          Add Expense
        </Button>
      </div>

      <DataTable
        collection={collection}
        columns={columns}
        loading={isLoading}
        emptyMessage="No expenses recorded for this report."
      />

      <AddExpenseModal
        reportId={reportId}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  )
}
