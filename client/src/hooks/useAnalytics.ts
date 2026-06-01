import { useEffect, useState } from 'react'
import { getAnalytics } from '../api/auraApi'
import type { AnalyticsResponse } from '../api/types'

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setIsLoading(true)

    getAnalytics(controller.signal)
      .then((res) => setData(res))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  return { data, isLoading, error }
}
