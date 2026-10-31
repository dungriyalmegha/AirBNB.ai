import type { Booking, DateOverride, DateStatus, ID, ISODate } from '../types'
import { addDays, nightsBetween, rangesOverlap, today } from './dates'

export type DayState = DateStatus | 'past'

/** Bookings that hold dates. Pending enquiries never block a calendar. */
export const holdsDates = (b: Booking) => b.status === 'confirmed'

export function dayState(propertyId: ID, date: ISODate, overrides: DateOverride[], bookings: Booking[]): DayState {
  if (date < today()) return 'past'
  if (bookings.some((b) => b.propertyId === propertyId && holdsDates(b) && date >= b.checkIn && date < b.checkOut)) return 'booked'
  const o = overrides.find((x) => x.propertyId === propertyId && x.date === date)
  if (o?.status === 'booked') return 'booked'
  if (o?.status === 'blocked') return 'blocked'
  return 'available'
}

export interface RangeCheck {
  ok: boolean
  conflicts: ISODate[]
  conflictingBookings: Booking[]
}

/** Can these nights be booked? Optionally ignore one booking (when editing it). */
export function checkRange(
  propertyId: ID,
  checkIn: ISODate,
  checkOut: ISODate,
  overrides: DateOverride[],
  bookings: Booking[],
  ignoreBookingId?: ID,
): RangeCheck {
  const others = bookings.filter((b) => b.id !== ignoreBookingId)
  const conflictingBookings = others.filter(
    (b) => b.propertyId === propertyId && holdsDates(b) && rangesOverlap(checkIn, checkOut, b.checkIn, b.checkOut),
  )
  const conflicts = nightsBetween(checkIn, checkOut).filter((d) => {
    const o = overrides.find((x) => x.propertyId === propertyId && x.date === d)
    return o?.status === 'blocked' || o?.status === 'booked' || conflictingBookings.some((b) => d >= b.checkIn && d < b.checkOut)
  })
  return { ok: conflicts.length === 0, conflicts, conflictingBookings }
}

/** Number of open nights in the next `days` days. */
export function openNights(propertyId: ID, overrides: DateOverride[], bookings: Booking[], days = 30): number {
  let n = 0
  const t = today()
  for (let i = 0; i < days; i++) if (dayState(propertyId, addDays(t, i), overrides, bookings) === 'available') n++
  return n
}

export type AvailabilityLabel = { tone: 'good' | 'warn' | 'bad'; label: string }

export function availabilityLabel(open: number, days = 30): AvailabilityLabel {
  if (open === 0) return { tone: 'bad', label: `Fully booked next ${days} days` }
  if (open <= 7) return { tone: 'warn', label: `Only ${open} night${open > 1 ? 's' : ''} open in the next ${days} days` }
  return { tone: 'good', label: `${open} nights open in the next ${days} days` }
}
