import { CheckCircle2, Clock, Copy, Send } from 'lucide-react'
import { occasionLabel } from '../data/occasions'
import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useData, usePublishedProperties } from '../context/DataContext'
import { useToast } from '../context/ToastContext'
import { useMoney } from '../hooks/useMoney'
import { useWhatsApp } from '../hooks/useWhatsApp'
import type { Enquiry, Property } from '../types'
import { addDays, formatDate, today } from '../utils/dates'
import { isEmail, isPhone, validateStayDates } from '../utils/validation'
import { enquiryMessage } from '../utils/whatsapp'
import { planOptions, useStayQuote, type Stay } from './BookingWidget'
import { Button, ButtonA, ButtonLink } from './ui/Button'
import { SelectField, TextArea, TextField } from './ui/Field'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

interface Contact { fullName: string; phone: string; email: string; specialRequests: string }
type Errors = Partial<Record<keyof Contact | keyof Stay | 'propertyId', string>>

/**
 * Enquiry form. Dates, plan and group size can be controlled by a parent (property page)
 * so they stay in sync with the booking card.
 */
export function EnquiryForm({
  property: fixedProperty,
  stay: controlledStay,
  onStayChange,
  allowPropertyChange,
  onPropertyChange,
}: {
  property?: Property
  stay?: Stay
  onStayChange?: (s: Stay) => void
  allowPropertyChange?: boolean
  onPropertyChange?: (p: Property) => void
}) {
  const properties = usePublishedProperties()
  const { createEnquiry } = useData()
  const toast = useToast()
  const money = useMoney()
  const wa = useWhatsApp()

  const [propertyId, setPropertyId] = useState(fixedProperty?.id ?? '')
  useEffect(() => { if (fixedProperty) setPropertyId(fixedProperty.id) }, [fixedProperty])
  const property = properties.find((p) => p.id === propertyId)

  const [localStay, setLocalStay] = useState<Stay>({ checkIn: '', checkOut: '', people: 10, occasion: '' })
  const stay = controlledStay ?? localStay
  const setStay = (s: Stay) => (onStayChange ? onStayChange(s) : setLocalStay(s))

  const [c, setC] = useState<Contact>({ fullName: '', phone: '', email: '', specialRequests: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<Enquiry | null>(null)

  const quoteState = useStayQuote(property, stay)
  const quote = quoteState.quote

  if (!properties.length) return <p className="text-sm text-muted">No properties are open for enquiries right now.</p>

  const validate = (): Errors => {
    const e: Errors = {}
    if (!property) e.propertyId = 'Choose a property'
    if (c.fullName.trim().length < 2) e.fullName = 'Please enter your full name'
    if (!isPhone(c.phone)) e.phone = 'Enter a valid mobile number with country code'
    if (!isEmail(c.email)) e.email = 'Enter a valid email address'
    Object.assign(e, validateStayDates(stay.checkIn, stay.checkOut))
    if (!stay.occasion) e.occasion = 'Tell us what you’re planning'
    if (!(stay.people >= 1)) e.people = 'How many people are coming?'
    else if (property && stay.people > property.partyCapacity) e.people = `${property.name} fits up to ${property.partyCapacity} people`
    else if (property && stay.occasion === 'Staycation' && stay.people > property.maxGuests) e.people = `For an overnight stay, ${property.name} sleeps up to ${property.maxGuests}`
    if (property && !e.checkIn && !e.checkOut && quoteState.issues.length) e.checkOut = quoteState.issues[0]
    return e
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    setBusy(true)
    try {
      const enquiry = await createEnquiry({
        propertyId: property!.id,
        propertyName: property!.name,
        fullName: c.fullName.trim(),
        phone: c.phone.trim(),
        email: c.email.trim(),
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        occasion: stay.occasion,
        groupSize: stay.people,
        specialRequests: c.specialRequests.trim(),
        estimatedTotal: quote?.total ?? 0,
      })
      setDone(enquiry)
      window.scrollTo({ top: (document.getElementById('enquiry-form')?.offsetTop ?? 0) - 100, behavior: 'smooth' })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Something went wrong. Please try WhatsApp instead.', 'error')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    const msg = enquiryMessage({
      propertyName: done.propertyName,
      reference: done.reference,
      name: done.fullName,
      phone: done.phone,
      checkIn: formatDate(done.checkIn),
      checkOut: formatDate(done.checkOut),
      occasion: done.occasion || undefined,
      people: done.groupSize,
      estimate: done.estimatedTotal ? money(done.estimatedTotal) : undefined,
      requests: done.specialRequests || undefined,
    })
    return (
      <div id="enquiry-form" className="animate-fade-up rounded-3xl bg-white p-6 shadow-soft sm:p-8" role="status">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3ecdf] text-[#2f5a37]"><CheckCircle2 className="h-7 w-7" /></div>
        <h3 className="mt-5 font-display text-3xl font-semibold text-forest">Thank you, {done.fullName.split(' ')[0]}. Your enquiry is in.</h3>
        <p className="mt-3 text-ink/75">
          We’ve saved your request for <strong>{done.propertyName}</strong>. <strong>This is not a confirmed booking yet</strong>: we’ll check the dates and get back to you with availability and payment details.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-ivory p-5 text-sm sm:grid-cols-4">
          <div><dt className="text-xs text-muted">Reference</dt><dd className="mt-1 font-semibold">{done.reference}</dd></div>
          <div><dt className="text-xs text-muted">Dates</dt><dd className="mt-1 font-semibold">{formatDate(done.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(done.checkOut, { day: 'numeric', month: 'short' })}</dd></div>
          <div><dt className="text-xs text-muted">Plan</dt><dd className="mt-1 font-semibold">{occasionLabel(done.occasion)} · {done.groupSize} people</dd></div>
          <div><dt className="text-xs text-muted">Estimate</dt><dd className="mt-1 font-semibold">{done.estimatedTotal ? money(done.estimatedTotal) : '—'}</dd></div>
        </dl>
        <p className="mt-4 flex items-center gap-2 text-sm text-[#8a5a14]"><Clock className="h-4 w-4" /> Status: pending owner confirmation</p>

        <div className="mt-6 rounded-2xl border border-whatsapp/25 bg-[#eef7f1] p-5">
          <p className="text-sm font-semibold text-ink">Want a faster reply? Send these details on WhatsApp.</p>
          <p className="mt-1 text-xs text-muted">We’ve written the message for you. WhatsApp opens with it ready; just tap send.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <ButtonA href={wa(msg)} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" icon={<WhatsAppIcon />}>Send on WhatsApp</ButtonA>
            <Button variant="ghost" icon={<Copy className="h-4 w-4" />} onClick={() => navigator.clipboard?.writeText(msg).then(() => toast('Message copied'))}>Copy message</Button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink to="/stays" variant="outline">Browse other stays</ButtonLink>
          <Button variant="ghost" onClick={() => { setDone(null); setC({ fullName: '', phone: '', email: '', specialRequests: '' }) }}>Send another enquiry</Button>
        </div>
      </div>
    )
  }

  const set = (k: keyof Contact) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setC({ ...c, [k]: e.target.value })

  return (
    <form id="enquiry-form" onSubmit={submit} noValidate className="rounded-3xl bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id="fullName" label="Full name" autoComplete="name" value={c.fullName} onChange={set('fullName')} error={errors.fullName} placeholder="Your name" />
        <TextField id="phone" label="Mobile number" type="tel" autoComplete="tel" inputMode="tel" value={c.phone} onChange={set('phone')} error={errors.phone} placeholder="+91 98765 43210" hint="We’ll reply on WhatsApp or call" />
        <TextField id="email" label="Email address" type="email" autoComplete="email" value={c.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" className="sm:col-span-2" />

        {allowPropertyChange || !fixedProperty ? (
          <SelectField
            id="propertyId"
            label="Property"
            value={propertyId}
            onChange={(e) => {
              setPropertyId(e.target.value)
              const p = properties.find((x) => x.id === e.target.value)
              if (p) onPropertyChange?.(p)
            }}
            error={errors.propertyId}
            className="sm:col-span-2"
          >
            <option value="">Choose a place…</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.region} · up to {p.partyCapacity} people</option>)}
          </SelectField>
        ) : (
          <div className="sm:col-span-2">
            <span className="field-label">Property</span>
            <div className="field bg-ivory">{fixedProperty.name}, {fixedProperty.location}</div>
          </div>
        )}

        <TextField
          id="checkIn" label="Check-in" type="date" min={today()} value={stay.checkIn} error={errors.checkIn}
          onChange={(e) => {
            const checkIn = e.target.value
            setStay({ ...stay, checkIn, checkOut: stay.checkOut && stay.checkOut > checkIn ? stay.checkOut : checkIn ? addDays(checkIn, Math.max(1, property?.pricing.minNights ?? 1)) : '' })
          }}
        />
        <TextField id="checkOut" label="Check-out" type="date" min={stay.checkIn ? addDays(stay.checkIn, 1) : addDays(today(), 1)} value={stay.checkOut} error={errors.checkOut} onChange={(e) => setStay({ ...stay, checkOut: e.target.value })} />

        <SelectField id="occasion" label="What’s the plan?" value={stay.occasion} error={errors.occasion} onChange={(e) => setStay({ ...stay, occasion: e.target.value })}>
          <option value="">Choose one…</option>
          {planOptions(property).map((o) => <option key={o} value={o}>{occasionLabel(o)}</option>)}
        </SelectField>
        <TextField
          id="people" label="How many people?" type="number" inputMode="numeric" min={1} max={property?.partyCapacity}
          value={stay.people || ''} error={errors.people}
          hint={property ? `Up to ${property.partyCapacity} for a gathering · sleeps ${property.maxGuests}` : 'Rough headcount is fine'}
          onChange={(e) => setStay({ ...stay, people: Math.max(0, Math.round(Number(e.target.value) || 0)) })}
        />

        <TextArea id="specialRequests" label={<>Special requests <span className="font-normal normal-case tracking-normal text-muted">(optional)</span></>} value={c.specialRequests} onChange={set('specialRequests')} placeholder="Tell us about the plan: decor, cake, music, arrival time…" className="sm:col-span-2" maxLength={1000} />
      </div>

      {quote && quoteState.issues.length === 0 && (
        <div className="mt-6 rounded-2xl bg-ivory p-5 text-sm">
          {quote.lines.map((l) => (
            <div key={l.label} className="flex justify-between py-1 text-ink/75"><span>{l.label}</span><span className="tabular-nums">{money(l.amount)}</span></div>
          ))}
          <div className="mt-2 flex justify-between border-t border-line pt-3 text-base font-bold"><span>Estimated total</span><span className="tabular-nums">{money(quote.total)}</span></div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted sm:max-w-xs">
          Sending an enquiry doesn’t confirm a booking or take payment. See our <Link to="/policies#booking" className="link-underline">booking policy</Link>.
        </p>
        <Button type="submit" variant="primary" size="lg" disabled={busy} icon={<Send className="h-4 w-4" />}>
          {busy ? 'Sending…' : 'Send enquiry'}
        </Button>
      </div>
    </form>
  )
}
