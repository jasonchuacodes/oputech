import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, PackagePlus } from 'lucide-react'
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
import { useCreateProduct } from '../../../services/inventory/inventory.queries'
import {
  AddProductSchema,
  AddProductInput,
} from '../schemas/add-product.schema'

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
    control,
    formState: { errors },
  } = useForm<AddProductInput>({
    defaultValues: { category: 'main' },
    resolver: zodResolver(AddProductSchema),
  })

  const handleClose = () => {
    onClose()
    reset()
  }

  const onSubmit = (data: AddProductInput) => {
    createItem.mutate(
      {
        name: data.name,
        price: data.price,
        category: data.category,
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
          <Label htmlFor="price">Price *</Label>
          <NumberInput name="price" control={control} step={0.01} min={0} />
          {errors.price && (
            <p className="text-destructive text-xs">{errors.price.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Category *</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full min-h-10">
                  <SelectValue placeholder="Select a category…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="add-on">Add-on</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </CustomModal>
  )
}
