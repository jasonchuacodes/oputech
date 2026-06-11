import { Product } from '../pos.types'

export const mockProducts: Product[] = [
  { id: '1', name: 'Coca-Cola 1.5L', price: 75, stock: 24, category: 'Beverages' },
  { id: '2', name: 'Pepsi 1.5L', price: 72, stock: 18, category: 'Beverages' },
  { id: '3', name: 'Mineral Water 500ml', price: 20, stock: 60, category: 'Beverages' },
  { id: '4', name: 'Orange Juice 1L', price: 95, stock: 12, category: 'Beverages' },
  { id: '5', name: 'Egg (per piece)', price: 12, stock: 100, category: 'Grocery' },
  { id: '6', name: 'Instant Noodles', price: 18, stock: 50, category: 'Grocery' },
  { id: '7', name: 'Canned Tuna 155g', price: 45, stock: 30, category: 'Grocery' },
  { id: '8', name: 'White Rice (per kg)', price: 55, stock: 80, category: 'Grocery' },
  { id: '9', name: 'Loaf Bread', price: 65, stock: 15, category: 'Bakery' },
  { id: '10', name: 'Pandesal (per pc)', price: 5, stock: 120, category: 'Bakery' },
  { id: '11', name: 'Cigarette (per stick)', price: 8, stock: 200, category: 'Tobacco' },
  { id: '12', name: 'Shampoo Sachet', price: 9, stock: 70, category: 'Personal Care' },
  { id: '13', name: 'Dishwashing Liquid 250ml', price: 42, stock: 20, category: 'Household' },
  { id: '14', name: 'Bar Soap 90g', price: 28, stock: 35, category: 'Personal Care' },
  { id: '15', name: 'Coffee 3-in-1 Sachet', price: 12, stock: 90, category: 'Beverages' },
  { id: '16', name: 'Vinegar 375ml', price: 25, stock: 22, category: 'Condiments' },
]
