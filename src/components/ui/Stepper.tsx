import { Minus, Plus } from 'lucide-react'

export function Stepper({ value, onChange, min = 0, max = 20, label, sub }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        {sub && <div className="text-xs text-muted">{sub}</div>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition hover:border-forest disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-forest transition hover:border-forest disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
