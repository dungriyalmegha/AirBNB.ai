import { Ban, Calculator, CheckCircle2, Flag, NotebookTabs, Pencil, Plus, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookingStatusBadge, FilterTabs, PageHeader, bookingStatusMeta } from '../../components/admin/AdminUI'
import { Button, ButtonA } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { Modal } from '../../components/ui/Modal'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useMoney } from '../../hooks/useMoney'
import type { Booking, BookingStatus, PriceLine } from '../../types'
import { addDays, diffNights, formatDate, formatDateTime, today } from '../../utils/dates'
import { quoteStay } from '../../utils/pricing'
import { isEmail, isPhone } from '../../utils/validation'
import { guestWhatsAppLink } from '../../utils/whatsapp'

const STATUSES = Object.keys(bookingStatusMeta) as BookingStatus[]

export function AdminBookings() {
  const { bookings } = useData()
  const money = useMoney()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<BookingStatus | 'all' | 'upcoming'>('all')
  const [q, setQ] = useState('')
  const [creating, setCreating] = useState(false)
  const open = bookings.find((b) => b.id === params.get('open'))

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return [...bookings]
      .filter((b) => (filter === 'all' ? true : filter === 'upcoming' ? b.checkOut >= today() && b.status !== 'cancelled' : b.status === filter))
      .filter((b) => !s || [b.guestName, b.reference, b.phone, b.propertyName].some((x) => x.toLowerCase().includes(s)))
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
  }, [bookings, filter, q])

  const setOpen = (id: string | null) => {
    const next = new URLSearchParams(params)
    if (id) next.set('open', id)
    else next.delete('open')
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHeader title="Bookings" subtitle="Confirmed bookings hold their dates in the calendar. Overlapping confirmed bookings are blocked." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>Add booking</Button>} />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs value={filter} onChange={setFilter} options={[
          { value: 'all', label: 'All', count: bookings.length },
          { value: 'upcoming', label: 'Upcoming', count: bookings.filter((b) => b.checkOut >= today() && b.status !== 'cancelled').length },
          ...STATUSES.map((s) => ({ value: s, label: bookingStatusMeta[s].label, count: bookings.filter((b) => b.status === s).length })),
        ]} />
        <label className="relative block lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guest, ref…" className="field !py-2.5 pl-10" aria-label="Search bookings" />
        </label>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<NotebookTabs className="h-6 w-6" />} title="No bookings here" body="Convert an enquiry into a booking, or add one manually." />
      ) : (
        <div className="grid gap-3">
          {list.map((b) => (
            <button key={b.id} onClick={() => setOpen(b.id)} className="grid gap-3 rounded-2xl border border-line/70 bg-white p-4 text-left transition hover:border-forest/30 hover:shadow-soft sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-center">
              <div>
                <div className="flex items-center gap-2"><span className="font-semibold">{b.guestName}</span><span className="text-xs text-muted">{b.reference}</span></div>
                <div className="text-xs text-muted">{b.phone}</div>
              </div>
              <div className="text-sm">{b.propertyName}<div className="text-xs text-muted">{b.adults + b.children} guests</div></div>
              <div className="text-sm">{formatDate(b.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(b.checkOut, { day: 'numeric', month: 'short', year: 'numeric' })}<div className="text-xs text-muted">{diffNights(b.checkIn, b.checkOut)} nights · {money(b.total)}</div></div>
              <BookingStatusBadge status={b.status} />
            </button>
          ))}
        </div>
      )}

      {open && <BookingDetail booking={open} onClose={() => setOpen(null)} />}
      {creating && <BookingFormModal onClose={() => setCreating(false)} onSaved={(id) => { setCreating(false); setOpen(id) }} />}
    </>
  )
}

