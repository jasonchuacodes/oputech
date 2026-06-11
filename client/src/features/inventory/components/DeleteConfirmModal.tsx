import { Trash2 } from 'lucide-react'
import { CustomModal } from '../../../components'
import { useDeleteInventoryItem } from '../../../services/inventory/inventory.queries'
import { InventoryItem } from '../../../services/inventory/inventory.types'

interface Props {
  item: InventoryItem | null
  open: boolean
  onClose: () => void
}

export const DeleteConfirmModal = ({ item, open, onClose }: Props) => {
  const deleteItem = useDeleteInventoryItem()

  const handleConfirm = () => {
    if (!item) return
    deleteItem.mutate(item.id, { onSuccess: onClose })
  }

  return (
    <CustomModal
      open={open}
      title="Delete Item"
      icon={Trash2}
      type="danger"
      submitText="Delete"
      loading={deleteItem.isPending}
      onClose={onClose}
      onSubmit={handleConfirm}
    >
      <p className="text-sm">
        Are you sure you want to delete{' '}
        <span className="text-destructive font-semibold">{item?.name}</span>? This
        action cannot be undone.
      </p>
    </CustomModal>
  )
}
