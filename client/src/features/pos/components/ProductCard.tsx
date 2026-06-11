import { ShoppingBag } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { formatCurrency } from '../../../utils/number'
import { Product } from '../../../services/pos/pos.types'

interface ProductCardProps {
  product: Product
  onClick: (product: Product) => void
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const outOfStock = product.stock === 0

  return (
    <button
      onClick={() => onClick(product)}
      disabled={outOfStock}
      className={cn(
        'flex min-w-[120px] flex-col gap-2 rounded-md border bg-white p-3 text-left transition-all',
        outOfStock
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer hover:border-slate-300 hover:shadow-sm active:scale-[0.98]'
      )}
    >
      <div className="flex h-24 w-full items-center justify-center rounded-md bg-slate-100">
        <ShoppingBag size={32} className="text-slate-400" />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="line-clamp-2 text-sm leading-snug font-medium text-slate-800">
          {product.name}
        </span>
        <span className="text-sm font-semibold text-slate-900">
          {formatCurrency(product.price)}
        </span>
        <span
          className={cn(
            'text-xs',
            product.stock <= 5 ? 'text-red-500' : 'text-slate-400'
          )}
        >
          Stock: {product.stock}
        </span>
      </div>
    </button>
  )
}
