import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Input } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import { PaymentMode, Product, SaleItem } from '../../services/pos/pos.types'
import { mockProducts } from './data/mock-products'
import { ProductCard } from './components/ProductCard'
import { CurrentSale } from './components/CurrentSale'
import { CartSheet } from './components/CartSheet'

const POSPage = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.Cash)
  const [search, setSearch] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleProductClick = (product: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    )

    setSaleItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const handleRemoveItem = (productId: string) => {
    const item = saleItems.find((i) => i.product.id === productId)
    if (!item) return

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: p.stock + item.quantity } : p
      )
    )
    setSaleItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const handleClear = () => {
    setProducts((prev) =>
      prev.map((p) => {
        const item = saleItems.find((i) => i.product.id === p.id)
        return item ? { ...p, stock: p.stock + item.quantity } : p
      })
    )
    setSaleItems([])
  }

  const handleCancel = () => {
    handleClear()
    setCartOpen(false)
  }

  const handleSubmit = () => {
    // TODO: integrate with backend
    handleClear()
    setCartOpen(false)
  }

  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <PageHeader title="Point of Sale" description="Create a new sale" />

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <div className="grid grid-cols-2 gap-3 overflow-y-auto lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-slate-400">
                No products found.
              </p>
            )}
          </div>

          <div className="fixed right-0 bottom-0 -translate-x-4 -translate-y-4 md:hidden">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg"
            >
              <ShoppingCart size={18} />
              Cart
              {saleItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {saleItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="hidden w-80 shrink-0 md:flex md:flex-col">
          <CurrentSale
            items={saleItems}
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
            onSubmit={handleSubmit}
            onClear={handleClear}
            onCancel={handleCancel}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>

      <CartSheet
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={saleItems}
        paymentMode={paymentMode}
        onPaymentModeChange={setPaymentMode}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onCancel={handleCancel}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  )
}

export default POSPage
