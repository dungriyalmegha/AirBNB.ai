import { CalendarDays, MapPin, Search, Sparkles, Users } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishedProperties } from '../context/DataContext'
import { stayNear } from '../data/gurgaon'
import { GROUP_SIZES, occasionLabel } from '../data/occasions'
import { OCCASIONS } from '../types'
import { addDays, today } from '../utils/dates'
import { classNames } from '../utils/format'
import { Button } from './ui/Button'

export interface SearchValues { where: string; checkIn: string; checkOut: string; plan: string; people: number }

export function searchToQuery(v: Partial<SearchValues>): string {
  const q = new URLSearchParams()
  if (v.where) q.set('where', v.where)
  if (v.checkIn) q.set('in', v.checkIn)
  if (v.checkOut) q.set('out', v.checkOut)
  if (v.plan) q.set('plan', v.plan)
  if (v.people && v.people > 0) q.set('people', String(v.people))
  const s = q.toString()
  return s ? `?${s}` : ''
}

export function SearchBar({ initial, variant = 'hero', onSearch }: { initial?: Partial<SearchValues>; variant?: 'hero' | 'inline'; onSearch?: (v: SearchValues) => void }) {
  const properties = usePublishedProperties()
  const navigate = useNavigate()
  const [v, setV] = useState<SearchValues>({ where: '', checkIn: '', checkOut: '', plan: '', people: 0, ...initial })
  const [error, setError] = useState('')

  const options = useMemo(() => {
    const regions = [...new Set(properties.map((p) => p.region))]
    return { regions, names: properties.map((p) => p.name) }
  }, [properties])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (v.checkIn && v.checkOut && v.checkOut <= v.checkIn) return setError('Check-out must be after check-in')
    if ((v.checkIn && !v.checkOut) || (!v.checkIn && v.checkOut)) return setError('Choose both dates, or leave both empty')
    setError('')
    if (onSearch) onSearch(v)
    else navigate(`/stays${searchToQuery(v)}`)
  }

  const cell = 'flex flex-col justify-center px-5 py-3 text-left'
  const label = 'flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/60'
  const input = 'mt-1 w-full bg-transparent text-[15px] font-medium text-ink outline-none placeholder:text-muted'

  return (
    <form
      onSubmit={submit}
      className={classNames(
        'w-full rounded-[28px] bg-white text-ink',
        variant === 'hero' ? 'p-2 shadow-lift' : 'border border-line p-2 shadow-soft',
      )}
      role="search"
      aria-label="Search places"
    >
      <div className="grid grid-cols-2 gap-y-1 lg:grid-cols-[1.25fr_1fr_1fr_1.1fr_1fr_auto] lg:items-center lg:divide-x lg:divide-line">
        <label className={classNames(cell, 'col-span-2 lg:col-span-1')}>
          <span className={label}><MapPin className="h-3.5 w-3.5" /> Where in Gurgaon</span>
          <select value={v.where} onChange={(e) => setV({ ...v, where: e.target.value })} className={classNames(input, 'cursor-pointer appearance-none')}>
            <option value="">Anywhere in Gurgaon</option>
            <optgroup label="Areas of Gurgaon">
              {options.regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </optgroup>
            <optgroup label="Near a landmark">
              {stayNear.filter((l) => !options.regions.includes(l.where)).map((l) => <option key={l.where} value={l.where}>{l.label.replace(/^Stays (near|in|on) /, '')}</option>)}
            </optgroup>
            <optgroup label="Properties">
              {options.names.map((n) => <option key={n} value={n}>{n}</option>)}
            </optgroup>
          </select>
        </label>
        <label className={cell}>
          <span className={label}><CalendarDays className="h-3.5 w-3.5" /> From</span>
          <input
            type="date"
            min={today()}
            value={v.checkIn}
            onChange={(e) => {
              const checkIn = e.target.value
              setV((s) => ({ ...s, checkIn, checkOut: s.checkOut && s.checkOut > checkIn ? s.checkOut : checkIn ? addDays(checkIn, 1) : '' }))
            }}
            className={input}
            aria-label="Check-in date"
          />
        </label>
        <label className={cell}>
          <span className={label}><CalendarDays className="h-3.5 w-3.5" /> To</span>
          <input type="date" min={v.checkIn ? addDays(v.checkIn, 1) : addDays(today(), 1)} value={v.checkOut} onChange={(e) => setV({ ...v, checkOut: e.target.value })} className={input} aria-label="Check-out date" />
        </label>
        <label className={cell}>
          <span className={label}><Sparkles className="h-3.5 w-3.5" /> The vibe</span>
          <select value={v.plan} onChange={(e) => setV({ ...v, plan: e.target.value })} className={classNames(input, 'cursor-pointer appearance-none')}>
            <option value="">Anything</option>
            {OCCASIONS.map((o) => <option key={o} value={o}>{occasionLabel(o)}</option>)}
          </select>
        </label>
        <label className={cell}>
          <span className={label}><Users className="h-3.5 w-3.5" /> People</span>
          <select value={v.people} onChange={(e) => setV({ ...v, people: Number(e.target.value) })} className={classNames(input, 'cursor-pointer appearance-none')}>
            <option value={0}>Any size</option>
            {GROUP_SIZES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </label>
        <div className="col-span-2 p-1 lg:col-span-1 lg:pl-2">
          <Button type="submit" size="lg" variant="primary" full className="lg:!w-auto lg:px-6" icon={<Search className="h-4 w-4" />}>
            Search
          </Button>
        </div>
      </div>
      {error && <p className="px-5 pb-2 pt-1 text-xs font-medium text-[#a8432f]" role="alert">{error}</p>}
    </form>
  )
}
