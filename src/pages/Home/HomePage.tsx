import { ArrowRight, CalendarCheck, HandHeart, Quote, Receipt, Sparkles, Sprout } from 'lucide-react'
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
import { testimonials } from '../../data/testimonials'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMoney } from '../../hooks/useMoney'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { openNights } from '../../utils/availability'
import { formatDate, today } from '../../utils/dates'
import { unsplash } from '../../utils/image'

const HERO = unsplash('1501785888041-af3ef285b470', 2400)

export function HomePage() {
  useDocumentTitle()
  const properties = usePublishedProperties()
  const wa = useWhatsApp()
  // Featured homes first; fill the row with the rest so the grid never looks half-empty.
  const shown = [...properties].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-14 pt-32 sm:items-center sm:pb-20">
        <SmartImage src={HERO} alt="Lake surrounded by mountains at sunrise" eager quietFallback className="absolute inset-0 -z-20 h-full w-full scale-105" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1b241e]/60 via-[#1b241e]/35 to-[#1b241e]/75" />
        <div className="container-page">
          <div className="max-w-3xl animate-fade-up">
            <p className="eyebrow mb-5 !text-sand">Boutique stays · Booked directly with the owner</p>
            <h1 className="font-display text-[52px] font-semibold leading-[0.98] text-ivory sm:text-7xl lg:text-[88px]">
              Find Your Place <br className="hidden sm:block" />to <em className="font-medium text-sand">Slow Down.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/85">
              Thoughtfully curated stays for beautiful escapes, unforgettable moments and experiences worth remembering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/stays" variant="accent" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>Explore properties</ButtonLink>
              <ButtonA href={wa('Hello! I’m planning a getaway and would love some help choosing a stay.')} target="_blank" rel="noopener noreferrer" variant="light" size="lg" icon={<WhatsAppIcon className="h-5 w-5 text-whatsapp" />}>
                WhatsApp us
              </ButtonA>
            </div>
          </div>
          <div className="mt-12 max-w-5xl animate-fade-up [animation-delay:150ms]">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page py-24 sm:py-28">
        <SectionHeading
          eyebrow="Our homes"
          title={<>A small collection, <em className="font-medium text-olive">chosen with care</em></>}
          intro="Each home is one we look after ourselves, so you always know who you’re booking with."
          action={<ButtonLink to="/stays" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>View all stays</ButtonLink>}
        />
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => <PropertyCard key={p.id} property={p} />)}
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
              { Icon: HandHeart, title: 'Personal assistance', body: 'Talk to us directly on WhatsApp for directions, local tips, meals or anything else.' },
              { Icon: Sparkles, title: 'Memorable stays', body: 'Spotless homes, thoughtful touches and quiet settings made for slowing down.' },
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

      <ExperienceSection />
      <TestimonialsSection />
      <PlanAheadSection />
    </>
  )
}

function ExperienceSection() {
  const items = [
    { img: unsplash('1506905925346-21bda4d32df4', 1200), alt: 'Mountain ridge above the clouds', title: 'Mountains & forests', body: 'Trails, waterfalls and cool mornings under the deodars.' },
    { img: unsplash('1507525428034-b723cf961d3e', 1200), alt: 'Calm turquoise beach', title: 'Coast & sunsets', body: 'Lazy beach days, seafood shacks and golden evenings.' },
    { img: unsplash('1544161515-4ab6ce6db874', 1200), alt: 'Relaxing spa setting with towels and candles', title: 'Rest & restore', body: 'Unhurried days, good sleep and nothing on the schedule.' },
    { img: unsplash('1414235077428-338989a2e8c0', 1200), alt: 'Beautifully plated dinner', title: 'Local flavours', body: 'Home-cooked regional meals, coffee estates and markets.' },
  ]
  return (
    <section className="container-page py-24 sm:py-28">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4 lg:pt-6">
          <p className="eyebrow mb-3">The experience</p>
          <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">More than a place to sleep</h2>
          <p className="mt-5 leading-relaxed text-ink/70">
            Our homes sit close to nature and to the things that make each region special. Tell us what you enjoy and we’ll help you plan the days around your stay.
          </p>
          <ButtonLink to="/stays" variant="primary" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" />}>Find your stay</ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-8">
          {items.map((it, i) => (
            <figure key={it.title} className={`group relative overflow-hidden rounded-3xl ${i % 2 === 1 ? 'mt-10' : ''}`}>
              <SmartImage src={it.img} alt={it.alt} className="aspect-[3/4] w-full transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b241e]/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-ivory sm:p-6">
                <h3 className="font-display text-xl font-semibold sm:text-2xl">{it.title}</h3>
                <p className="mt-1 hidden text-sm text-ivory/80 sm:block">{it.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
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
          {anySample && (
            <Badge tone="accent" className="mt-5 bg-accent/20 !text-sand">Sample reviews for preview · real guest reviews coming soon</Badge>
          )}
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
            <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">Planning a getaway? Let’s help you find the right stay.</h2>
            <p className="mt-5 leading-relaxed text-ink/70">
              With only a few homes, popular travel dates like long weekends and holidays may fill quickly. Check availability for your dates and we’ll get back to you quickly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/stays" variant="primary" size="lg" icon={<CalendarCheck className="h-4 w-4" />}>Explore available dates</ButtonLink>
              <ButtonA href={wa('Hello! Can you help me check availability for my dates?')} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" icon={<WhatsAppIcon />}>Ask on WhatsApp</ButtonA>
            </div>
          </div>
          <div className="space-y-4 bg-forest/[0.04] p-8 sm:p-12 lg:p-16">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">Availability right now</h3>
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
