import { ArrowRightLeft, Inbox, Mail, Phone, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { EnquiryStatusBadge, FilterTabs, PageHeader, Panel, enquiryStatusMeta } from '../../components/admin/AdminUI'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonA } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useMoney } from '../../hooks/useMoney'
import type { Enquiry, EnquiryStatus } from '../../types'
import { checkRange } from '../../utils/availability'
import { diffNights, formatDate, formatDateTime } from '../../utils/dates'
import { classNames } from '../../utils/format'
import { guestWhatsAppLink } from '../../utils/whatsapp'

const STATUSES = Object.keys(enquiryStatusMeta) as EnquiryStatus[]

export function AdminEnquiries() {
  const { enquiries } = useData()
  const money = useMoney()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<EnquiryStatus | 'all'>('all')
  const [q, setQ] = useState('')
  const openId = params.get('open')
  const open = enquiries.find((e) => e.id === openId)

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return [...enquiries]
      .filter((e) => filter === 'all' || e.status === filter)
      .filter((e) => !s || [e.fullName, e.phone, e.email, e.propertyName, e.reference].some((x) => x.toLowerCase().includes(s)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [enquiries, filter, q])

  const setOpen = (id: string | null) => {
    const next = new URLSearchParams(params)
    if (id) next.set('open', id)
    else next.delete('open')
    setParams(next, { replace: true })
  }

  return (
    <>
      <PageHeader title="Enquiries" subtitle={`${enquiries.filter((e) => e.status === 'new').length} new · ${enquiries.length} total`} />
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs value={filter} onChange={setFilter} options={[{ value: 'all', label: 'All', count: enquiries.length }, ...STATUSES.map((s) => ({ value: s, label: enquiryStatusMeta[s].label, count: enquiries.filter((e) => e.status === s).length }))]} />
        <label className="relative block lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, ref…" className="field !py-2.5 pl-10" aria-label="Search enquiries" />
        </label>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<Inbox className="h-6 w-6" />} title={enquiries.length ? 'No enquiries match' : 'No enquiries yet'} body={enquiries.length ? 'Try another filter or search.' : 'Enquiries from your website will appear here.'} />
      ) : (
        <Panel padded={false}>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line/70 text-left text-xs uppercase tracking-wider text-muted">
                  <th className="px-5 py-3 font-semibold">Guest</th>
                  <th className="px-5 py-3 font-semibold">Property</th>
                  <th className="px-5 py-3 font-semibold">Dates</th>
                  <th className="px-5 py-3 font-semibold">Guests</th>
                  <th className="px-5 py-3 text-right font-semibold">Estimate</th>
                  <th className="px-5 py-3 font-semibold">Received</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {list.map((e) => (
                  <tr key={e.id} onClick={() => setOpen(e.id)} className={classNames('cursor-pointer transition hover:bg-ivory', e.status === 'new' && 'bg-accent/[0.04]')}>
                    <td className="px-5 py-3.5">
                      <button className="text-left font-semibold hover:text-olive" onClick={(ev) => { ev.stopPropagation(); setOpen(e.id) }}>{e.fullName}</button>
                      <div className="text-xs text-muted">{e.phone}</div>
                    </td>
                    <td className="px-5 py-3.5">{e.propertyName}</td>
                    <td className="whitespace-nowrap px-5 py-3.5">{formatDate(e.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(e.checkOut, { day: 'numeric', month: 'short', year: '2-digit' })}</td>
                    <td className="px-5 py-3.5 tabular-nums">{e.adults + e.children}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{money(e.estimatedTotal)}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted">{formatDateTime(e.createdAt)}</td>
                    <td className="px-5 py-3.5"><EnquiryStatusBadge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile cards */}
          <ul className="divide-y divide-line/70 md:hidden">
            {list.map((e) => (
              <li key={e.id}>
                <button onClick={() => setOpen(e.id)} className="block w-full px-4 py-4 text-left">
                  <div className="flex items-center justify-between gap-2"><span className="font-semibold">{e.fullName}</span><EnquiryStatusBadge status={e.status} /></div>
                  <div className="mt-1 text-xs text-muted">{e.propertyName} · {formatDate(e.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(e.checkOut, { day: 'numeric', month: 'short' })} · {e.adults + e.children} guests</div>
                  <div className="mt-1 text-xs text-muted">{money(e.estimatedTotal)} · {formatDateTime(e.createdAt)}</div>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {open && <EnquiryDetail enquiry={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function EnquiryDetail({ enquiry: e, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  const { settings, bookings, overrides, setEnquiryStatus, addEnquiryNote, convertEnquiry, deleteEnquiry } = useData()
  const money = useMoney()
  const toast = useToast()
  const [note, setNote] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [busy, setBusy] = useState(false)
  const booking = e.bookingId ? bookings.find((b) => b.id === e.bookingId) : undefined
  const range = checkRange(e.propertyId, e.checkIn, e.checkOut, overrides, bookings, booking?.id)
  const nights = diffNights(e.checkIn, e.checkOut)

  const waMsg = `Hello ${e.fullName.split(' ')[0]}, thank you for your enquiry (${e.reference}) for ${e.propertyName}, ${formatDate(e.checkIn)} to ${formatDate(e.checkOut)}. `

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true)
    try {
      await fn()
      toast(ok)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal open onClose={onClose} size="lg" title={<span className="flex flex-wrap items-center gap-3">{e.fullName} <EnquiryStatusBadge status={e.status} /></span>}
      footer={<>
        <Button variant="ghost" className="mr-auto !text-[#a8432f]" icon={<Trash2 className="h-4 w-4" />} onClick={() => setConfirmDelete(true)}>Delete</Button>
        {booking ? (
          <Link to={`/admin/bookings?open=${booking.id}`} className="inline-flex h-11 items-center rounded-full bg-cream px-5 text-sm font-semibold text-forest hover:bg-sand">View booking {booking.reference}</Link>
        ) : (
          <Button disabled={busy || ['rejected', 'cancelled'].includes(e.status)} icon={<ArrowRightLeft className="h-4 w-4" />} onClick={() => run(() => convertEnquiry(e.id), 'Booking created as pending. Confirm it in Bookings.')}>Convert to booking</Button>
        )}
      </>}>
      <div className="grid gap-6 md:grid-cols-[1fr_240px]">
        <div className="space-y-5">
          <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-4 text-sm">
            <Item k="Reference" v={e.reference} />
            <Item k="Property" v={e.propertyName} />
            <Item k="Check-in" v={formatDate(e.checkIn)} />
            <Item k="Check-out" v={`${formatDate(e.checkOut)} (${nights} nights)`} />
            <Item k="Guests" v={`${e.adults} adults${e.children ? `, ${e.children} children` : ''}`} />
            <Item k="Estimated total" v={money(e.estimatedTotal)} />
            <Item k="Received" v={formatDateTime(e.createdAt)} />
            <Item k="Source" v={e.source === 'demo' ? <Badge>Demo data</Badge> : 'Website'} />
          </dl>
          {e.specialRequests && <div className="rounded-2xl bg-white p-4 text-sm"><div className="text-xs text-muted">Special requests</div><p className="mt-1 whitespace-pre-line">{e.specialRequests}</p></div>}
          {!booking && (
            <p className={classNames('rounded-2xl p-3 text-xs font-medium', range.ok ? 'bg-[#e3ecdf] text-[#2f5a37]' : 'bg-[#f8ebe6] text-[#8e3624]')}>
              {range.ok ? 'These dates are currently free in your calendar.' : `Dates conflict with your calendar (${range.conflicts.length} night${range.conflicts.length > 1 ? 's' : ''} unavailable).`}
            </p>
          )}

          <div>
            <h3 className="mb-2 text-sm font-semibold">Internal notes</h3>
            {e.notes.length === 0 ? <p className="text-xs text-muted">No notes yet. Only you can see these.</p> : (
              <ul className="space-y-2">
                {e.notes.map((n) => <li key={n.id} className="rounded-xl bg-white p-3 text-sm"><p className="whitespace-pre-line">{n.text}</p><p className="mt-1 text-[11px] text-muted">{formatDateTime(n.createdAt)}</p></li>)}
              </ul>
            )}
            <div className="mt-3 flex gap-2">
              <input value={note} onChange={(ev) => setNote(ev.target.value)} onKeyDown={(ev) => { if (ev.key === 'Enter' && note.trim()) { void run(() => addEnquiryNote(e.id, note.trim()), 'Note added'); setNote('') } }} placeholder="Add a note…" className="field !py-2.5" aria-label="New note" />
              <Button variant="outline" disabled={!note.trim() || busy} onClick={() => { void run(() => addEnquiryNote(e.id, note.trim()), 'Note added'); setNote('') }}>Add</Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="status" className="field-label">Status</label>
            <select id="status" value={e.status} disabled={busy} onChange={(ev) => run(() => setEnquiryStatus(e.id, ev.target.value as EnquiryStatus), 'Status updated')} className="field">
              {STATUSES.map((s) => <option key={s} value={s}>{enquiryStatusMeta[s].label}</option>)}
            </select>
            {booking && <p className="mt-1.5 text-[11px] text-muted">Confirming or cancelling the booking updates this automatically.</p>}
          </div>
          <div className="space-y-2 rounded-2xl bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">Contact guest</div>
            <ButtonA href={guestWhatsAppLink(e.phone, settings.whatsappNumber, waMsg)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="sm" full icon={<WhatsAppIcon className="h-4 w-4" />} onClick={() => e.status === 'new' && setEnquiryStatus(e.id, 'contacted')}>WhatsApp</ButtonA>
            <ButtonA href={`tel:${e.phone.replace(/\s/g, '')}`} variant="outline" size="sm" full icon={<Phone className="h-4 w-4" />}>{e.phone}</ButtonA>
            <ButtonA href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.reference} – ${e.propertyName}`)}`} variant="outline" size="sm" full icon={<Mail className="h-4 w-4" />}><span className="truncate">{e.email}</span></ButtonA>
            <p className="pt-1 text-[11px] text-muted">Opening WhatsApp on a “New” enquiry marks it “Contacted”.</p>
          </div>
        </div>
      </div>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} danger title="Delete enquiry?" confirmLabel="Delete" body={<>This permanently removes the enquiry from {e.fullName}.{booking && ' The linked booking is kept.'}</>}
        onConfirm={async () => { await deleteEnquiry(e.id); setConfirmDelete(false); onClose(); toast('Enquiry deleted') }} />
    </Modal>
  )
}

function Item({ k, v }: { k: string; v: React.ReactNode }) {
  return <div><dt className="text-xs text-muted">{k}</dt><dd className="mt-0.5 font-semibold">{v}</dd></div>
}
