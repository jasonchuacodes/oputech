import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

type NumberInputProps<T extends FieldValues> = Omit<
  React.ComponentProps<'input'>,
  'name'
> & {
  control: Control<T>
  name: Path<T>
  step?: number
  min?: number
  max?: number
}

export function NumberInput<T extends FieldValues>({
  control,
  name,
  step = 1,
  min,
  max,
  className,
  ...props
}: NumberInputProps<T>) {
  const decimals = String(step).includes('.')
    ? String(step).split('.')[1].length
    : 0

  const round = (n: number) => Number(n.toFixed(decimals))

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = Number(field.value ?? 0)

        const increment = () => {
          let next = round(value + step)

          if (max !== undefined) next = Math.min(next, max)

          field.onChange(next)
        }

        const decrement = () => {
          let next = round(value - step)

          if (min !== undefined) next = Math.max(next, min)

          field.onChange(next)
        }

        return (
          <div
            className={cn(
              'border-border focus-within:border-brand focus-within:ring-brand/10 flex h-11 overflow-hidden rounded-sm border focus-within:ring-3',
              fieldState.error && 'border-danger ring-danger/20',
              className
            )}
          >
            <input
              {...props}
              {...field}
              value={field.value ?? ''}
              type="number"
              min={min}
              max={max}
              step={step}
              onChange={(e) => {
                const v = e.target.value

                if (v === '') {
                  field.onChange('')
                  return
                }

                field.onChange(round(Number(v)))
              }}
              className="flex-1 [appearance:textfield] bg-white px-3 text-sm outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <div className="border-border flex w-10 flex-col border-l">
              <button
                type="button"
                onClick={increment}
                className="flex flex-1 items-center justify-center hover:bg-slate-100"
              >
                <ChevronUp className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={decrement}
                className="border-border flex flex-1 items-center justify-center border-t hover:bg-slate-100"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      }}
    />
  )
}
