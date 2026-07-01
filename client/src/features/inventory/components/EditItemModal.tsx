import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { CustomModal, Input, Label } from '../../../components'
import { useUpdateProduct } from '../../../services/inventory/inventory.queries'
import { Product } from '../../../services/inventory/inventory.types'
import {
  EditProductInput,
  EditProductSchema,
} from '../schemas/edit-product.schema'
import { NumberInput } from '../../../components/ui/number-input'

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

  useEffect(() => {
    if (item) {
      reset({ name: item.name, price: item.price })
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
        },
      },
      { onSuccess: handleClose }
    )
  }

  return (
    <CustomModal
      open={open}
      title="Edit Item"
      subheader="Update item details."
      icon={Pencil}
      submitText="Save"
      loading={updateItem.isPending}
      onClose={handleClose}
      onSubmit={handleSubmit(onSubmit)}
    >
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
          <NumberInput name="price" control={control} />

          {errors.price && (
            <p className="text-destructive text-xs">{errors.price.message}</p>
          )}
        </div>
      </div>
    </CustomModal>
  )
}
