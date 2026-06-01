export function Pagination(props: {
  page: number
  totalPages: number
  hasNextPage: boolean
  onPageChange: (next: number) => void
}) {
  const canPrev = props.page > 1
  const canNext = props.hasNextPage

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-400">
        Page <span className="font-medium text-slate-200">{props.page}</span> of{' '}
        <span className="font-medium text-slate-200">{props.totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => props.onPageChange(1)}
          disabled={!canPrev}
          className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 disabled:opacity-40"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => props.onPageChange(props.page - 1)}
          disabled={!canPrev}
          className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => props.onPageChange(props.page + 1)}
          disabled={!canNext}
          className="h-9 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-200 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
