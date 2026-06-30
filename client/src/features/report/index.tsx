import { useState } from 'react'
import { Button, Input } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import { useCreateReport } from '../../services/report/report.queries'
import { Report } from '../../services/report/report.types'
import { ReportDisplay } from './components/ReportDisplay'

const todayStart = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 16)
}

const nowLocal = () => new Date().toISOString().slice(0, 16)

const ReportPage = () => {
  const [fromDate, setFromDate] = useState(todayStart)
  const [toDate, setToDate] = useState(nowLocal)
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  const { mutate: generate, isPending } = useCreateReport()

  const handleGenerate = () => {
    generate(
      {
        fromDate: new Date(fromDate).toISOString(),
        toDate: new Date(toDate).toISOString(),
      },
      {
        onSuccess: (report) => setActiveReport(report),
      },
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title="Report"
        description="Generate an end-of-day sales report"
      />

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="from-date">
            From
          </label>
          <Input
            id="from-date"
            type="datetime-local"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-56"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="to-date">
            To
          </label>
          <Input
            id="to-date"
            type="datetime-local"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-56"
          />
        </div>

        <Button onClick={handleGenerate} disabled={isPending}>
          {isPending ? 'Generating…' : 'Generate Report'}
        </Button>
      </div>

      {activeReport && <ReportDisplay report={activeReport} />}
    </div>
  )
}

export default ReportPage
