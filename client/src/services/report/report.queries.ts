import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  getReports,
  getReport,
  createReport,
  deleteReport,
  remit,
} from './report.api'
import { CreateReportInput } from './report.types'

export const useReports = () =>
  useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  })

export const useReport = (id?: string) =>
  useQuery({
    queryKey: ['report', id],
    queryFn: () => getReport(id!),
    enabled: !!id,
  })

export const useCreateReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
    onSuccess: () => {
      toast.success('Report generated successfully!')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: () => {
      toast.success('Report deleted')
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRemit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isRemitted }: { id: string; isRemitted: boolean }) =>
      remit(id, isRemitted),
    onSuccess: (data, variables) => {
      toast.success(variables.isRemitted ? 'Marked as remitted' : 'Marked as not remitted')
      queryClient.setQueryData(['report', variables.id], data)
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
