import { Ban, CalendarCheck, CheckCircle2, Eraser, Tag, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookingStatusBadge, PageHeader, Panel } from '../../components/admin/AdminUI'
import { Calendar } from '../../components/Calendar'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useMoney } from '../../hooks/useMoney'
import type { ISODate } from '../../types'
import { dayState, holdsDates } from '../../utils/availability'
import { addDays, formatDate, parseISODate, today } from '../../utils/dates'
import { classNames } from '../../utils/format'
import { nightlyRate } from '../../utils/pricing'

export function AdminCalendar() {
  const { properties, overrides, bookings, applyDates } = useData()
  const [params, setParams] = useSearchParams()
  const money = useMoney()
  const toast = useToast()
  const propertyId = params.get('property') ?? properties[0]?.id ?? ''
  const property = properties.find((p) => p.id === propertyId)
  const [selected, setSelected] = useState<ISODate[]>([])
  const [anchor, setAnchor] = useState<ISODate | null>(null)
  const [price, setPrice] = useState('')
  const [busy, setBusy] = useState(false)

  const heldBy = useMemo(() => {
    const map = new Map<ISODate, string>()
    for (const b of bookings) {
      if (b.propertyId !== propertyId || !holdsDates(b)) continue
      for (let d = b.checkIn; d < b.checkOut; d = addDays(d, 1)) map.set(d, b.reference)
    }
    return map
  }, [bookings, propertyId])

  if (!property) return <EmptyState title="No properties yet" body="Add a property first, then manage its calendar here." action={<Link to="/admin/properties/new" className="font-semibold text-forest underline">Add property</Link>} />

  const click = (d: ISODate, e: React.MouseEvent) => {
    if (e.shiftKey && anchor) {
      const [a, b] = anchor < d ? [anchor, d] : [d, anchor]
      const range: ISODate[] = []
      for (let x = a; x <= b; x = addDays(x, 1)) range.push(x)
      setSelected((s) => [...new Set([...s, ...range])])
    } else {
      setSelected((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))
      setAnchor(d)
    }
  }

  const apply = async (change: Parameters<typeof applyDates>[2], msg: string) => {
    if (!selected.length) return
    const held = selected.filter((d) => heldBy.has(d))
    if (held.length && (change.status === 'available' || change.status === 'blocked')) {
      toast(`${held.length} selected night(s) belong to a confirmed booking. Cancel or change the booking in Bookings first.`, 'error')
      return
    }
    setBusy(true)
    await applyDates(property.id, selected, change)
    setBusy(false)
    toast(msg)
    setSelected([])
    setPrice('')
  }

  const upcoming = bookings.filter((b) => b.propertyId === property.id && b.checkOut >= today() && b.status !== 'cancelled').sort((a, b) => a.checkIn.localeCompare(b.checkIn))
  const sorted = [...selected].sort()

  return (
    <>
      <PageHeader title="Availability" subtitle="Tap dates to select them (on a computer, hold Shift to select a range), then choose an action." />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {properties.map((p) => (
          <button key={p.id} onClick={() => { setParams({ property: p.id }); setSelected([]) }} className={classNames('rounded-full px-4 py-2 text-sm font-medium transition', p.id === property.id ? 'bg-forest text-ivory' : 'bg-white text-ink/70 ring-1 ring-line hover:ring-forest/40')}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel>
          <Calendar
            key={property.id}
            dense
            onDayClick={click}
            dayInfo={(d) => {
              const s = dayState(property.id, d, overrides, bookings)
              const o = overrides.find((x) => x.propertyId === property.id && x.date === d)
              const rate = nightlyRate(property, d, overrides)
              const isSel = selected.includes(d)
              const ref = heldBy.get(d)
              return {
                disabled: s === 'past',
                title: ref ? `Booking ${ref}` : s === 'blocked' ? `Blocked${o?.note ? `: ${o.note}` : ''}` : s === 'booked' ? 'Marked booked' : `${rate.reason}`,
                className: classNames(
                  'rounded-xl border text-xs !h-14 sm:!h-16',
                  s === 'past' && 'cursor-not-allowed border-transparent text-muted/40',
                  s === 'available' && 'border-line bg-white hover:border-forest',
                  s === 'blocked' && 'border-[#e2c2b8] bg-[repeating-linear-gradient(135deg,#f5e1dc,#f5e1dc_4px,#fbefeb_4px,#fbefeb_8px)] text-[#9a3b27]',
                  s === 'booked' && 'border-[#bcd2bf] bg-[#e3ecdf] text-[#2f5a37]',
                  isSel && '!border-accent ring-2 ring-accent',
                ),
                content: (
                  <>
                    <span className="text-sm font-semibold">{parseISODate(d).getDate()}</span>
                    {s !== 'past' && (
                      <span className={classNames('mt-0.5 hidden text-[10px] leading-none sm:block', o?.price ? 'font-bold text-accent-dark' : 'text-muted')}>
                        {s === 'booked' ? (ref ? ref.replace('BK-', '') : 'Booked') : s === 'blocked' ? 'Blocked' : money(rate.price).replace(/\.00$/, '')}
                      </span>
                    )}
                  </>
                ),
              }
            }}
          />
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink/70">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded border border-line bg-white" /> Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#e3ecdf]" /> Booked</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[#f5e1dc]" /> Blocked</span>
            <span className="flex items-center gap-2"><span className="font-bold text-accent-dark">Bold</span> Special price</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded ring-2 ring-accent" /> Selected</span>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={`Selected: ${selected.length} night${selected.length === 1 ? '' : 's'}`} action={selected.length > 0 && <button onClick={() => setSelected([])} className="flex items-center gap-1 text-xs font-semibold text-muted hover:text-ink"><X className="h-3 w-3" /> Clear</button>}>
            {selected.length === 0 ? <p className="text-sm text-muted">Select one or more dates on the calendar.</p> : (
              <div className="space-y-3">
                <p className="text-xs text-muted">{sorted.length <= 4 ? sorted.map((d) => formatDate(d, { day: 'numeric', month: 'short' })).join(', ') : `${formatDate(sorted[0]!, { day: 'numeric', month: 'short' })} … ${formatDate(sorted.at(-1)!, { day: 'numeric', month: 'short' })}`}</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" disabled={busy} icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => apply({ status: 'available', note: '' }, 'Dates marked available')}>Mark available</Button>
                  <Button variant="outline" size="sm" disabled={busy} icon={<Ban className="h-4 w-4" />} onClick={() => apply({ status: 'blocked' }, 'Dates blocked')}>Block dates</Button>
                  <Button variant="outline" size="sm" disabled={busy} icon={<CalendarCheck className="h-4 w-4" />} onClick={() => apply({ status: 'booked' }, 'Dates marked as booked')}>Mark as booked (offline booking)</Button>
                </div>
                <div className="border-t border-line pt-3">
                  <label className="field-label" htmlFor="special">Special price per night</label>
                  <div className="flex gap-2">
                    <input id="special" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} className="field !py-2" placeholder={String(property.pricing.basePrice)} />
                    <Button size="sm" className="!h-[42px]" disabled={busy || !(Number(price) > 0)} icon={<Tag className="h-4 w-4" />} onClick={() => apply({ price: Number(price) }, 'Special price set')}>Set</Button>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2" disabled={busy} icon={<Eraser className="h-4 w-4" />} onClick={() => apply({ price: null }, 'Special price removed')}>Remove special price</Button>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Upcoming bookings" padded={false}>
            {upcoming.length === 0 ? <p className="p-5 text-sm text-muted">None yet.</p> : (
              <ul className="divide-y divide-line/70">
                {upcoming.map((b) => (
                  <li key={b.id}>
                    <Link to={`/admin/bookings?open=${b.id}`} className="block px-5 py-3 hover:bg-ivory">
                      <div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold">{b.guestName}</span><BookingStatusBadge status={b.status} /></div>
                      <div className="text-xs text-muted">{b.reference} · {formatDate(b.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(b.checkOut, { day: 'numeric', month: 'short' })}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <p className="text-xs leading-relaxed text-muted">Confirmed bookings hold their dates automatically. Pending enquiries don’t block the calendar until you confirm them.</p>
        </div>
      </div>
    </>
  )
}
