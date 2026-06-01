import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { AnalyticsResponse } from '../api/types'

type Row = AnalyticsResponse['byCategory'][number]

export function CategoryValuationChart(props: { data: Row[]; isLoading: boolean }) {
  if (props.isLoading) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Loading…</div>
  }

  if (!props.data.length) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">No data yet.</div>
  }

  return (
    <div className="h-64 text-slate-400">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={props.data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
          <XAxis
            dataKey="category"
            stroke="currentColor"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <YAxis
            stroke="currentColor"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <Tooltip
            content={({ active, label, payload }) => {
              if (!active || !payload?.length) return null
              const raw = payload[0]?.value
              const n = typeof raw === 'number' ? raw : Number(raw)
              return (
                <div className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 shadow">
                  <div className="font-medium">{String(label)}</div>
                  <div className="mt-1 text-slate-300">Valuation: ${n.toLocaleString()}</div>
                </div>
              )
            }}
          />
          <Bar
            dataKey="totalValuation"
            fill="currentColor"
            className="text-sky-400"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
