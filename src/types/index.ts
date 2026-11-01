// Shared, typed data model. Every service and component reads these shapes,
// so swapping localStorage for a real database only touches /services.

export type ID = string
/** ISO calendar date, e.g. "2026-12-24" (no time, no timezone). */
export type ISODate = string

export const PROPERTY_TYPES = ['Studio', 'Apartment', 'Serviced apartment', 'Penthouse', 'Independent floor', 'Villa'] as const
export type PropertyType = (typeof PROPERTY_TYPES)[number]

export interface PropertyImage {
  id: ID
  url: string
  alt: string
}

export interface SeasonalPrice {
  id: ID
  label: string
  start: ISODate
  end: ISODate // inclusive night
  pricePerNight: number
}

export interface PropertyPricing {
  basePrice: number
  /** Applies to Friday and Saturday nights. 0 or empty = same as base. */
  weekendPrice: number
  seasonal: SeasonalPrice[]
  /** Guests included in the nightly price. */
  includedGuests: number
  /** Per extra guest, per night, above includedGuests. */
  extraGuestFee: number
  /** One-time cleaning fee per stay. */
  cleaningFee: number
  minNights: number
}

export interface NearbyAttraction {
  name: string
  distance: string
}

export interface Property {
  id: ID
  slug: string
  name: string
  type: PropertyType
  location: string
  region: string
  tagline: string
  shortDescription: string
  description: string
  images: PropertyImage[]
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  amenities: string[]
  highlights: string[]
  houseRules: string[]
  checkInTime: string // "14:00"
  checkOutTime: string // "11:00"
  locationInfo: string
  mapQuery: string
  nearby: NearbyAttraction[]
  pricing: PropertyPricing
  /** Optional link to this home's Airbnb listing. Guests can book there instantly. */
  airbnbUrl?: string
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

/** Admin overrides for individual dates. Dates with no entry are available. */
export type DateStatus = 'available' | 'blocked' | 'booked'

export interface DateOverride {
  propertyId: ID
  date: ISODate
  status?: DateStatus
  /** Special price for this single night (overrides every other rule). */
  price?: number
  note?: string
}

export type EnquiryStatus = 'new' | 'contacted' | 'pending' | 'confirmed' | 'rejected' | 'cancelled'

export interface PriceLine {
  label: string
  amount: number
}

export interface PriceQuote {
  nights: number
  nightly: { date: ISODate; price: number; reason: string }[]
  accommodation: number
  extraGuests: number
  extraGuestTotal: number
  cleaningFee: number
  total: number
  lines: PriceLine[]
}

export interface EnquiryNote {
  id: ID
  text: string
  createdAt: string
}

export interface Enquiry {
  id: ID
  reference: string
  propertyId: ID
  propertyName: string
  fullName: string
  phone: string
  email: string
  checkIn: ISODate
  checkOut: ISODate
  adults: number
  children: number
  specialRequests: string
  estimatedTotal: number
  status: EnquiryStatus
  notes: EnquiryNote[]
  bookingId?: ID
  source: 'website' | 'admin' | 'demo'
  createdAt: string
  updatedAt: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Booking {
  id: ID
  reference: string
  enquiryId?: ID
  propertyId: ID
  propertyName: string
  guestName: string
  phone: string
  email: string
  checkIn: ISODate
  checkOut: ISODate
  adults: number
  children: number
  priceLines: PriceLine[]
  total: number
  status: BookingStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export interface SocialLinks {
  instagram: string
  facebook: string
  youtube: string
  x: string
}

export interface Settings {
  businessName: string
  logoUrl: string
  tagline: string
  whatsappNumber: string // digits incl. country code, e.g. 919876543210
  contactEmail: string
  contactPhone: string
  address: string
  social: SocialLinks
  currency: string // ISO 4217
  locale: string
  defaultCheckIn: string
  defaultCheckOut: string
  /** Homepage hero photo (e.g. DLF Cyber City Building 9A/9B). */
  heroImageUrl: string
  heroImageAlt: string
  bookingPolicy: string
  cancellationPolicy: string
  privacyPolicy: string
}

export interface Testimonial {
  id: ID
  name: string
  from: string
  rating: number
  text: string
  stay: string
  /** True for placeholder copy that must be replaced by real guest reviews. */
  isSample: boolean
}
