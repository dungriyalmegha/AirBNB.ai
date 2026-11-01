import type { DateOverride, ISODate, PriceQuote, Property } from '../types'
import { diffNights, isWeekendNight, nightsBetween } from './dates'

/**
 * Price of a single night. Priority (highest first):
 * 1. Special price set on that exact date in the availability calendar
 * 2. A seasonal price whose range covers the date
 * 3. Weekend price (Friday & Saturday nights)
 * 4. Base nightly price
 */
export function nightlyRate(property: Property, date: ISODate, overrides: DateOverride[] = []): { price: number; reason: string } {
  const special = overrides.find((o) => o.propertyId === property.id && o.date === date && o.price && o.price > 0)
  if (special?.price) return { price: special.price, reason: 'Special date price' }

  const season = property.pricing.seasonal.find((s) => date >= s.start && date <= s.end && s.pricePerNight > 0)
  if (season) return { price: season.pricePerNight, reason: season.label || 'Seasonal price' }

  if (isWeekendNight(date) && property.pricing.weekendPrice > 0) {
    return { price: property.pricing.weekendPrice, reason: 'Weekend' }
  }
  return { price: property.pricing.basePrice, reason: 'Standard' }
}

export function quoteStay(
  property: Property,
  checkIn: ISODate,
  checkOut: ISODate,
  guests: number,
  overrides: DateOverride[] = [],
): PriceQuote | null {
  if (!checkIn || !checkOut) return null
  const n = diffNights(checkIn, checkOut)
  if (!(n > 0)) return null

  const nightly = nightsBetween(checkIn, checkOut).map((date) => ({ date, ...nightlyRate(property, date, overrides) }))
  const accommodation = nightly.reduce((s, x) => s + x.price, 0)
  const extraGuests = Math.max(0, guests - property.pricing.includedGuests)
  const extraGuestTotal = extraGuests * property.pricing.extraGuestFee * n
  const cleaningFee = property.pricing.cleaningFee
  const total = accommodation + extraGuestTotal + cleaningFee

  const lines = [{ label: `Accommodation · ${n} night${n > 1 ? 's' : ''}`, amount: accommodation }]
  if (extraGuestTotal > 0) lines.push({ label: `Extra people · ${extraGuests} × ${n} night${n > 1 ? 's' : ''}`, amount: extraGuestTotal })
  if (cleaningFee > 0) lines.push({ label: 'Cleaning fee', amount: cleaningFee })

  return { nights: n, nightly, accommodation, extraGuests, extraGuestTotal, cleaningFee, total, lines }
}

/** Lowest nightly price a guest could see, for "from" labels. */
export function fromPrice(property: Property): number {
  const candidates = [property.pricing.basePrice]
  if (property.pricing.weekendPrice > 0) candidates.push(property.pricing.weekendPrice)
  return Math.min(...candidates)
}
