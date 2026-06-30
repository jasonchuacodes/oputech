import { useMemo } from 'react'
import { Button } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import {
  useCreateReport,
  useReports,
} from '../../services/report/report.queries'
import { useTransactions } from '../../services/pos/pos.queries'
import { PaymentType } from '../../services/pos/pos.types'
import { ReportDisplay } from './components/ReportDisplay'
import { dayjsLocal } from '../../utils/date'

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString('en-PH', { timeStyle: 'short' })

const ReportPage = () => {
  const today = dayjsLocal().format('YYYY-MM-DD')

  const { data: allReports, isLoading: reportsLoading } = useReports()
  const { data: transactions, isLoading: txLoading } = useTransactions(today)
  const { mutate: generate, isPending } = useCreateReport()

  const todayReports = useMemo(
    () =>
      (allReports ?? []).filter((r) =>
        dayjsLocal(r.createdAt).isSame(dayjsLocal(), 'day')
      ),
    [allReports]
  )

  const previewReport = useMemo(() => {
    if (!transactions?.length) return null

    const productMap = new Map<
      string,
      { name: string; pricePerUnit: number; quantitySold: number }
    >()
    let totalCash = 0
    let totalGCash = 0

    for (const tx of transactions) {
      if (tx.paymentType === PaymentType.Cash) totalCash += tx.total
      else totalGCash += tx.total

      for (const item of tx.items) {
        const existing = productMap.get(item.productId)
        if (existing) {
          existing.quantitySold += item.quantity
        } else {
          productMap.set(item.productId, {
            name: item.name,
            pricePerUnit: item.price,
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
      totalGCash,
      totalIncome: totalCash + totalGCash,
    }
  }, [transactions])

  const isLoading = reportsLoading || txLoading
  const hasTransactions = (transactions?.length ?? 0) > 0
  const hasReports = todayReports.length > 0

  const handleGenerate = () => {
    generate({
      fromDate: dayjsLocal().startOf('day').toISOString(),
      toDate: dayjsLocal().toISOString(),
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Report" description="Today's sales report" />
        <Button
          onClick={handleGenerate}
          disabled={isPending || !hasTransactions}
        >
          {isPending ? 'Generating…' : 'Generate Report'}
        </Button>
      </div>

      {isLoading ? (
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
          {hasReports
            ? todayReports.map((report, i) => (
                <ReportDisplay key={i} report={report} />
              ))
            : previewReport && (
                <ReportDisplay report={previewReport} isPreview />
              )}
        </div>
      )}
    </div>
  )
}

export default ReportPage
