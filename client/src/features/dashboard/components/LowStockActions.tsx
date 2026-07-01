import { LowStockProduct } from '../../../services/analytics/analytics.types'

interface Props {
  products: LowStockProduct[]
}

export const LowStockActions = ({ products }: Props) => (
  <div className="flex flex-col gap-3 rounded-md border bg-white p-6">
    <h3 className="text-sm font-semibold text-slate-700">Low Stock Alerts</h3>
    {products.length === 0 ? (
      <div className="flex h-32 items-center justify-center text-sm text-slate-400">
        All products are well stocked.
      </div>
    ) : (
      <ul className="flex flex-col gap-1">
        {products.map((p) => {
          const isOut = p.quantity === 0
          return (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-slate-50"
            >
              <span className="text-sm font-medium text-slate-800">
                {p.name}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isOut
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {isOut ? 'Out of stock' : `${p.quantity} left`}
              </span>
            </li>
          )
        })}
      </ul>
    )}
  </div>
)
