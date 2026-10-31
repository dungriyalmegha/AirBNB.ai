import { CalendarDays, MapPin, Search, Users } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishedProperties } from '../context/DataContext'
import { addDays, today } from '../utils/dates'
import { classNames } from '../utils/format'
import { Button } from './ui/Button'

export interface SearchValues { where: string; checkIn: string; checkOut: string; guests: number }

export function searchToQuery(v: Partial<SearchValues>): string {
  const q = new URLSearchParams()
  if (v.where) q.set('where', v.where)
  if (v.checkIn) q.set('in', v.checkIn)
  if (v.checkOut) q.set('out', v.checkOut)
  if (v.guests && v.guests > 0) q.set('guests', String(v.guests))
  const s = q.toString()
  return s ? `?${s}` : ''
}

export function SearchBar({ initial, variant = 'hero', onSearch }: { initial?: Partial<SearchValues>; variant?: 'hero' | 'inline'; onSearch?: (v: SearchValues) => void }) {
  const properties = usePublishedProperties()
  const navigate = useNavigate()
  const [v, setV] = useState<SearchValues>({ where: '', checkIn: '', checkOut: '', guests: 2, ...initial })
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
      aria-label="Search stays"
    >
      <div className="grid grid-cols-2 gap-y-1 md:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] md:items-center md:divide-x md:divide-line">
        <label className={classNames(cell, 'col-span-2 md:col-span-1')}>
          <span className={label}><MapPin className="h-3.5 w-3.5" /> Where</span>
          <select value={v.where} onChange={(e) => setV({ ...v, where: e.target.value })} className={classNames(input, 'cursor-pointer appearance-none')}>
            <option value="">All destinations</option>
            <optgroup label="Destinations">
              {options.regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </optgroup>
            <optgroup label="Properties">
              {options.names.map((n) => <option key={n} value={n}>{n}</option>)}
            </optgroup>
          </select>
        </label>
        <label className={cell}>
          <span className={label}><CalendarDays className="h-3.5 w-3.5" /> Check-in</span>
          <input
            type="date"
            min={today()}
            value={v.checkIn}
            onChange={(e) => {
              const checkIn = e.target.value
              setV((s) => ({ ...s, checkIn, checkOut: s.checkOut && s.checkOut > checkIn ? s.checkOut : checkIn ? addDays(checkIn, 2) : '' }))
            }}
            className={input}
            aria-label="Check-in date"
          />
        </label>
        <label className={cell}>
          <span className={label}><CalendarDays className="h-3.5 w-3.5" /> Check-out</span>
          <input type="date" min={v.checkIn ? addDays(v.checkIn, 1) : addDays(today(), 1)} value={v.checkOut} onChange={(e) => setV({ ...v, checkOut: e.target.value })} className={input} aria-label="Check-out date" />
        </label>
        <label className={classNames(cell, 'col-span-2 md:col-span-1')}>
          <span className={label}><Users className="h-3.5 w-3.5" /> Guests</span>
          <select value={v.guests} onChange={(e) => setV({ ...v, guests: Number(e.target.value) })} className={classNames(input, 'cursor-pointer appearance-none')}>
            {Array.from({ length: 12 }, (_, n) => n + 1).map((n) => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}
          </select>
        </label>
        <div className="col-span-2 p-1 md:col-span-1 md:pl-2">
          <Button type="submit" size="lg" variant="primary" full className="md:!w-auto md:px-6" icon={<Search className="h-4 w-4" />}>
            Search
          </Button>
        </div>
      </div>
      {error && <p className="px-5 pb-2 pt-1 text-xs font-medium text-[#a8432f]" role="alert">{error}</p>}
    </form>
  )
}
