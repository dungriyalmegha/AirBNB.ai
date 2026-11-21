import type { ISODate } from '../types'

// All date math uses local calendar dates as "YYYY-MM-DD" strings so that
// timezones never shift a night by one.

export function toISODate(d: Date): ISODate {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISODate(s: ISODate): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = parseISODate(s)
  return toISODate(d) === s
}

export function today(): ISODate {
  return toISODate(new Date())
}

export function addDays(s: ISODate, n: number): ISODate {
  const d = parseISODate(s)
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

export function diffNights(checkIn: ISODate, checkOut: ISODate): number {
  const a = parseISODate(checkIn).getTime()
  const b = parseISODate(checkOut).getTime()
  return Math.round((b - a) / 86_400_000)
}

/** Nights of a stay: every date from check-in up to (not including) check-out. */
export function nightsBetween(checkIn: ISODate, checkOut: ISODate): ISODate[] {
  const out: ISODate[] = []
  const n = diffNights(checkIn, checkOut)
  for (let i = 0; i < n; i++) out.push(addDays(checkIn, i))
  return out
}

/** Two stays overlap if they share at least one night. */
export function rangesOverlap(aIn: ISODate, aOut: ISODate, bIn: ISODate, bOut: ISODate): boolean {
  return aIn < bOut && bIn < aOut
}

export function isWeekendNight(s: ISODate): boolean {
  const day = parseISODate(s).getDay()
  return day === 5 || day === 6 // Friday & Saturday nights
}

export function formatDate(s: ISODate, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }): string {
  if (!s || !isValidISODate(s)) return '—'
  return parseISODate(s).toLocaleDateString('en-GB', opts)
}

export function formatShortDate(s: ISODate): string {
  return formatDate(s, { day: 'numeric', month: 'short' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  if (Number.isNaN(h)) return hhmm
  const d = new Date(2000, 0, 1, h, m || 0)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function monthMatrix(year: number, month: number): (ISODate | null)[] {
  // Monday-first grid.
  const first = new Date(year, month, 1)
  const lead = (first.getDay() + 6) % 7
  const days = new Date(year, month + 1, 0).getDate()
  const cells: (ISODate | null)[] = Array(lead).fill(null)
  for (let d = 1; d <= days; d++) cells.push(toISODate(new Date(year, month, d)))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
