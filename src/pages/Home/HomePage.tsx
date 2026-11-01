import { ArrowRight, Briefcase, Building, Building2, CalendarCheck, CalendarRange, ChevronDown, HandHeart, Home, Hotel, MapPin, Quote, Receipt, Sparkles, Sprout, Warehouse } from 'lucide-react'
import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { PropertyCard } from '../../components/PropertyCard'
import { SearchBar } from '../../components/SearchBar'
import { Badge } from '../../components/ui/Badge'
import { ButtonA, ButtonLink } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { SmartImage } from '../../components/ui/SmartImage'
import { Stars } from '../../components/ui/Stars'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData, usePublishedProperties } from '../../context/DataContext'
import { CITY, DEFAULT_HERO, faqs, neighbourhoods, stayNear } from '../../data/gurgaon'
import { testimonials } from '../../data/testimonials'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMoney } from '../../hooks/useMoney'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import type { PropertyType } from '../../types'
import { openNights } from '../../utils/availability'
import { formatDate, today } from '../../utils/dates'
import { classNames } from '../../utils/format'
import { fromPrice } from '../../utils/pricing'

const TYPE_ICONS: Record<PropertyType, typeof Home> = {
  Studio: Building,
  Apartment: Building2,
  'Serviced apartment': Hotel,
  Penthouse: Sparkles,
  'Independent floor': Warehouse,
  Villa: Home,
}

const SM_SPAN: Record<number, string> = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' }
const LG_SPAN: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' }

export function HomePage() {
  useDocumentTitle()
  const properties = usePublishedProperties()
  const { settings } = useData()
  const wa = useWhatsApp()
  const shown = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 6)

  return (
    <>
      {/* HERO: the owner's photo of DLF Cyber City Building 9A & 9B (set in Admin → Settings) */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-12 pt-32 sm:items-center sm:pb-20">
        <SmartImage src={settings.heroImageUrl || DEFAULT_HERO} alt={settings.heroImageAlt} eager quietFallback className="absolute inset-0 -z-20 h-full w-full scale-105" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#141b16]/65 via-[#141b16]/30 to-[#141b16]/80" />
        <div className="container-page">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-sand ring-1 ring-white/20 backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> {CITY}<span className="hidden sm:inline"> · Cyber City · Golf Course Road</span>
            </p>
            <h1 className="font-display text-[50px] font-semibold leading-[0.98] text-ivory sm:text-7xl lg:text-[88px]">
              Find Your Place <br className="hidden sm:block" />to <em className="font-medium text-sand">Slow Down.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85">
              Thoughtfully curated stays in the heart of {CITY}, minutes from DLF Cyber City. For work trips, family visits and unhurried city breaks.
            </p>
          </div>
          <div className="mt-10 max-w-5xl animate-fade-up [animation-delay:150ms]">
            <SearchBar />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink to="/stays" variant="accent" iconRight={<ArrowRight className="h-4 w-4" />}>Explore properties</ButtonLink>
              <ButtonA href={wa(`Hello! I’m looking for a stay in ${CITY}.`)} target="_blank" rel="noopener noreferrer" variant="light" icon={<WhatsAppIcon className="h-5 w-5 text-whatsapp" />}>WhatsApp us</ButtonA>
            </div>
          </div>
        </div>
      </section>

      <StayTypes />

      {/* LISTINGS GRID with promo banners in between */}
      <section className="container-page pb-24">
        <SectionHeading
          eyebrow={`Our homes in ${CITY}`}
          title={<>Available now, <em className="font-medium text-olive">hand-picked</em></>}
          intro="Every home is ours and looked after by us. Book instantly on Airbnb where listed, or enquire directly and talk to a real person."
          action={<ButtonLink to="/stays" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>View all stays</ButtonLink>}
        />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Fragment key={p.id}>
              <PropertyCard property={p} />
              {i === 1 && shown.length > 2 && <PromoCard kind="work" />}
            </Fragment>
          ))}
          {shown.length <= 2 && <PromoCard kind="work" />}
          {/* Stretch the last banner to fill its row so the grid never ends with a gap. */}
          <PromoCard kind="long" className={classNames(SM_SPAN[2 - ((shown.length + 1) % 2)], LG_SPAN[3 - ((shown.length + 1) % 3)])} />
        </div>
      </section>

      {/* WHY */}
      <section className="bg-cream/60 py-24">
        <div className="container-page">
          <SectionHeading align="center" eyebrow="Why book with us" title="Hospitality that feels personal" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Sprout, title: 'Personally curated', body: 'We own and care for every home, so the photos are honest and the details are right.' },
              { Icon: Receipt, title: 'Transparent pricing', body: 'See the nightly rate, fees and estimated total before you enquire. No surprises.' },
              { Icon: HandHeart, title: 'Personal assistance', body: 'Talk to us directly on WhatsApp for airport pickups, local tips or anything else.' },
              { Icon: Sparkles, title: 'Memorable stays', body: 'Spotless homes, thoughtful touches and quiet nights in a busy city.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="card p-7 transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-ivory"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-forest">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Neighbourhoods />
      <TestimonialsSection />
      <PlanAheadSection />
      <FaqSection />
      <StayNearLinks />
    </>
  )
}

