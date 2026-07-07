import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReceiptText } from 'lucide-react'
import { CustomModal, Input, Label } from '../../../components'
import { NumberInput } from '../../../components/ui/number-input'
import { useCreateExpense } from '../../../services/expenses/expenses.queries'
import {
  AddExpenseSchema,
  AddExpenseInput,
} from '../schemas/add-expense.schema'

interface Props {
  reportId: string
  open: boolean
  onClose: () => void
}

export const AddExpenseModal = ({ reportId, open, onClose }: Props) => {
  const createExpense = useCreateExpense()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AddExpenseInput>({
    resolver: zodResolver(AddExpenseSchema),
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = (data: AddExpenseInput) => {
    createExpense.mutate(
      { reportId, label: data.label, amount: data.amount },
      { onSuccess: handleClose }
    )
  }

  return (
    <CustomModal
      open={open}
      title="Add Expense"
      subheader="Record an expense for this report."
      icon={ReceiptText}
      submitText="Add Expense"
      loading={createExpense.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expense-label">Label *</Label>
          <Input
            id="expense-label"
            placeholder="e.g. Delivery fee"
            aria-invalid={!!errors.label}
            {...register('label')}
          />
          {errors.label && (
            <p className="text-destructive text-xs">{errors.label.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expense-amount">Amount *</Label>
          <NumberInput name="amount" control={control} step={0.01} min={0} />
          {errors.amount && (
            <p className="text-destructive text-xs">
              {errors.amount.message}
            </p>
          )}
        </div>
      </div>
    </CustomModal>
  )
}