function BookingDetail({ booking: b, onClose }: { booking: Booking; onClose: () => void }) {
  const { settings, setBookingStatus } = useData()
  const money = useMoney()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)

  const status = async (s: BookingStatus, ok: string) => {
    setBusy(true)
    try {
      await setBookingStatus(b.id, s)
      toast(ok)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not update', 'error')
    } finally {
      setBusy(false)
    }
  }

  if (editing) return <BookingFormModal booking={b} onClose={() => setEditing(false)} onSaved={() => setEditing(false)} />

  const waMsg = `Hello ${b.guestName.split(' ')[0]}, your stay at ${b.propertyName} (${b.reference}) from ${formatDate(b.checkIn)} to ${formatDate(b.checkOut)} is ${b.status === 'confirmed' ? 'confirmed' : bookingStatusMeta[b.status].label.toLowerCase()}. `
  return (
    <Modal open onClose={onClose} size="lg" title={<span className="flex flex-wrap items-center gap-3">{b.reference} <BookingStatusBadge status={b.status} /></span>}
      footer={<>
        <Button variant="ghost" icon={<Pencil className="h-4 w-4" />} className="mr-auto" onClick={() => setEditing(true)}>Modify</Button>
        {b.status === 'pending' && <Button variant="danger" disabled={busy} icon={<Ban className="h-4 w-4" />} onClick={() => status('cancelled', 'Booking cancelled')}>Cancel</Button>}
        {b.status === 'pending' && <Button disabled={busy} icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => status('confirmed', 'Booking confirmed. Dates are now blocked.')}>Confirm booking</Button>}
        {b.status === 'confirmed' && <Button variant="danger" disabled={busy} icon={<Ban className="h-4 w-4" />} onClick={() => status('cancelled', 'Booking cancelled. Dates released.')}>Cancel booking</Button>}
        {b.status === 'confirmed' && b.checkOut <= today() && <Button disabled={busy} icon={<Flag className="h-4 w-4" />} onClick={() => status('completed', 'Marked completed')}>Mark completed</Button>}
        {(b.status === 'cancelled' || b.status === 'completed') && <Button variant="outline" disabled={busy} icon={<RotateCcw className="h-4 w-4" />} onClick={() => status('pending', 'Moved back to pending')}>Reopen as pending</Button>}
      </>}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Guest</div>
            <div className="mt-2 font-semibold">{b.guestName}</div>
            <div className="text-ink/75">{b.phone}</div>
            <div className="text-ink/75">{b.email}</div>
            <ButtonA href={guestWhatsAppLink(b.phone, settings.whatsappNumber, waMsg)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="sm" className="mt-3" icon={<WhatsAppIcon className="h-4 w-4" />}>Message on WhatsApp</ButtonA>
          </div>
          <div className="rounded-2xl bg-white p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Stay</div>
            <div className="mt-2 font-semibold">{b.propertyName}</div>
            <div className="text-ink/75">{formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {diffNights(b.checkIn, b.checkOut)} nights</div>
            <div className="text-ink/75">{b.adults} adults{b.children ? `, ${b.children} children` : ''}</div>
          </div>
          {b.enquiryId && <Link to={`/admin/enquiries?open=${b.enquiryId}`} className="inline-block text-sm font-semibold text-forest underline underline-offset-4">View original enquiry</Link>}
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Price breakdown</div>
            <div className="mt-2 space-y-1.5">
              {b.priceLines.map((l, i) => <div key={i} className="flex justify-between gap-3 text-ink/75"><span>{l.label}</span><span className="tabular-nums">{money(l.amount)}</span></div>)}
              <div className="flex justify-between border-t border-line pt-2 font-bold"><span>Total</span><span className="tabular-nums">{money(b.total)}</span></div>
            </div>
          </div>
          {b.notes && <div className="rounded-2xl bg-white p-4 text-sm"><div className="text-xs font-semibold uppercase tracking-wider text-muted">Notes</div><p className="mt-2 whitespace-pre-line">{b.notes}</p></div>}
          <p className="text-xs text-muted">Created {formatDateTime(b.createdAt)} · Updated {formatDateTime(b.updatedAt)}</p>
        </div>
      </div>
    </Modal>
  )
}

