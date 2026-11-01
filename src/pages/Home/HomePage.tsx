import { ArrowRight, BedDouble, Cake, CalendarCheck, ChevronDown, KeyRound, MapPin, MessageCircle, Quote, Search } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flower, Rainbow, Sun, Wave } from '../../components/Boho'
import { OccasionIcon } from '../../components/OccasionIcon'
import { PropertyCard } from '../../components/PropertyCard'
import { SearchBar } from '../../components/SearchBar'
import { Badge } from '../../components/ui/Badge'
import { ButtonA, ButtonLink } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { SmartImage } from '../../components/ui/SmartImage'
import { Stars } from '../../components/ui/Stars'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData, usePublishedProperties } from '../../context/DataContext'
import { CITY, DEFAULT_HERO, faqs, neighbourhoods, partyRules, stayNear } from '../../data/gurgaon'
import { occasionInfo } from '../../data/occasions'
import { testimonials } from '../../data/testimonials'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMoney } from '../../hooks/useMoney'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { openNights } from '../../utils/availability'
import { formatDate, today } from '../../utils/dates'
import { classNames } from '../../utils/format'

const SM_SPAN: Record<number, string> = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' }
const LG_SPAN: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' }

const HERO_WORDS = ['Your weekend.', 'Your get-together.', 'Your movie night.', 'Your slow Sunday.', 'Your celebration.']

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
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-dark/70 via-forest-dark/25 to-forest-dark/85" />
        <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-coral/25 blur-[130px]" />
        <div className="pointer-events-none absolute -right-20 top-0 -z-10 h-96 w-96 rounded-full bg-marigold/20 blur-[130px]" />
        <Rainbow className="pointer-events-none absolute bottom-0 right-40 -z-10 hidden h-32 w-52 opacity-60 xl:block" />
        <div className="container-page">
          <div className="relative max-w-4xl animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-sand ring-1 ring-white/20 backdrop-blur">
              <MapPin className="h-3.5 w-3.5" /> {CITY}<span className="hidden sm:inline"> · Whole homes to gather & stay</span>
            </p>
            <h1 className="font-display text-[42px] font-semibold leading-[0.98] text-ivory sm:text-7xl lg:text-[88px]" aria-label="The whole place. Your people. Your weekend.">
              <span aria-hidden="true">The whole place.<br />Your people.<br /><RotatingWord words={HERO_WORDS} /></span>
            </h1>
            <Sun className="pointer-events-none absolute -right-4 top-24 hidden h-28 w-28 text-marigold/70 lg:block" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85">
              Rent an entire home in {CITY}, just for you and your people. Slow weekends, long dinners, movie nights, the odd celebration. It’s all yours.
            </p>
          </div>
          <div className="mt-10 max-w-6xl animate-fade-up [animation-delay:150ms]">
            <SearchBar />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <ButtonLink to="/stays" variant="accent" iconRight={<ArrowRight className="h-4 w-4" />}>See all places</ButtonLink>
              <ButtonA href={wa(`Hi! I’m planning something in ${CITY} and need a place.`)} target="_blank" rel="noopener noreferrer" variant="light" icon={<WhatsAppIcon className="h-5 w-5 text-whatsapp" />}>Tell us your plan</ButtonA>
            </div>
          </div>
        </div>
      </section>

      <OccasionMarquee />
      <PlanTiles />

      {/* LISTINGS GRID with promo banners in between */}
      <section className="container-page pb-24">
        <SectionHeading
          eyebrow={`Our places in ${CITY}`}
          title={<>Yours for the night, <em className="font-medium text-olive">the whole thing</em></>}
          intro="Every place is ours and rented out whole, so it’s only ever your group inside. Book instantly on Airbnb where listed, or message us and talk to a real person."
          action={<ButtonLink to="/stays" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>See all places</ButtonLink>}
        />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <Fragment key={p.id}>
              <PropertyCard property={p} />
              {i === 1 && shown.length > 2 && <PromoCard kind="office" />}
            </Fragment>
          ))}
          {shown.length <= 2 && <PromoCard kind="office" />}
          {/* Stretch the last banner to fill its row so the grid never ends with a gap. */}
          <PromoCard kind="extras" className={classNames(SM_SPAN[2 - ((shown.length + 1) % 2)], LG_SPAN[3 - ((shown.length + 1) % 3)])} />
        </div>
      </section>

      <HowItWorks />
      <Neighbourhoods />
      <TestimonialsSection />
      <PlanAheadSection />
      <FaqSection />
      <StayNearLinks />
    </>
  )
}

