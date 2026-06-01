import type { ReactNode } from 'react'

export function KpiCard(props: { label: string; value: ReactNode; helper?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{props.label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">{props.value}</p>
      {props.helper ? <p className="mt-1 text-xs text-slate-500">{props.helper}</p> : null}
    </div>
  )
}
