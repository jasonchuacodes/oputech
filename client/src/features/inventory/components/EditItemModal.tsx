import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil } from 'lucide-react'
import { CustomModal, Input, Label } from '../../../components'
import { useUpdateProduct } from '../../../services/inventory/inventory.queries'
import { Product } from '../../../services/inventory/inventory.types'

const EditProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be at least 0'),
  addQuantity: z.number().int().min(0, 'Must be 0 or more').optional(),
})

type EditProductInput = z.infer<typeof EditProductSchema>

interface Props {
  item: Product | null
  open: boolean
  onClose: () => void
}

export const EditItemModal = ({ item, open, onClose }: Props) => {
  const updateItem = useUpdateProduct()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditProductInput>({
    resolver: zodResolver(EditProductSchema),
  })

  const addQuantity = useWatch({ control, name: 'addQuantity' })

  useEffect(() => {
    if (item) {
      reset({ name: item.name, price: item.price, addQuantity: undefined })
    }
  }, [item, reset])

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = (data: EditProductInput) => {
    if (!item) return
    updateItem.mutate(
      {
        id: item.id,
        input: {
          name: data.name,
          price: data.price,
          addQuantity: data.addQuantity || undefined,
        },
      },
      { onSuccess: handleClose }
    )
  }

  const currentQty = item?.quantity ?? 0
  const newTotal = currentQty + (Number(addQuantity) || 0)

  return (
    <CustomModal
      open={open}
      title="Edit Item"
      subheader="Update item details or add to its stock quantity."
      icon={Pencil}
      submitText="Save"
      loading={updateItem.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g. Wireless Mouse"
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-price">Price</Label>
            <Input
              id="edit-price"
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

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Stock
            </span>
            <div className="bg-border h-px flex-1" />
          </div>

          <div className="bg-muted/50 flex items-center justify-between rounded-md px-3 py-2.5">
            <span className="text-muted-foreground text-sm">Current quantity</span>
            <span className="text-foreground text-sm font-semibold">{item?.quantity ?? '—'}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-add-quantity">Add to Stock</Label>
            <Input
              id="edit-add-quantity"
              type="number"
              placeholder="0"
              min={0}
              aria-invalid={!!errors.addQuantity}
              {...register('addQuantity', { valueAsNumber: true })}
            />
            {errors.addQuantity ? (
              <p className="text-destructive text-xs">{errors.addQuantity.message}</p>
            ) : (
              Number(addQuantity) > 0 && (
                <p className="text-muted-foreground text-xs">
                  New total:{' '}
                  <span className="text-foreground font-medium">{newTotal}</span>
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </CustomModal>
  )
}
