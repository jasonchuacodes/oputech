export interface ProductSale {
  productId: string
  name: string
  quantitySold: number
  pricePerUnit: number
  total: number
}

export interface ReportUser {
  id: string
  username: string
}

export interface Report {
  id: string
  createdBy: ReportUser
  fromDate: string
  toDate: string
  products: ProductSale[]
  totalCash: number
  totalOnline: number
  totalIncome: number
  totalExpenses: number
  createdAt: string
}

export interface CreateReportInput {
  fromDate: string
  toDate: string
}
