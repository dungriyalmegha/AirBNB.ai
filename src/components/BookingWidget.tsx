import { AlertCircle, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useData } from '../context/DataContext'
import { useMoney } from '../hooks/useMoney'
import { useWhatsApp } from '../hooks/useWhatsApp'
import type { Property } from '../types'
import { airbnbLink } from '../utils/airbnb'
import { checkRange } from '../utils/availability'
import { addDays, formatDate, today } from '../utils/dates'
import { classNames } from '../utils/format'
import { fromPrice, quoteStay } from '../utils/pricing'
import { enquiryMessage } from '../utils/whatsapp'
import { Button, ButtonA } from './ui/Button'
import { Stepper } from './ui/Stepper'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

export interface Stay { checkIn: string; checkOut: string; adults: number; children: number }

/** Shared logic so the booking card, mobile bar and enquiry form agree on price and issues. */
export function useStayQuote(property: Property | undefined, stay: Stay) {
  const { overrides, bookings } = useData()
  const guests = stay.adults + stay.children
  if (!property) return { quote: null, issues: [] as string[], guests }
  const quote = quoteStay(property, stay.checkIn, stay.checkOut, guests, overrides)
  const issues: string[] = []
  if (stay.checkIn && stay.checkIn < today()) issues.push('Check-in can’t be in the past.')
  if (stay.checkIn && stay.checkOut && stay.checkOut <= stay.checkIn) issues.push('Check-out must be after check-in.')
  if (quote) {
    const range = checkRange(property.id, stay.checkIn, stay.checkOut, overrides, bookings)
    if (!range.ok) issues.push(`Not available on ${range.conflicts.slice(0, 3).map((d) => formatDate(d, { day: 'numeric', month: 'short' })).join(', ')}${range.conflicts.length > 3 ? '…' : ''}. Try other dates.`)
    if (quote.nights < property.pricing.minNights) issues.push(`Minimum stay is ${property.pricing.minNights} nights.`)
  }
  if (guests > property.maxGuests) issues.push(`This home sleeps up to ${property.maxGuests} guests.`)
  return { quote, issues, guests }
}

