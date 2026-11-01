import type { ReactNode } from 'react'
import type { BookingStatus, EnquiryStatus } from '../../types'
import { classNames } from '../../utils/format'
import { Badge, type Tone } from '../ui/Badge'

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-semibold text-forest">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Panel({ title, action, children, className, padded = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={classNames('rounded-2xl border border-line/70 bg-white', className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-line/70 px-5 py-4">
          <h2 className="font-sans text-sm font-semibold tracking-normal text-ink">{title}</h2>
          {action}
        </div>
      )}
      <div className={padded ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

export function StatCard({ label, value, hint, icon, tone = 'default' }: { label: string; value: ReactNode; hint?: ReactNode; icon: ReactNode; tone?: 'default' | 'accent' | 'green' | 'amber' | 'red' }) {
  const tones = {
    default: 'bg-cream text-forest',
    accent: 'bg-accent/15 text-accent-dark',
    green: 'bg-[#e3ecdf] text-[#2f5a37]',
    amber: 'bg-[#f6ead3] text-[#8a5a14]',
    red: 'bg-[#f5e1dc] text-[#9a3b27]',
  }
  return (
    <div className="rounded-2xl border border-line/70 bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
        <span className={classNames('flex h-9 w-9 items-center justify-center rounded-xl', tones[tone])}>{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-bold tabular-nums text-ink">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  )
}

export const enquiryStatusMeta: Record<EnquiryStatus, { label: string; tone: Tone }> = {
  new: { label: 'New', tone: 'accent' },
  contacted: { label: 'Contacted', tone: 'blue' },
  pending: { label: 'Pending', tone: 'amber' },
  confirmed: { label: 'Confirmed', tone: 'green' },
  rejected: { label: 'Rejected', tone: 'neutral' },
  cancelled: { label: 'Cancelled', tone: 'red' },
}

export const bookingStatusMeta: Record<BookingStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'amber' },
  confirmed: { label: 'Confirmed', tone: 'green' },
  cancelled: { label: 'Cancelled', tone: 'red' },
  completed: { label: 'Completed', tone: 'blue' },
}

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  const m = enquiryStatusMeta[status]
  return <Badge tone={m.tone} dot>{m.label}</Badge>
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const m = bookingStatusMeta[status]
  return <Badge tone={m.tone} dot>{m.label}</Badge>
}

/** Simple horizontal tabs used for status filters. */
export function FilterTabs<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[] }) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={classNames('shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition', value === o.value ? 'bg-forest text-ivory' : 'bg-white text-ink/70 ring-1 ring-line hover:ring-forest/40')}
        >
          {o.label}
          {o.count !== undefined && <span className={classNames('ml-1.5 text-xs', value === o.value ? 'text-ivory/70' : 'text-muted')}>{o.count}</span>}
        </button>
      ))}
    </div>
  )
}
