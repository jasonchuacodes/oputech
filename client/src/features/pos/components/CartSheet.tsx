import { PaymentType, TransactionItem } from '../../../services/transaction/transaction.types'
import { CurrentSale } from './CurrentSale'

interface CartSheetProps {
  open: boolean
  onClose: () => void
  items: TransactionItem[]
  paymentType: PaymentType | null
  onPaymentTypeChange: (type: PaymentType) => void
  onSubmit: () => void
  onClear: () => void
  onCancel: () => void
  onRemoveItem: (productId: string) => void
}

export const CartSheet = ({
  open,
  onClose,
  items,
  paymentType,
  onPaymentTypeChange,
  onSubmit,
  onClear,
  onCancel,
  onRemoveItem,
}: CartSheetProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 bottom-0 left-0 flex max-h-[90vh] flex-col rounded-t-2xl bg-white shadow-xl">
        <div className="flex justify-center pt-3 pb-1">
          <div onClick={onClose} className="h-1 w-10 rounded-full bg-slate-200" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-4">
          <CurrentSale
            items={items}
            paymentType={paymentType}
            onPaymentTypeChange={onPaymentTypeChange}
            onSubmit={onSubmit}
            onClear={onClear}
            onCancel={onCancel}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>
    </div>
  )
}
