import { useEffect, useMemo, useState } from 'react'
import { getInventory } from '../api/auraApi'
import type { InventoryResponse, Product } from '../api/types'

export type InventoryQuery = {
  page: number
  limit: number
  search?: string
  category?: string
  sort?: string
}

export function useInventory(query: InventoryQuery) {
  const [data, setData] = useState<Product[] | null>(null)
  const [pagination, setPagination] = useState<InventoryResponse['pagination'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stableQuery = useMemo(
    () => ({ ...query, search: query.search?.trim() || undefined }),
    [query.page, query.limit, query.search, query.category, query.sort],
  )

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    getInventory(stableQuery, controller.signal)
      .then((res) => {
        setData(res.data)
        setPagination(res.pagination)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load inventory')
        setData([])
        setPagination({ totalRecords: 0, totalPages: 0, currentPage: stableQuery.page, hasNextPage: false })
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [stableQuery])

  return { data, pagination, isLoading, error }
}
