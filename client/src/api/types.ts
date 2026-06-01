export type Product = {
  _id: string
  productName: string
  sku: string
  category: string
  price: number
  cost: number
  stockQuantity: number
  reorderLevel: number
  lastUpdated: string
}

export type InventoryResponse = {
  data: Product[]
  pagination: {
    totalRecords: number
    totalPages: number
    currentPage: number
    hasNextPage: boolean
  }
}

export type AnalyticsResponse = {
  totals: {
    totalRecords: number
    totalStock: number
    totalValuation: number
    lowStockSkus: number
  }
  byCategory: Array<{
    category: string
    totalProducts: number
    totalStock: number
    totalValuation: number
    lowStockCount: number
  }>
  updatedAt: string
}
