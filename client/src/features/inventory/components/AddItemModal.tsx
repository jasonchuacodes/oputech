import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, PackagePlus } from 'lucide-react'
import { CustomModal, Input, Label } from '../../../components'
import { useCreateProduct } from '../../../services/inventory/inventory.queries'
import {
  AddInventoryItemSchema,
  AddInventoryItemInput,
} from '../schemas/add-inventory-item.schema'

interface Props {
  open: boolean
  onClose: () => void
}

export const AddItemModal = ({ open, onClose }: Props) => {
  const createItem = useCreateProduct()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddInventoryItemInput>({
    resolver: zodResolver(AddInventoryItemSchema),
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = (data: AddInventoryItemInput) => {
    createItem.mutate(
      {
        name: data.name,
        quantity: data.quantity,
        price: data.price,
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <CustomModal
      open={open}
      title="Add Item"
      subheader="Add a new item to your inventory."
      icon={PackagePlus}
      submitText="Add Item"
      loading={createItem.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="border-border text-muted-foreground flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 opacity-50 select-none">
            <ImagePlus size={24} />
            <p className="text-sm">Drag & drop or click to upload</p>
            <p className="text-xs">Coming soon</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Wireless Mouse"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="0"
            min={0}
            aria-invalid={!!errors.quantity}
            {...register('quantity', { valueAsNumber: true })}
          />
          {errors.quantity && (
            <p className="text-destructive text-xs">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            min={0}
            aria-invalid={!!errors.price}
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-destructive text-xs">{errors.price.message}</p>
          )}
        </div>
      </div>
    </CustomModal>
  )
}
