import type { Product } from '../api/types'

function formatMoney(n: number) {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function InventoryTable(props: { rows: Product[]; isLoading: boolean; error: string | null }) {
  return (
    <div className="w-full overflow-auto">
      <table className="min-w-full border-separate border-spacing-0">
        <thead className="sticky top-0 bg-slate-950">
          <tr>
            {[
              'Product',
              'SKU',
              'Category',
              'Price',
              'Cost',
              'Stock',
              'Reorder',
              'Updated'
            ].map((h) => (
              <th
                key={h}
                className="border-b border-slate-800 px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-slate-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {props.isLoading ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-400" colSpan={8}>
                Loading inventory…
              </td>
            </tr>
          ) : props.error ? (
            <tr>
              <td className="px-4 py-6 text-sm text-red-300" colSpan={8}>
                {props.error}
              </td>
            </tr>
          ) : props.rows.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-400" colSpan={8}>
                No results.
              </td>
            </tr>
          ) : (
            props.rows.map((p) => (
              <tr key={p._id} className="hover:bg-slate-900/40">
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-100">
                  <div className="font-medium">{p.productName}</div>
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{p.sku}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-300">{p.category}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-200">{formatMoney(p.price)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-400">{formatMoney(p.cost)}</td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-200">
                  {p.stockQuantity.toLocaleString()}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-400">
                  {p.reorderLevel.toLocaleString()}
                </td>
                <td className="border-b border-slate-800 px-4 py-3 text-sm text-slate-400">
                  {new Date(p.lastUpdated).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