export function BookingWidget({ property, stay, onChange, onEnquire }: { property: Property; stay: Stay; onChange: (s: Stay) => void; onEnquire: () => void }) {
  const money = useMoney()
  const wa = useWhatsApp()
  const [guestsOpen, setGuestsOpen] = useState(false)
  const { quote, issues, guests } = useStayQuote(property, stay)

  const waMsg = enquiryMessage({
    propertyName: property.name,
    checkIn: stay.checkIn ? formatDate(stay.checkIn) : undefined,
    checkOut: stay.checkOut ? formatDate(stay.checkOut) : undefined,
    guests,
    estimate: quote && issues.length === 0 ? money(quote.total) : undefined,
  })

  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          {quote ? (
            <>
              <span className="text-2xl font-bold text-ink">{money(Math.round(quote.accommodation / quote.nights))}</span>
              <span className="text-sm text-muted"> / night avg.</span>
            </>
          ) : (
            <>
              <span className="text-sm text-muted">from </span>
              <span className="text-2xl font-bold text-ink">{money(fromPrice(property))}</span>
              <span className="text-sm text-muted"> / night</span>
            </>
          )}
        </div>
        {property.pricing.minNights > 1 && <span className="text-xs text-muted">Min. {property.pricing.minNights} nights</span>}
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line">
        <div className="grid grid-cols-2 divide-x divide-line">
          <label className="block px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">Check-in</span>
            <input
              type="date"
              min={today()}
              value={stay.checkIn}
              onChange={(e) => {
                const checkIn = e.target.value
                onChange({ ...stay, checkIn, checkOut: stay.checkOut && stay.checkOut > checkIn ? stay.checkOut : checkIn ? addDays(checkIn, Math.max(1, property.pricing.minNights)) : '' })
              }}
              className="mt-0.5 block w-full bg-transparent text-sm font-medium outline-none"
              aria-label="Check-in"
            />
          </label>
          <label className="block px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">Check-out</span>
            <input
              type="date"
              min={stay.checkIn ? addDays(stay.checkIn, 1) : addDays(today(), 1)}
              value={stay.checkOut}
              onChange={(e) => onChange({ ...stay, checkOut: e.target.value })}
              className="mt-0.5 block w-full bg-transparent text-sm font-medium outline-none"
              aria-label="Check-out"
            />
          </label>
        </div>
        <button type="button" onClick={() => setGuestsOpen((o) => !o)} className="flex w-full items-center justify-between border-t border-line px-4 py-3 text-left" aria-expanded={guestsOpen}>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-ink/70">Guests</span>
            <span className="text-sm font-medium">{stay.adults} adult{stay.adults > 1 ? 's' : ''}{stay.children ? `, ${stay.children} child${stay.children > 1 ? 'ren' : ''}` : ''}</span>
          </span>
          <ChevronDown className={classNames('h-4 w-4 transition', guestsOpen && 'rotate-180')} />
        </button>
        {guestsOpen && (
          <div className="border-t border-line px-4">
            <Stepper label="Adults" sub="Age 13+" value={stay.adults} min={1} max={property.maxGuests} onChange={(adults) => onChange({ ...stay, adults })} />
            <Stepper label="Children" sub="Ages 2–12" value={stay.children} min={0} max={Math.max(0, property.maxGuests - 1)} onChange={(children) => onChange({ ...stay, children })} />
            <p className="pb-3 text-xs text-muted">Sleeps up to {property.maxGuests}. Infants under 2 stay free.</p>
          </div>
        )}
      </div>

      {issues.length > 0 && (
        <div className="mt-4 space-y-1 rounded-2xl bg-[#f8ebe6] p-3 text-xs font-medium text-[#8e3624]" role="alert">
          {issues.map((m) => <p key={m} className="flex gap-2"><AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" />{m}</p>)}
        </div>
      )}

      <Button variant="primary" size="lg" full className="mt-5" onClick={onEnquire}>
        {stay.checkIn && stay.checkOut ? 'Enquire to book' : 'Check availability'}
      </Button>
      <ButtonA href={wa(waMsg)} target="_blank" rel="noopener noreferrer" variant="outline" size="md" full className="mt-2.5" icon={<WhatsAppIcon className="h-4 w-4 text-whatsapp" />}>
        Ask on WhatsApp
      </ButtonA>
      {property.airbnbUrl && (
        <ButtonA href={airbnbLink(property.airbnbUrl, stay)} target="_blank" rel="noopener noreferrer" variant="outline" size="md" full className="mt-2.5 !border-[#ff385c]/40 !text-[#d70466] hover:!bg-[#ff385c]/5" iconRight={<ExternalLink className="h-4 w-4" />}>
          Book instantly on Airbnb
        </ButtonA>
      )}
      <p className="mt-3 text-center text-xs text-muted">Enquiries are free. We’ll confirm availability with you first.</p>

      {quote && (
        <div className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
          {quote.lines.map((l) => (
            <div key={l.label} className="flex justify-between gap-4 text-ink/80">
              <span>{l.label}</span>
              <span className="tabular-nums">{money(l.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between gap-4 border-t border-line pt-3 text-base font-bold text-ink">
            <span>Estimated total</span>
            <span className="tabular-nums">{money(quote.total)}</span>
          </div>
          <details className="text-xs text-muted">
            <summary className="cursor-pointer select-none hover:text-forest">Nightly breakdown</summary>
            <ul className="mt-2 space-y-1">
              {quote.nightly.map((n) => (
                <li key={n.date} className="flex justify-between">
                  <span>{formatDate(n.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {n.reason}</span>
                  <span className="tabular-nums">{money(n.price)}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
      <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted"><ShieldCheck className="h-4 w-4 text-olive" /> Booked directly with the owner</p>
    </div>
  )
}
