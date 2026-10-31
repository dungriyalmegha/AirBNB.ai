import { Bath, BedDouble, ChevronRight, Clock, DoorOpen, Home, Landmark, MapPin, ScrollText, Share2, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { AmenityIcon } from '../../components/AmenityIcon'
import { AvailabilityCalendar } from '../../components/AvailabilityCalendar'
import { BookingWidget, useStayQuote, type Stay } from '../../components/BookingWidget'
import { EnquiryForm } from '../../components/EnquiryForm'
import { Gallery } from '../../components/Gallery'
import { PropertyCard } from '../../components/PropertyCard'
import { ButtonA, ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { Modal } from '../../components/ui/Modal'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData, usePublishedProperties } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMoney } from '../../hooks/useMoney'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { formatDate, formatTime } from '../../utils/dates'
import { fromPrice } from '../../utils/pricing'
import { enquiryMessage } from '../../utils/whatsapp'

export function PropertyDetailsPage() {
  const { slug } = useParams()
  // Remount per property so date/guest state resets when moving between stays.
  return <PropertyDetails key={slug} slug={slug ?? ''} />
}

function PropertyDetails({ slug }: { slug: string }) {
  const [params] = useSearchParams()
  const properties = usePublishedProperties()
  const { settings } = useData()
  const property = properties.find((p) => p.slug === slug)
  useDocumentTitle(property?.name ?? 'Stay not found')
  const money = useMoney()
  const wa = useWhatsApp()
  const toast = useToast()
  const [amenitiesOpen, setAmenitiesOpen] = useState(false)

  const guestsParam = Number(params.get('guests') ?? 2)
  const [stay, setStay] = useState<Stay>({
    checkIn: params.get('in') ?? '',
    checkOut: params.get('out') ?? '',
    adults: Math.max(1, Math.min(guestsParam || 2, property?.maxGuests ?? 2)),
    children: 0,
  })
  const { quote, issues, guests } = useStayQuote(property, stay)

  if (!property) {
    return (
      <div className="container-page pb-10 pt-36">
        <EmptyState icon={<Home className="h-6 w-6" />} title="We couldn’t find that stay" body="It may have been renamed or is no longer listed." action={<ButtonLink to="/stays">See all stays</ButtonLink>} />
      </div>
    )
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const onEnquire = () => scrollTo(stay.checkIn && stay.checkOut ? 'enquire' : 'availability')
  const share = async () => {
    const data = { title: property.name, text: property.tagline, url: window.location.href.split('?')[0] }
    try {
      if (navigator.share) await navigator.share(data)
      else {
        await navigator.clipboard.writeText(data.url!)
        toast('Link copied')
      }
    } catch { /* user cancelled */ }
  }
  const waMsg = enquiryMessage({
    propertyName: property.name,
    checkIn: stay.checkIn ? formatDate(stay.checkIn) : undefined,
    checkOut: stay.checkOut ? formatDate(stay.checkOut) : undefined,
    guests,
    estimate: quote && !issues.length ? money(quote.total) : undefined,
  })
  const p = property.pricing
  const others = properties.filter((x) => x.id !== property.id).slice(0, 3)

  return (
    <div className="pb-28 pt-24 lg:pb-0">
      <div className="container-page">
        <nav className="flex items-center gap-1.5 py-4 text-xs text-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-forest">Home</Link><ChevronRight className="h-3 w-3" />
          <Link to="/stays" className="hover:text-forest">Stays</Link><ChevronRight className="h-3 w-3" />
          <span className="text-ink/70">{property.name}</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">{property.type} · {property.region}</p>
            <h1 className="font-display text-5xl font-semibold leading-none text-forest sm:text-6xl">{property.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-ink/70"><MapPin className="h-4 w-4 text-olive" /> {property.location}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={share} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-forest hover:bg-cream"><Share2 className="h-4 w-4" /> Share</button>
          </div>
        </div>

        <Gallery images={property.images} name={property.name} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
          <div className="min-w-0">
            {/* Overview */}
            <section className="border-b border-line pb-10">
              <h2 className="font-display text-3xl font-semibold text-forest">{property.tagline}</h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { Icon: Users, label: `${property.maxGuests} guests` },
                  { Icon: DoorOpen, label: `${property.bedrooms} bedrooms` },
                  { Icon: BedDouble, label: `${property.beds} beds` },
                  { Icon: Bath, label: `${property.bathrooms} bathrooms` },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <Icon className="h-5 w-5 text-olive" /><span className="text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
              <div className="prose-stay mt-8 leading-relaxed text-ink/80">
                {property.description.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
            </section>

            {/* Highlights */}
            {property.highlights.length > 0 && (
              <section className="border-b border-line py-10">
                <h2 className="font-display text-3xl font-semibold text-forest">What makes it special</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {property.highlights.map((h) => (
                    <li key={h} className="flex gap-3"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><span className="text-ink/80">{h}</span></li>
                  ))}
                </ul>
              </section>
            )}

            {/* Amenities */}
            <section className="border-b border-line py-10">
              <h2 className="font-display text-3xl font-semibold text-forest">Amenities</h2>
              <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                {property.amenities.slice(0, 9).map((a) => (
                  <li key={a} className="flex items-center gap-3 text-ink/80"><AmenityIcon name={a} className="h-5 w-5 text-olive" /> {a}</li>
                ))}
              </ul>
              {property.amenities.length > 9 && (
                <button onClick={() => setAmenitiesOpen(true)} className="mt-6 rounded-full border border-forest/25 px-5 py-2.5 text-sm font-semibold text-forest hover:border-forest">
                  Show all {property.amenities.length} amenities
                </button>
              )}
              <Modal open={amenitiesOpen} onClose={() => setAmenitiesOpen(false)} title="All amenities">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {property.amenities.map((a) => <li key={a} className="flex items-center gap-3"><AmenityIcon name={a} className="h-5 w-5 text-olive" /> {a}</li>)}
                </ul>
              </Modal>
            </section>

            {/* Availability */}
            <section id="availability" className="scroll-mt-28 border-b border-line py-10">
              <h2 className="font-display text-3xl font-semibold text-forest">Availability</h2>
              <p className="mt-2 text-sm text-muted">
                {stay.checkIn && stay.checkOut
                  ? `${formatDate(stay.checkIn)} – ${formatDate(stay.checkOut)}${quote ? ` · ${quote.nights} night${quote.nights > 1 ? 's' : ''}` : ''}`
                  : stay.checkIn ? 'Now choose your check-out date.' : 'Select your check-in date to see your price.'}
              </p>
              <div className="mt-6 rounded-3xl bg-white p-5 shadow-soft sm:p-7">
                <AvailabilityCalendar property={property} checkIn={stay.checkIn} checkOut={stay.checkOut} onChange={(checkIn, checkOut) => setStay({ ...stay, checkIn, checkOut })} />
              </div>
            </section>

            {/* Rules & timings */}
            <section className="grid gap-10 border-b border-line py-10 sm:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 font-display text-3xl font-semibold text-forest"><ScrollText className="h-6 w-6 text-olive" /> House rules</h2>
                <ul className="mt-5 space-y-3 text-ink/80">
                  {property.houseRules.map((r) => <li key={r} className="flex gap-3"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />{r}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="flex items-center gap-2 font-display text-3xl font-semibold text-forest"><Clock className="h-6 w-6 text-olive" /> Check-in & out</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white p-4 shadow-soft"><div className="text-xs text-muted">Check-in from</div><div className="mt-1 text-lg font-semibold">{formatTime(property.checkInTime)}</div></div>
                  <div className="rounded-2xl bg-white p-4 shadow-soft"><div className="text-xs text-muted">Check-out by</div><div className="mt-1 text-lg font-semibold">{formatTime(property.checkOutTime)}</div></div>
                </div>
                <p className="mt-4 text-sm text-muted">Early check-in or late check-out may be possible. Just ask.</p>
              </div>
            </section>

            {/* Location */}
            <section className="border-b border-line py-10">
              <h2 className="font-display text-3xl font-semibold text-forest">Where you’ll be</h2>
              <p className="mt-3 leading-relaxed text-ink/80">{property.locationInfo}</p>
              <div className="mt-6 overflow-hidden rounded-3xl bg-cream shadow-soft">
                <iframe
                  title={`Map of ${property.location}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.mapQuery || property.location)}&z=12&output=embed`}
                  className="h-72 w-full border-0 sm:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-2 text-xs text-muted">Exact address shared after your booking is confirmed.</p>
              {property.nearby.length > 0 && (
                <>
                  <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">Nearby attractions</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {property.nearby.map((n) => (
                      <li key={n.name} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
                        <span className="flex items-center gap-3 text-sm"><Landmark className="h-4 w-4 text-olive" /> {n.name}</span>
                        <span className="text-xs font-semibold text-muted">{n.distance}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {/* Pricing */}
            <section className="border-b border-line py-10">
              <h2 className="font-display text-3xl font-semibold text-forest">Pricing</h2>
              <div className="mt-6 divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-soft">
                {[
                  ['Weeknight (Sun–Thu)', money(p.basePrice)],
                  ['Weekend night (Fri & Sat)', money(p.weekendPrice || p.basePrice)],
                  [`Extra guest (above ${p.includedGuests})`, p.extraGuestFee ? `${money(p.extraGuestFee)} / guest / night` : 'Included'],
                  ['Cleaning fee', p.cleaningFee ? `${money(p.cleaningFee)} per stay` : 'Included'],
                  ['Minimum stay', `${p.minNights} night${p.minNights > 1 ? 's' : ''}`],
                  ...p.seasonal.map((s) => [`${s.label} (${formatDate(s.start, { day: 'numeric', month: 'short' })} – ${formatDate(s.end, { day: 'numeric', month: 'short' })})`, `${money(s.pricePerNight)} / night`]),
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-4 px-5 py-4 text-sm"><span className="text-ink/75">{k}</span><span className="text-right font-semibold">{v}</span></div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted">Some dates may carry special pricing; your exact nightly prices show in the booking card. Prices in {settings.currency}.</p>
            </section>

            {/* Enquiry */}
            <section id="enquire" className="scroll-mt-28 py-10">
              <p className="eyebrow mb-2">Request to book</p>
              <h2 className="font-display text-4xl font-semibold text-forest">Send us an enquiry</h2>
              <p className="mt-2 mb-6 text-ink/70">Share your details and we’ll confirm availability, usually within a few hours. Prefer to chat? <a href={wa(waMsg)} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-forest">Message us on WhatsApp</a>.</p>
              <EnquiryForm property={property} stay={stay} onStayChange={setStay} />
            </section>
          </div>

          {/* Sticky booking card (desktop) */}
          <aside className="hidden lg:block">
            <div className="no-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl">
              <BookingWidget property={property} stay={stay} onChange={setStay} onEnquire={onEnquire} />
            </div>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="border-t border-line py-16">
            <h2 className="mb-8 font-display text-4xl font-semibold text-forest">You might also love</h2>
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((o) => <PropertyCard key={o.id} property={o} />)}
            </div>
          </section>
        )}
      </div>

      {/* Sticky enquiry bar (mobile/tablet) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 py-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <button onClick={() => scrollTo('availability')} className="text-left">
            {quote && !issues.length ? (
              <>
                <div className="text-base font-bold">{money(quote.total)} <span className="text-xs font-normal text-muted">est. total</span></div>
                <div className="text-xs font-semibold text-forest underline underline-offset-2">{formatDate(stay.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(stay.checkOut, { day: 'numeric', month: 'short' })} · {quote.nights} nights</div>
              </>
            ) : (
              <>
                <div className="text-base font-bold">{money(fromPrice(property))} <span className="text-xs font-normal text-muted">/ night</span></div>
                <div className="text-xs font-semibold text-forest underline underline-offset-2">Check availability</div>
              </>
            )}
          </button>
          <div className="flex gap-2">
            <ButtonA href={wa(waMsg)} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="!px-3.5" aria-label="Enquire on WhatsApp" icon={<WhatsAppIcon />} />
            <button onClick={onEnquire} className="h-11 rounded-full bg-forest px-6 text-sm font-semibold text-ivory">Enquire</button>
          </div>
        </div>
      </div>
    </div>
  )
}
