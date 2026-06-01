import type { AnalyticsResponse, InventoryResponse } from './types'

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000'

function buildUrl(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL)
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue
    url.searchParams.set(key, String(value))
  }
  return url.toString()
}

async function requestJson<T>(url: string, init?: RequestInit) {
  const res = await fetch(url, init)
  if (!res.ok) {
    let message = `Request failed: ${res.status}`
    try {
      const data = (await res.json()) as { message?: string }
      if (data?.message) message = data.message
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}

export async function getInventory(
  params: {
    page: number
    limit: number
    search?: string
    category?: string
    sort?: string
  },
  signal?: AbortSignal,
) {
  const url = buildUrl('/api/inventory', {
    page: params.page,
    limit: params.limit,
    search: params.search,
    category: params.category,
    sort: params.sort,
  })

  return requestJson<InventoryResponse>(url, { signal })
}

export async function getAnalytics(signal?: AbortSignal) {
  const url = new URL('/api/analytics', API_BASE_URL)
  return requestJson<AnalyticsResponse>(url.toString(), { signal })
}
