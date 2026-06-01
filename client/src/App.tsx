import { useEffect, useMemo, useState } from 'react'
import { CategoryValuationChart } from './components/CategoryValuationChart'
import { ExportCsvButton } from './components/ExportCsvButton'
import { InventoryTable } from './components/InventoryTable'
import { KpiCard } from './components/KpiCard'
import { Pagination } from './components/Pagination'
import { useAnalytics } from './hooks/useAnalytics'
import { useInventory } from './hooks/useInventory'

const SORT_OPTIONS = [
  { label: 'Last Updated (newest)', value: '-lastUpdated' },
  { label: 'Price (high → low)', value: '-price' },
  { label: 'Price (low → high)', value: 'price' },
  { label: 'Stock (high → low)', value: '-stockQuantity' },
  { label: 'Stock (low → high)', value: 'stockQuantity' }
]

function App() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState(SORT_OPTIONS[0].value)

  const analytics = useAnalytics()
  const categories = useMemo(() => {
    const fromAnalytics = analytics.data?.byCategory?.map((c) => c.category) ?? []
    return Array.from(new Set(fromAnalytics)).sort((a, b) => a.localeCompare(b))
  }, [analytics.data])

  const inventory = useInventory({
    page,
    limit,
    search: searchTerm,
    category: category || undefined,
    sort
  })

  function applySearch() {
    setSearchTerm(searchInput.trim())
    setPage(1)
  }

  function clearSearch() {
    setSearchInput('')
    setSearchTerm('')
    setPage(1)
  }

  // Reset back to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [category, sort, limit])

  const totals = analytics.data?.totals

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Aura Engine
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">Inventory Dashboard</h1>
          </div>
          <p className="text-sm text-slate-400">
            Server-side pagination • Mongo aggregation analytics
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <section className="grid gap-4 md:grid-cols-4">
          <KpiCard
            label="Total SKUs"
            value={totals ? totals.totalRecords.toLocaleString() : '—'}
            helper="Catalog size"
          />
          <KpiCard
            label="Total Stock"
            value={totals ? totals.totalStock.toLocaleString() : '—'}
            helper="Units across all SKUs"
          />
          <KpiCard
            label="Total Valuation"
            value={totals ? `$${totals.totalValuation.toLocaleString()}` : '—'}
            helper="Σ (price × stock)"
          />
          <KpiCard
            label="Low Stock SKUs"
            value={totals ? totals.lowStockSkus.toLocaleString() : '—'}
            helper="stock ≤ reorder level"
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-200">Valuation by Category</h2>
              <p className="text-xs text-slate-400">Aggregation pipeline</p>
            </div>
            <CategoryValuationChart data={analytics.data?.byCategory ?? []} isLoading={analytics.isLoading} />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
            <h2 className="text-sm font-semibold text-slate-200">Query Controls</h2>
            <div className="mt-3 grid gap-3">
              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-300">Search</span>
                <div className="flex gap-2">
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applySearch()
                      }
                    }}
                    placeholder="Search product name or SKU"
                    className="h-10 min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                  <button
                    type="button"
                    onClick={applySearch}
                    className="h-10 rounded-lg bg-sky-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-500"
                  >
                    Clear
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: press Enter or click Search to load a specific product.
                </p>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-300">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-300">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-300">Page size</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  {[25, 50, 100, 150, 200].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-800 p-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-sm font-semibold text-slate-200">Inventory</h2>
              <p className="text-xs text-slate-400">
                Returned from `GET /api/inventory` with server-side slicing
              </p>
            </div>
            <ExportCsvButton rows={inventory.data ?? []} disabled={inventory.isLoading || !inventory.data?.length} />
          </div>

          <InventoryTable rows={inventory.data ?? []} isLoading={inventory.isLoading} error={inventory.error} />

          <div className="border-t border-slate-800 p-4">
            <Pagination
              page={inventory.pagination?.currentPage ?? page}
              totalPages={inventory.pagination?.totalPages ?? 0}
              hasNextPage={inventory.pagination?.hasNextPage ?? false}
              onPageChange={setPage}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
