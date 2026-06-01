import type { Product } from '../api/types'

function escapeCsv(value: string) {
  const needsQuotes = /[\n\r,"]/u.test(value)
  const escaped = value.replace(/"/gu, '""')
  return needsQuotes ? `"${escaped}"` : escaped
}

function toCsv(rows: Product[]) {
  const header = ['productName', 'sku', 'category', 'price', 'cost', 'stockQuantity', 'reorderLevel', 'lastUpdated']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        escapeCsv(r.productName),
        escapeCsv(r.sku),
        escapeCsv(r.category),
        String(r.price),
        String(r.cost),
        String(r.stockQuantity),
        String(r.reorderLevel),
        escapeCsv(r.lastUpdated)
      ].join(','),
    )
  }
  return lines.join('\n')
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function ExportCsvButton(props: { rows: Product[]; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => download(`inventory_page_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(props.rows))}
      className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm font-medium text-slate-200 disabled:opacity-40"
    >
      Export CSV (page)
    </button>
  )
}
