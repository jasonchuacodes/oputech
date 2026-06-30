import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getReports, createReport } from './report.api'
import { CreateReportInput } from './report.types'

export const useReports = () =>
  useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  })

export const useCreateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
    onSuccess: () => {
      toast.success('Report generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