/** Hero headline's last line, cycling through what people book us for. */
function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => window.clearInterval(t)
  }, [words.length])
  return (
    <span className="inline-block overflow-hidden pb-2 align-bottom">
      <em key={i} className="inline-block animate-word-in font-medium text-marigold">{words[i]}</em>
    </span>
  )
}

function OccasionMarquee() {
  const items = ['Slow weekends', 'Long dinners', 'Movie nights', 'Lazy Sundays', 'Get-togethers', 'Date nights', 'Reunions', 'Birthdays', 'Sunset chai']
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap px-6 font-display text-2xl italic text-ivory/90 sm:text-3xl">
          {t}<Flower className="ml-12 h-5 w-5 text-marigold" />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="relative overflow-hidden bg-night py-5" aria-label="What people book us for">
      <div className="block-print pointer-events-none absolute inset-0 opacity-[0.12]" />
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">{row()}{row(true)}</div>
    </div>
  )
}

/** "What's the plan?" tiles. Counts come from the places' own occasion tags. */
function PlanTiles() {
  const properties = usePublishedProperties()
  const wa = useWhatsApp()
  return (
    <section className="container-page py-24">
      <SectionHeading
        eyebrow="Pick your vibe"
        title={<>What’s the <em className="font-medium text-olive">mood?</em></>}
        intro="From a quiet date night to a big get-together on a terrace, tell us the mood and we’ll show you the homes that suit it."
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {occasionInfo.map((o, i) => {
          const count = properties.filter((p) => o.occasion === 'Staycation' || p.occasions.includes(o.occasion)).length
          return (
            <Link key={o.occasion} to={`/stays?plan=${encodeURIComponent(o.occasion)}`} className={classNames('group relative block overflow-hidden', i === 0 ? 'col-span-2 rounded-[2rem] lg:row-span-2 lg:arch' : 'arch')}>
              <SmartImage src={o.image} alt="" className={classNames('w-full transition duration-700 group-hover:scale-105', i === 0 ? 'aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/5]')} />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-ivory sm:p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-marigold text-ink shadow-lift transition group-hover:-rotate-12 sm:h-10 sm:w-10">
                  <OccasionIcon name={o.occasion} className="h-[18px] w-[18px]" />
                </div>
                <h3 className={classNames('font-display font-semibold leading-tight', i === 0 ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl')}>{o.title}</h3>
                <p className={classNames('mt-1 text-ivory/80', i === 0 ? 'text-base' : 'hidden text-sm sm:block')}>{o.line}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-marigold">
                  {count ? `${count} ${count === 1 ? 'place' : 'places'}` : 'Ask us'} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          )
        })}
        {/* Fills the last row: 1 big tile (4 slots) + 6 small + this wide one = 3 full rows. */}
        <a href={wa('Hi! I’m planning something a bit different. Can you help?')} target="_blank" rel="noopener noreferrer" className="group relative col-span-2 flex min-h-[200px] flex-col justify-end overflow-hidden rounded-3xl bg-coral p-6 text-ivory sm:p-8">
          <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-marigold/40 blur-2xl transition group-hover:scale-110" />
          <div className="block-print pointer-events-none absolute inset-0 opacity-25" />
          <Sun className="absolute right-6 top-5 h-16 w-16 text-marigold transition duration-700 group-hover:rotate-45" />
          <p className="mb-1 font-hand text-2xl font-bold text-ivory/90">something else?</p>
          <h3 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Anniversary, a reading retreat, a match screening…</h3>
          <p className="mt-3 flex items-center gap-2 text-sm font-semibold"><WhatsAppIcon className="h-4 w-4" /> Tell us the plan on WhatsApp <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></p>
        </a>
      </div>
    </section>
  )
}

function PromoCard({ kind, className }: { kind: 'office' | 'extras'; className?: string }) {
  const wa = useWhatsApp()
  const office = kind === 'office'
  return (
    <aside className={classNames('relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl p-7', office ? 'bg-night text-ivory' : 'bg-clay text-ink', className)}>
      {office ? <div className="block-print pointer-events-none absolute inset-0 opacity-[0.14]" /> : <Rainbow className="pointer-events-none absolute -right-4 top-6 h-24 w-36 opacity-80" />}
      <div className={classNames('absolute left-7 top-7 flex h-12 w-12 items-center justify-center rounded-full', office ? 'bg-ivory/10' : 'bg-white/60')}>
        {office ? <BedDouble className="h-5 w-5" /> : <Cake className="h-5 w-5" />}
      </div>
      <p className={classNames('eyebrow mb-3', office ? '!text-marigold' : '!text-ink/70')}>{office ? 'Need a break?' : 'Make it special'}</p>
      <h3 className="font-display text-3xl font-semibold leading-tight">{office ? 'A weekend that’s all yours' : 'Flowers, a cake or dinner?'}</h3>
      <p className={classNames('mt-3 text-sm leading-relaxed', office ? 'text-ivory/75' : 'text-ink/75')}>
        {office ? 'No plans, no crowd. Cook, nap, read on the balcony and watch the city lights come on.' : 'Tell us what you’re planning on WhatsApp and we’ll try to help with flowers, a cake or a good caterer nearby.'}
      </p>
      <div className="mt-6">
        {office ? (
          <ButtonLink to="/stays?plan=Staycation" variant="light" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>Homes for a slow weekend</ButtonLink>
        ) : (
          <ButtonA href={wa('Hi! I’m planning something special. Can you help with flowers, a cake or food?')} target="_blank" rel="noopener noreferrer" variant="primary" size="sm" icon={<WhatsAppIcon className="h-4 w-4" />}>Ask on WhatsApp</ButtonA>
        )}
      </div>
    </aside>
  )
}

function HowItWorks() {
  const steps = [
    { Icon: Search, title: 'Pick a place and a date', body: 'Filter by your plan and group size, then check the calendar. Prices are for the whole place.' },
    { Icon: MessageCircle, title: 'Tell us the plan', body: 'Book on Airbnb or send us the details. We confirm the date, the price and the deposit with you.' },
    { Icon: KeyRound, title: 'Get the keys', body: 'The whole place is yours. Settle in, make it home, and check out by 11 the next morning.' },
  ]
  return (
    <section className="relative">
    <Wave className="text-night" />
    <div className="relative overflow-hidden bg-night py-24 text-ivory">
      <div className="block-print pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-coral/20 blur-[120px]" />
      <Sun className="pointer-events-none absolute right-10 top-16 hidden h-24 w-24 text-marigold/60 md:block" />
      <div className="container-page relative">
        <p className="eyebrow mb-3 !text-marigold">How it works</p>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] sm:text-6xl">Not a hotel. <em className="font-medium text-marigold">Your place</em> for the night.</h2>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(({ Icon, title, body }, i) => (
            <li key={title} className="relative rounded-t-[7rem] rounded-b-3xl bg-ivory/[0.05] px-7 pb-7 pt-12 ring-1 ring-ivory/10">
              <span className="font-hand text-5xl font-bold text-marigold/80">step {i + 1}</span>
              <div className="absolute right-7 top-10 flex h-12 w-12 items-center justify-center rounded-full bg-marigold text-ink"><Icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-2xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivory/70">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-16 border-t border-ivory/10 pt-12">
          <h3 className="font-display text-3xl font-semibold">The friendly rules</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {partyRules.map((r) => (
              <li key={r.title}>
                <p className="flex items-center gap-2 font-semibold"><Flower className="h-4 w-4 text-marigold" />{r.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ivory/65">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    <Wave className="text-night" flip />
    </section>
  )
}

function Neighbourhoods() {
  const properties = usePublishedProperties()
  return (
    <section className="container-page py-24 sm:py-28">
      <SectionHeading eyebrow={`Explore ${CITY}`} title={<>Pick your <em className="font-medium text-olive">scene</em></>} intro={`Cyber Hub’s bars, the Golf Course Road skyline or Sector 29’s night out: each part of ${CITY} has its own vibe.`} />
      <div className="grid gap-5 md:grid-cols-3">
        {neighbourhoods.map((n) => {
          const count = properties.filter((p) => [p.region, p.location].some((s) => s.toLowerCase().includes(n.query.toLowerCase()))).length
          return (
            <Link key={n.name} to={`/stays?where=${encodeURIComponent(n.query)}`} className="arch group relative block overflow-hidden">
              <SmartImage src={n.image} alt={`${n.name}, ${CITY}`} className="aspect-[4/5] w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/85 via-forest-dark/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-3xl font-semibold">{n.name}</h3>
                  {count > 0 && <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">{count} {count === 1 ? 'place' : 'places'}</span>}
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
    <section className="relative overflow-hidden bg-forest py-24 text-ivory">
      <div className="block-print pointer-events-none absolute inset-0 opacity-[0.08]" />
      <div className="container-page relative">
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
            <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">Got a date in mind? Check it now.</h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              We only have a few places and each one goes to one group at a time. See what’s open below, or send us your date and we’ll tell you straight away if it’s free.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/stays" variant="primary" size="lg" icon={<CalendarCheck className="h-4 w-4" />}>See open dates</ButtonLink>
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
        <h2 className="font-display text-3xl font-semibold text-forest">Find a place near…</h2>
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
