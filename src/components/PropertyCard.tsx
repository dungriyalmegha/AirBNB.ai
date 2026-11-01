import { BedDouble, ChevronLeft, ChevronRight, ExternalLink, Heart, KeyRound, MapPin, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useMoney } from '../hooks/useMoney'
import { useSaved } from '../hooks/useSaved'
import { useWhatsApp } from '../hooks/useWhatsApp'
import { airbnbLink } from '../utils/airbnb'
import type { Property } from '../types'
import { availabilityLabel, openNights } from '../utils/availability'
import { classNames } from '../utils/format'
import { fromPrice } from '../utils/pricing'
import { enquiryMessage } from '../utils/whatsapp'
import { OccasionIcon } from './OccasionIcon'
import { Badge } from './ui/Badge'
import { ButtonA, ButtonLink } from './ui/Button'
import { SmartImage } from './ui/SmartImage'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

export function PropertyCard({ property, showDescription, query = '' }: { property: Property; showDescription?: boolean; query?: string }) {
  const money = useMoney()
  const wa = useWhatsApp()
  const { overrides, bookings } = useData()
  const { isSaved, toggle } = useSaved()
  const saved = isSaved(property.id)
  const [i, setI] = useState(0)
  const imgs = property.images.length ? property.images : [{ id: 'x', url: '', alt: property.name }]
  const avail = availabilityLabel(openNights(property.id, overrides, bookings))
  const href = `/stays/${property.slug}${query}`

  const go = (d: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setI((x) => (x + d + imgs.length) % imgs.length)
  }

  return (
    <article className="group flex flex-col">
      <Link to={href} className="relative block overflow-hidden rounded-3xl" aria-label={`View ${property.name}`}>
        <div className="aspect-[4/3.4] overflow-hidden">
          <SmartImage
            src={imgs[i]!.url}
            alt={imgs[i]!.alt}
            width={900}
            className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 pr-14">
          <Badge className="bg-white/95 shadow-sm"><KeyRound className="h-3 w-3" /> Whole place</Badge>
          {property.featured && <Badge className="!bg-marigold !text-ink shadow-sm">Party favourite</Badge>}
          {property.airbnbUrl && <Badge className="bg-[#ff385c] !text-white shadow-sm">Also on Airbnb</Badge>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggle(property.id) }}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${property.name} from saved` : `Save ${property.name}`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-forest shadow-sm backdrop-blur transition hover:scale-110"
        >
          <Heart className={classNames('h-[18px] w-[18px] transition', saved && 'fill-[#ff385c] text-[#ff385c]')} />
        </button>
        {imgs.length > 1 && (
          <>
            <button onClick={go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-forest opacity-0 shadow transition group-hover:opacity-100 focus:opacity-100">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {imgs.slice(0, 6).map((_, n) => (
                <span key={n} className={classNames('h-1.5 rounded-full bg-white transition-all', n === i ? 'w-4' : 'w-1.5 opacity-60')} />
              ))}
            </div>
          </>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-[26px] font-semibold leading-tight text-forest">
              <Link to={href} className="hover:text-olive">{property.name}</Link>
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-3.5 w-3.5" /> {property.location}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[11px] uppercase tracking-wider text-muted">from</div>
            <div className="text-lg font-bold text-ink">{money(fromPrice(property))}</div>
            <div className="text-xs text-muted">per night</div>
          </div>
        </div>

        {showDescription && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink/70">{property.shortDescription}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/75">
          <span className="flex items-center gap-1.5"><PartyPopper className="h-4 w-4 text-accent" /> Up to {property.partyCapacity} people</span>
          <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-olive" /> Sleeps {property.maxGuests}</span>
        </div>

        {property.occasions.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Good for">
            {property.occasions.slice(0, 4).map((o) => (
              <li key={o} className="flex items-center gap-1 rounded-full bg-sand/60 px-2.5 py-1 text-[11px] font-semibold text-forest"><OccasionIcon name={o} className="h-3 w-3 text-accent-dark" />{o}</li>
            ))}
          </ul>
        )}

        <p className={classNames('mt-3 flex items-center gap-2 text-xs font-semibold', avail.tone === 'good' ? 'text-[#3f6b48]' : avail.tone === 'warn' ? 'text-[#8a5a14]' : 'text-[#9a3b27]')}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" /> {avail.label}
        </p>

        <div className="mt-5 flex gap-2">
          <ButtonLink to={href} variant="primary" size="sm" className="flex-1">See the place</ButtonLink>
          {property.airbnbUrl ? (
            <ButtonA href={airbnbLink(property.airbnbUrl)} target="_blank" rel="noopener noreferrer" variant="outline" size="sm" className="flex-1" iconRight={<ExternalLink className="h-3.5 w-3.5" />}>Book on Airbnb</ButtonA>
          ) : (
            <ButtonLink to={`/enquire?property=${property.slug}`} variant="outline" size="sm" className="flex-1">Book it</ButtonLink>
          )}
          <ButtonA
            href={wa(enquiryMessage({ propertyName: property.name }))}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="!px-3"
            aria-label={`Ask about ${property.name} on WhatsApp`}
            title="Ask on WhatsApp"
            icon={<WhatsAppIcon className="h-4 w-4" />}
          />
        </div>
      </div>
    </article>
  )
}