/** cozycozy-style "search by accommodation type" tiles, built from the types you actually have. */
function StayTypes() {
  const properties = usePublishedProperties()
  const money = useMoney()
  const types = [...new Set(properties.map((p) => p.type))]
  return (
    <section className="container-page relative z-10 -mt-8 mb-20 sm:-mt-10">
      <div className="no-scrollbar flex gap-3 overflow-x-auto rounded-[28px] bg-white p-3 shadow-lift sm:justify-center">
        <Link to="/stays" className="flex shrink-0 items-center gap-3 rounded-2xl bg-forest px-5 py-3.5 text-ivory transition hover:bg-forest-dark">
          <Home className="h-5 w-5" />
          <span><span className="block text-sm font-semibold">All stays</span><span className="block text-xs text-ivory/70">{properties.length} homes</span></span>
        </Link>
        {types.map((t) => {
          const Icon = TYPE_ICONS[t] ?? Home
          const list = properties.filter((p) => p.type === t)
          return (
            <Link key={t} to={`/stays?type=${encodeURIComponent(t)}`} className="flex shrink-0 items-center gap-3 rounded-2xl px-5 py-3.5 ring-1 ring-line transition hover:bg-ivory hover:ring-forest/30">
              <Icon className="h-5 w-5 text-olive" />
              <span>
                <span className="block text-sm font-semibold text-ink">{t === 'Apartment' ? 'Apartments' : `${t}s`}</span>
                <span className="block text-xs text-muted">from {money(Math.min(...list.map(fromPrice)))}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function PromoCard({ kind, className }: { kind: 'work' | 'long'; className?: string }) {
  const wa = useWhatsApp()
  const work = kind === 'work'
  return (
    <aside className={classNames('relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl p-7', work ? 'bg-forest text-ivory' : 'bg-sand/70 text-forest', className)}>
      <div className={classNames('absolute -right-10 -top-10 h-44 w-44 rounded-full', work ? 'bg-olive/40' : 'bg-accent/25')} />
      <div className={classNames('absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-2xl', work ? 'bg-ivory/10' : 'bg-white/70')}>
        {work ? <Briefcase className="h-5 w-5" /> : <CalendarRange className="h-5 w-5" />}
      </div>
      <p className={classNames('eyebrow mb-3', work ? '!text-sand' : '')}>{work ? 'Here for work?' : 'Longer stays'}</p>
      <h3 className="font-display text-3xl font-semibold leading-tight">{work ? 'Stay minutes from DLF Cyber City' : 'Staying a week or a month?'}</h3>
      <p className={classNames('mt-3 text-sm leading-relaxed', work ? 'text-ivory/75' : 'text-ink/70')}>
        {work ? 'Fast Wi-Fi, a proper desk and power backup, close to the offices of Cyber City and Golf Course Road.' : 'Ask us about weekly and monthly rates for project stays, relocations and family visits.'}
      </p>
      <div className="mt-6">
        {work ? (
          <ButtonLink to="/stays?where=Cyber%20City" variant="light" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>Stays near Cyber City</ButtonLink>
        ) : (
          <ButtonA href={wa('Hello! I’m looking for a longer stay. Could you share weekly or monthly rates?')} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="sm" icon={<WhatsAppIcon className="h-4 w-4" />}>Ask about long-stay rates</ButtonA>
        )}
      </div>
    </aside>
  )
}

function Neighbourhoods() {
  const properties = usePublishedProperties()
  return (
    <section className="container-page py-24 sm:py-28">
      <SectionHeading eyebrow={`Explore ${CITY}`} title={<>Pick your <em className="font-medium text-olive">neighbourhood</em></>} intro={`From the glass towers of Cyber City to the green lanes of Sector 29, each part of ${CITY} has its own rhythm.`} />
      <div className="grid gap-5 md:grid-cols-3">
        {neighbourhoods.map((n) => {
          const count = properties.filter((p) => [p.region, p.location].some((s) => s.toLowerCase().includes(n.query.toLowerCase()))).length
          return (
            <Link key={n.name} to={`/stays?where=${encodeURIComponent(n.query)}`} className="group relative block overflow-hidden rounded-3xl">
              <SmartImage src={n.image} alt={`${n.name}, ${CITY}`} className="aspect-[4/5] w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#141b16]/85 via-[#141b16]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-3xl font-semibold">{n.name}</h3>
                  {count > 0 && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{count} {count === 1 ? 'stay' : 'stays'}</span>}
                </div>
                <p className="mt-2 text-sm text-ivory/80">{n.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {n.landmarks.map((l) => <span key={l} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-ivory/85 ring-1 ring-white/15">{l}</span>)}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const anySample = testimonials.some((t) => t.isSample)
  return (
    <section className="bg-forest py-24 text-ivory">
      <div className="container-page">
        <div className="mb-12 flex flex-col items-center text-center">
          <p className="eyebrow mb-3 !text-accent">Guest stories</p>
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">Words from our guests</h2>
          {anySample && <Badge tone="accent" className="mt-5 bg-accent/20 !text-sand">Sample reviews for preview · real guest reviews coming soon</Badge>}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-3xl bg-ivory/[0.06] p-7 ring-1 ring-ivory/10">
              <Quote className="h-7 w-7 text-accent" />
              <Stars rating={t.rating} className="mt-5 h-4 w-4" />
              <blockquote className="mt-4 flex-1 font-display text-xl leading-snug text-ivory/90">“{t.text}”</blockquote>
              <figcaption className="mt-6 border-t border-ivory/10 pt-4 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-ivory/60"> · {t.from} · stayed at {t.stay}</span>
                {t.isSample && <span className="ml-2 rounded-full bg-ivory/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ivory/60">Sample</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Urgency built only from real data: open nights and seasonal prices the owner has set. */
function PlanAheadSection() {
  const properties = usePublishedProperties()
  const { overrides, bookings } = useData()
  const money = useMoney()
  const wa = useWhatsApp()
  const t = today()
  const deals = properties.flatMap((p) => p.pricing.seasonal.filter((s) => s.end >= t && s.pricePerNight < p.pricing.basePrice).map((s) => ({ p, s })))

  return (
    <section className="container-page py-24 sm:py-28">
      <div className="overflow-hidden rounded-[32px] bg-cream">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-12 lg:p-16">
            <p className="eyebrow mb-3">Plan ahead</p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">Coming to {CITY}? Let’s help you find the right stay.</h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              With only a few homes, popular dates like conference weeks, long weekends and the wedding season may fill quickly. Check availability for your dates and we’ll get back to you quickly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/stays" variant="primary" size="lg" icon={<CalendarCheck className="h-4 w-4" />}>Explore available dates</ButtonLink>
              <ButtonA href={wa('Hello! Can you help me check availability for my dates?')} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" icon={<WhatsAppIcon />}>Ask on WhatsApp</ButtonA>
            </div>
          </div>
          <div className="space-y-4 bg-forest/[0.04] p-8 sm:p-12 lg:p-16">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Availability right now</h3>
            {properties.map((p) => {
              const open = openNights(p.id, overrides, bookings)
              return (
                <Link key={p.id} to={`/stays/${p.slug}`} className="flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-soft transition hover:shadow-lift">
                  <div className="flex items-center gap-4">
                    <SmartImage src={p.images[0]?.url ?? ''} alt={p.images[0]?.alt ?? p.name} width={200} className="h-14 w-14 rounded-xl" />
                    <div>
                      <div className="font-display text-xl font-semibold text-forest">{p.name}</div>
                      <div className="text-xs text-muted">{p.region}</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-semibold text-ink">{open} of 30 nights open</div>
                    <div className="text-muted">next 30 days</div>
                  </div>
                </Link>
              )
            })}
            {deals.map(({ p, s }) => (
              <div key={s.id} className="rounded-2xl border border-accent/40 bg-white p-4 text-sm">
                <span className="font-semibold text-accent-dark">{s.label}</span> at {p.name}: {money(s.pricePerNight)}/night, {formatDate(s.start, { day: 'numeric', month: 'short' })} – {formatDate(s.end, { day: 'numeric', month: 'short' })}
              </div>
            ))}
            <p className="text-xs text-muted">Counts come straight from our booking calendar.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section className="container-page grid gap-10 pb-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
      <div>
        <p className="eyebrow mb-3">Good to know</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">Frequently asked questions</h2>
        <p className="mt-4 text-ink/70">Can’t find what you need? <Link to="/contact" className="link-underline font-semibold text-forest">Get in touch</Link>.</p>
      </div>
      <div className="divide-y divide-line rounded-3xl bg-white px-6 shadow-soft">
        {faqs.map((f, i) => (
          <div key={f.q}>
            <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 py-5 text-left">
              <span className="font-semibold text-ink">{f.q}</span>
              <ChevronDown className={classNames('h-5 w-5 shrink-0 text-olive transition', open === i && 'rotate-180')} />
            </button>
            {open === i && <p className="animate-fade-up pb-5 text-sm leading-relaxed text-ink/75">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

/** Text-link clusters, like cozycozy's "ideas for your next holiday". Each runs a real search. */
function StayNearLinks() {
  return (
    <section className="container-page">
      <div className="rounded-3xl border border-line p-8 sm:p-10">
        <h2 className="font-display text-3xl font-semibold text-forest">Find a stay near…</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {stayNear.map((l) => (
            <li key={l.label}>
              <Link to={`/stays?where=${encodeURIComponent(l.where)}`} className="group flex items-center gap-2 text-ink/75 hover:text-forest">
                <MapPin className="h-3.5 w-3.5 text-accent" /> <span className="group-hover:underline group-hover:underline-offset-4">{l.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
