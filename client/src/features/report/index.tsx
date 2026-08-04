import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import { DataTable, DataTableColumn } from '../../components/ui/data-table'
import { useCreateReport, useReports } from '../../services/report/report.queries'
import { useTransactions } from '../../services/transaction/transaction.queries'
import { PaymentType } from '../../services/transaction/transaction.types'
import { ReportDisplay } from './components/ReportDisplay'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
import { dayjsLocal } from '../../utils/date'
import { formatCurrency } from '../../utils/number'
import { Report } from '../../services/report/report.types'
import { reportDetailPath } from '../../routes/paths'
import { useAuthContext } from '../../context/auth/useAuthContext'
import { UserRole } from '../../types'

const ReportPage = () => {
  const navigate = useNavigate()
  const { auth } = useAuthContext()
  const isAdmin = auth?.role === UserRole.ADMIN
  const { data: allReports, isLoading: reportsLoading } = useReports()
  const { data: transactions, isLoading: txLoading } = useTransactions({
    from: dayjsLocal().startOf('day').toISOString(),
    to: dayjsLocal().endOf('day').toISOString(),
    processed: false,
  })
  const { mutate: generate, isPending } = useCreateReport()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const todayReports = useMemo(
    () =>
      (allReports ?? []).filter((r) =>
        dayjsLocal(r.createdAt).isSame(dayjsLocal(), 'day')
      ),
    [allReports]
  )

  const openDelete = (id: string) => {
    const report = todayReports.find((r) => r.id === id)
    if (!report) return
    setSelectedReport(report)
    setDeleteOpen(true)
  }

  const previewReport = useMemo(() => {
    if (!transactions?.length) return null

    const productMap = new Map<
      string,
      { name: string; pricePerUnit: number; printCount: number; quantitySold: number }
    >()
    let totalCash = 0
    let totalOnline = 0

    for (const tx of transactions) {
      if (tx.paymentType === PaymentType.Cash) totalCash += tx.total
      else totalOnline += tx.total

      for (const item of tx.items) {
        const existing = productMap.get(item.productId)
        if (existing) {
          existing.quantitySold += item.quantity
        } else {
          productMap.set(item.productId, {
            name: item.name,
            pricePerUnit: item.price,
            printCount: item.printCount,
            quantitySold: item.quantity,
          })
        }
      }
    }

    return {
      products: Array.from(productMap.entries()).map(([productId, v]) => ({
        productId,
        ...v,
      })),
      totalCash,
      totalOnline,
      totalIncome: totalCash + totalOnline,
      totalExpenses: 0,
      totalPrintCount: Array.from(productMap.values()).reduce(
        (sum, p) => sum + p.printCount * p.quantitySold,
        0
      ),
    }
  }, [transactions])

  const isLoading = isAdmin ? reportsLoading : reportsLoading || txLoading
  const hasTransactions = (transactions?.length ?? 0) > 0
  const hasReports = todayReports.length > 0

  const handleGenerate = () => {
    generate({
      fromDate: dayjsLocal().startOf('day').toISOString(),
      toDate: dayjsLocal().toISOString(),
    })
  }

  const reportColumns: DataTableColumn<Report>[] = [
    {
      id: 'date',
      heading: 'Date',
      orderable: true,
      cell: (r) => dayjsLocal(r.toDate).format('MMM D, YYYY'),
    },
    {
      id: 'totalCash',
      heading: 'Cash',
      cell: (r) => formatCurrency(r.totalCash),
    },
    {
      id: 'totalGCash',
      heading: 'Online Payments',
      cell: (r) => formatCurrency(r.totalOnline),
    },
    {
      id: 'totalIncome',
      heading: 'Total Income',
      cell: (r) => formatCurrency(r.totalIncome),
    },
    {
      id: 'totalExpenses',
      heading: 'Expenses',
      cell: (r) => formatCurrency(r.totalExpenses),
    },
  ]

  const reportsCollection = DataTable.collection({
    items: allReports ?? [],
    itemToValue: (r) => r.id,
    itemToString: (r) => dayjsLocal(r.toDate).format('MMM D, YYYY'),
  })

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Reports"
          description={
            isAdmin ? 'All generated reports' : "Today's sales report"
          }
        />
        {!isAdmin && (
          <Button
            onClick={handleGenerate}
            disabled={isPending || !hasTransactions}
          >
            {isPending ? 'Generating…' : 'Generate Report'}
          </Button>
        )}
      </div>

      {isAdmin ? (
        <DataTable
          collection={reportsCollection}
          columns={reportColumns}
          loading={reportsLoading}
          emptyMessage="No reports generated yet."
          onRowClick={(r) => navigate(reportDetailPath(r.id))}
        />
      ) : isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border bg-slate-100"
            />
          ))}
        </div>
      ) : !hasTransactions && !hasReports ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <p className="text-lg font-medium text-slate-700">
            No activity today
          </p>
          <p className="text-sm text-slate-400">
            Transactions will appear here once sales are recorded.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {previewReport && (
            <ReportDisplay report={previewReport as Report} isPreview />
          )}
          {todayReports.map((report, i) => (
            <ReportDisplay key={i} report={report} onDelete={openDelete} />
          ))}
        </div>
      )}

      <DeleteConfirmModal
        item={selectedReport}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setSelectedReport(null)
        }}
      />
    </div>
  )
}

export default ReportPage
