import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Receipt } from 'lucide-react'
import {
  CustomModal,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../components'
import { NumberInput } from '../../../components/ui/number-input'
import { useCreateTransaction } from '../../../services/transaction/transaction.queries'
import {
  PaymentType,
  TransactionType,
} from '../../../services/transaction/transaction.types'
import { LogExpenseSchema, LogExpenseInput } from '../schemas/log-expense.schema'

interface Props {
  open: boolean
  onClose: () => void
}

export const LogExpenseModal = ({ open, onClose }: Props) => {
  const createTransaction = useCreateTransaction()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LogExpenseInput>({
    defaultValues: { label: '', amount: 0, paymentType: PaymentType.Cash },
    resolver: zodResolver(LogExpenseSchema),
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = (data: LogExpenseInput) => {
    createTransaction.mutate(
      {
        type: TransactionType.Expense,
        label: data.label,
        amount: data.amount,
        paymentType: data.paymentType,
        items: [],
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <CustomModal
      open={open}
      title="Log Expense"
      subheader="Record a cash outflow for this day."
      icon={Receipt}
      submitText="Log Expense"
      loading={createTransaction.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="label">Label *</Label>
          <Input
            id="label"
            placeholder="e.g. Ice delivery"
            aria-invalid={!!errors.label}
            {...register('label')}
          />
          {errors.label && (
            <p className="text-destructive text-xs">{errors.label.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Amount *</Label>
          <NumberInput name="amount" control={control} step={0.01} min={0} />
          {errors.amount && (
            <p className="text-destructive text-xs">
              {errors.amount.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Payment Type *</Label>
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="min-h-10 w-full">
                  <SelectValue placeholder="Select a payment type…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentType.Cash}>Cash</SelectItem>
                  <SelectItem value={PaymentType.Online}>Online</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </CustomModal>
  )
}