function BookingFormModal({ booking, onClose, onSaved }: { booking?: Booking; onClose: () => void; onSaved: (id: string) => void }) {
  const { properties, overrides, createBooking, updateBooking } = useData()
  const money = useMoney()
  const toast = useToast()
  const [f, setF] = useState({
    propertyId: booking?.propertyId ?? properties[0]?.id ?? '',
    guestName: booking?.guestName ?? '',
    phone: booking?.phone ?? '',
    email: booking?.email ?? '',
    checkIn: booking?.checkIn ?? '',
    checkOut: booking?.checkOut ?? '',
    adults: booking?.adults ?? 2,
    children: booking?.children ?? 0,
    status: booking?.status ?? ('confirmed' as BookingStatus),
    notes: booking?.notes ?? '',
    priceLines: booking?.priceLines ?? ([] as PriceLine[]),
    total: booking?.total ?? 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const property = properties.find((p) => p.id === f.propertyId)

  const recalc = () => {
    if (!property) return
    const q = quoteStay(property, f.checkIn, f.checkOut, f.adults + f.children, overrides)
    if (!q) return toast('Choose valid dates first', 'error')
    setF((s) => ({ ...s, priceLines: q.lines, total: q.total }))
  }

  const save = async () => {
    const e: Record<string, string> = {}
    if (!property) e.propertyId = 'Choose a property'
    if (f.guestName.trim().length < 2) e.guestName = 'Enter guest name'
    if (f.phone && !isPhone(f.phone)) e.phone = 'Invalid phone'
    if (f.email && !isEmail(f.email)) e.email = 'Invalid email'
    if (!f.checkIn) e.checkIn = 'Required'
    if (!f.checkOut || f.checkOut <= f.checkIn) e.checkOut = 'Must be after check-in'
    if (property && f.adults + f.children > property.maxGuests) e.adults = `Max ${property.maxGuests} guests`
    setErrors(e)
    if (Object.keys(e).length) return
    let { priceLines, total } = f
    if (!priceLines.length && property) {
      const q = quoteStay(property, f.checkIn, f.checkOut, f.adults + f.children, overrides)
      if (q) { priceLines = q.lines; total = q.total }
    }
    const data = { ...f, priceLines, total, propertyName: property!.name, guestName: f.guestName.trim() }
    setBusy(true)
    try {
      if (booking) {
        await updateBooking(booking.id, data)
        toast('Booking updated')
        onSaved(booking.id)
      } else {
        const created = await createBooking(data)
        toast('Booking added')
        onSaved(created.id)
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error')
    } finally {
      setBusy(false)
    }
  }

  const n = (v: string) => Math.max(0, Number(v) || 0)
  return (
    <Modal open onClose={onClose} size="lg" title={booking ? `Modify ${booking.reference}` : 'Add booking'}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save booking'}</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="b-prop" label="Property" value={f.propertyId} error={errors.propertyId} onChange={(e) => setF({ ...f, propertyId: e.target.value, priceLines: [], total: 0 })} className="sm:col-span-2">
          {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </SelectField>
        <TextField id="b-name" label="Guest name" value={f.guestName} error={errors.guestName} onChange={(e) => setF({ ...f, guestName: e.target.value })} />
        <TextField id="b-phone" label="Phone" value={f.phone} error={errors.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        <TextField id="b-email" label="Email" value={f.email} error={errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="sm:col-span-2" />
        <TextField id="b-in" label="Check-in" type="date" value={f.checkIn} error={errors.checkIn} onChange={(e) => setF({ ...f, checkIn: e.target.value, checkOut: f.checkOut > e.target.value ? f.checkOut : addDays(e.target.value, 1), priceLines: [] })} />
        <TextField id="b-out" label="Check-out" type="date" min={f.checkIn ? addDays(f.checkIn, 1) : undefined} value={f.checkOut} error={errors.checkOut} onChange={(e) => setF({ ...f, checkOut: e.target.value, priceLines: [] })} />
        <TextField id="b-adults" label="Adults" type="number" min={1} value={f.adults} error={errors.adults} onChange={(e) => setF({ ...f, adults: Math.max(1, n(e.target.value)), priceLines: [] })} />
        <TextField id="b-children" label="Children" type="number" min={0} value={f.children} onChange={(e) => setF({ ...f, children: n(e.target.value), priceLines: [] })} />
        <SelectField id="b-status" label="Status" value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as BookingStatus })}>
          {STATUSES.map((s) => <option key={s} value={s}>{bookingStatusMeta[s].label}</option>)}
        </SelectField>
        <TextField id="b-total" label="Total amount" type="number" min={0} value={f.total || ''} onChange={(e) => setF({ ...f, total: n(e.target.value), priceLines: [{ label: 'Agreed total', amount: n(e.target.value) }] })} hint="Edit to override, or recalculate" />
        <div className="sm:col-span-2 rounded-2xl bg-white p-4 text-sm">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted">Price breakdown</span><Button size="sm" variant="secondary" icon={<Calculator className="h-4 w-4" />} onClick={recalc}>Recalculate from rates</Button></div>
          {f.priceLines.length === 0 ? <p className="text-xs text-muted">Will be calculated from the property’s rates when you save.</p> : f.priceLines.map((l, i) => <div key={i} className="flex justify-between text-ink/75"><span>{l.label}</span><span>{money(l.amount)}</span></div>)}
        </div>
        <TextArea id="b-notes" label="Notes" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} className="sm:col-span-2" />
      </div>
    </Modal>
  )
}
