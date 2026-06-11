import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Input } from '../../components'
import { PageHeader } from '../../components/ui/page-header'
import { PaymentMode, Product, SaleItem } from '../../services/pos/pos.types'
import { useInventoryItems } from '../../services/inventory/inventory.queries'
import { useCreateSale } from '../../services/pos/pos.queries'
import { useDisclosure } from '../../hooks/useDisclosure'
import { ProductCard } from './components/ProductCard'
import { CurrentSale } from './components/CurrentSale'
import { CartSheet } from './components/CartSheet'

const POSPage = () => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([])
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.Cash)
  const [search, setSearch] = useState('')
  const cart = useDisclosure()

  const queryClient = useQueryClient()
  const { data: inventoryItems = [], isLoading } = useInventoryItems(search)
  const { mutate: createSale } = useCreateSale()

  const products: Product[] = inventoryItems.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    stock: item.quantity - (saleItems.find((s) => s.product.id === item.id)?.quantity ?? 0),
    image: item.imageUrl,
  }))

  const handleProductClick = (product: Product) => {
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
    setSaleItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const handleClear = () => setSaleItems([])

  const handleCancel = () => {
    handleClear()
    cart.onClose()
  }

  const handleSubmit = () => {
    createSale(
      {
        items: saleItems.map((i) => ({
          inventoryItemId: i.product.id,
          quantity: i.quantity,
        })),
        paymentMode,
      },
      {
        onSuccess: () => {
          handleClear()
          cart.onClose()
          queryClient.invalidateQueries({ queryKey: ['inventory'] })
        },
      },
    )
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
            {isLoading && (
              <p className="col-span-full py-12 text-center text-sm text-slate-400">
                Loading products…
              </p>
            )}
            {!isLoading && products.length === 0 && (
              <p className="col-span-full py-12 text-center text-sm text-slate-400">
                No products found.
              </p>
            )}
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>

          <div className="fixed right-0 bottom-0 -translate-x-4 -translate-y-4 md:hidden">
            <button
              onClick={cart.onOpen}
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
        open={cart.open}
        onClose={cart.onClose}
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
