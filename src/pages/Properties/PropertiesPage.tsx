import { SearchX, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PropertyCard } from '../../components/PropertyCard'
import { SearchBar, searchToQuery } from '../../components/SearchBar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { useData, usePublishedProperties } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMoney } from '../../hooks/useMoney'
import { GROUP_SIZES, occasionLabel } from '../../data/occasions'
import { OccasionIcon } from '../../components/OccasionIcon'
import { OCCASIONS, type Occasion, type PropertyType } from '../../types'
import { checkRange } from '../../utils/availability'
import { formatDate } from '../../utils/dates'
import { classNames } from '../../utils/format'
import { fromPrice, quoteStay } from '../../utils/pricing'

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'size'

export function PropertiesPage() {
  useDocumentTitle('Find a place')
  const properties = usePublishedProperties()
  const { overrides, bookings } = useData()
  const money = useMoney()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const where = params.get('where') ?? ''
  const checkIn = params.get('in') ?? ''
  const checkOut = params.get('out') ?? ''
  const people = Number(params.get('people') ?? 0)
  const plan = params.get('plan') ?? ''
  const type = (params.get('type') ?? '') as PropertyType | ''
  const maxPrice = Number(params.get('max') ?? 0)
  const sort = (params.get('sort') ?? 'featured') as Sort
  const hasDates = !!checkIn && !!checkOut && checkOut > checkIn

  const update = (patch: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v === undefined || v === '' || v === 0) next.delete(k)
      else next.set(k, String(v))
    }
    setParams(next, { replace: true })
  }

  const priceCeil = useMemo(() => Math.max(0, ...properties.map(fromPrice)), [properties])

  const results = useMemo(() => {
    const q = where.trim().toLowerCase()
    let list = properties
      .filter((p) => !q || [p.name, p.location, p.region, p.type, ...p.nearby.map((n) => n.name)].some((s) => s.toLowerCase().includes(q)))
      // Every place works as a plain stay, so Staycation matches all of them.
      .filter((p) => !plan || plan === 'Staycation' || p.occasions.includes(plan as Occasion))
      .filter((p) => !people || (plan === 'Staycation' ? p.maxGuests : p.partyCapacity) >= people)
      .filter((p) => !type || p.type === type)
      .filter((p) => !maxPrice || fromPrice(p) <= maxPrice)
      .map((p) => {
        const available = hasDates ? checkRange(p.id, checkIn, checkOut, overrides, bookings).ok : null
        const quote = hasDates ? quoteStay(p, checkIn, checkOut, people || 1, overrides) : null
        return { p, available, quote }
      })
    list = [...list].sort((a, b) => {
      if (hasDates && a.available !== b.available) return a.available ? -1 : 1
      if (sort === 'price-asc') return fromPrice(a.p) - fromPrice(b.p)
      if (sort === 'price-desc') return fromPrice(b.p) - fromPrice(a.p)
      if (sort === 'size') return b.p.partyCapacity - a.p.partyCapacity
      return Number(b.p.featured) - Number(a.p.featured)
    })
    return list
  }, [properties, where, plan, people, type, maxPrice, sort, hasDates, checkIn, checkOut, overrides, bookings])

  const activeFilters = [where && 'where', plan && 'plan', people && 'people', type && 'type', maxPrice && 'max', checkIn && 'in'].filter(Boolean).length
  const query = searchToQuery({ checkIn, checkOut, plan, people })

  return (
    <div className="pt-28">
      <section className="container-page">
        <p className="eyebrow mb-3">Find a place</p>
        <h1 className="font-display text-5xl font-semibold leading-none text-forest sm:text-6xl">{plan ? <>Homes for a <em className="font-medium text-olive">{occasionLabel(plan).toLowerCase()}</em></> : <>Whole places in Gurgaon</>}</h1>
        <p className="mt-4 max-w-xl text-ink/70">Every place is rented out whole, just for your group. Check your date, then book on Airbnb or message us.</p>
        <div className="mt-8">
          <SearchBar
            key={`${where}|${checkIn}|${checkOut}|${plan}|${people}`}
            variant="inline"
            initial={{ where, checkIn, checkOut, plan, people }}
            onSearch={(v) => update({ where: v.where, in: v.checkIn, out: v.checkOut, plan: v.plan, people: v.people })}
          />
        </div>
      </section>

      <section className="container-page mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" icon={<SlidersHorizontal className="h-4 w-4" />} onClick={() => setShowFilters((s) => !s)} aria-expanded={showFilters}>
              Filters{activeFilters ? ` (${activeFilters})` : ''}
            </Button>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              <Chip active={!plan} onClick={() => update({ plan: '' })}>Any plan</Chip>
              {OCCASIONS.map((o) => <Chip key={o} active={plan === o} onClick={() => update({ plan: o })}><OccasionIcon name={o} className={classNames('h-4 w-4', plan === o ? 'text-sand' : 'text-accent')} />{occasionLabel(o)}</Chip>)}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            Sort by
            <select value={sort} onChange={(e) => update({ sort: e.target.value === 'featured' ? '' : e.target.value })} className="rounded-full border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-olive">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="size">Biggest first</option>
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="animate-fade-up mt-5 grid gap-6 rounded-3xl bg-white p-6 shadow-soft sm:grid-cols-3">
            <label className="block">
              <span className="field-label">Area or place</span>
              <input className="field" value={where} onChange={(e) => update({ where: e.target.value })} placeholder="e.g. Cyber City, Golf Course Road" />
            </label>
            <label className="block">
              <span className="field-label">How many people</span>
              <select className="field" value={people} onChange={(e) => update({ people: Number(e.target.value) })}>
                <option value={0}>Any size</option>
                {GROUP_SIZES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Max price per night: {maxPrice ? money(maxPrice) : 'Any'}</span>
              <input
                type="range"
                min={0}
                max={Math.ceil(priceCeil / 1000) * 1000}
                step={500}
                value={maxPrice || Math.ceil(priceCeil / 1000) * 1000}
                onChange={(e) => update({ max: Number(e.target.value) >= priceCeil ? 0 : Number(e.target.value) })}
                className="mt-3 w-full accent-forest"
              />
            </label>
            <div className="sm:col-span-3 flex justify-end">
              <Button variant="ghost" size="sm" icon={<X className="h-4 w-4" />} onClick={() => setParams({}, { replace: true })}>Clear all</Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-ink/70">
          <span>{results.length} {results.length === 1 ? 'place' : 'places'}</span>
          {hasDates && <Badge tone="olive">{formatDate(checkIn, { day: 'numeric', month: 'short' })} – {formatDate(checkOut, { day: 'numeric', month: 'short' })}</Badge>}
          {people > 0 && <Badge tone="olive">{people}+ people</Badge>}
        </div>

        {results.length === 0 ? (
          <div className="mt-10">
            <EmptyState icon={<SearchX className="h-6 w-6" />} title="No places match those filters" body="Try fewer filters or different dates. You can also message us and we’ll help you find something." action={<Button variant="primary" onClick={() => setParams({}, { replace: true })}>Clear filters</Button>} />
          </div>
        ) : (
          <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ p, available, quote }) => (
              <div key={p.id} className={classNames(available === false && 'opacity-75')}>
                {hasDates && (
                  <div className="mb-3 flex items-center justify-between text-sm">
                    {available ? <Badge tone="green" dot>Available for your dates</Badge> : <Badge tone="red" dot>Not available for these dates</Badge>}
                    {available && quote && <span className="text-ink/70"><strong className="text-ink">{money(quote.total)}</strong> est. total</span>}
                  </div>
                )}
                <PropertyCard property={p} showDescription query={query} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className={classNames('flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition', active ? 'bg-forest text-ivory' : 'bg-white text-ink/70 ring-1 ring-line hover:ring-forest')}>
      {children}
    </button>
  )
}
