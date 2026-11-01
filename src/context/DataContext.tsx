import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultSettings } from '../data/settings'
import { availabilityService } from '../services/availabilityService'
import { bookingService, type BookingInput } from '../services/bookingService'
import { enquiryService, type EnquiryInput } from '../services/enquiryService'
import { propertyService, type PropertyInput } from '../services/propertyService'
import { clearDemoActivity, ensureSeeded, resetToDemo } from '../services/seed'
import { settingsService } from '../services/settingsService'
import type { Booking, BookingStatus, DateOverride, DateStatus, Enquiry, EnquiryStatus, ID, ISODate, Property, Settings } from '../types'
import { checkRange } from '../utils/availability'
import { formatDate } from '../utils/dates'

interface DataState {
  ready: boolean
  properties: Property[]
  enquiries: Enquiry[]
  bookings: Booking[]
  overrides: DateOverride[]
  settings: Settings
}

interface DataActions {
  refresh: () => Promise<void>
  createProperty: (input: PropertyInput) => Promise<Property>
  updateProperty: (id: ID, input: PropertyInput) => Promise<Property>
  patchProperty: (id: ID, patch: Partial<Property>) => Promise<void>
  deleteProperty: (id: ID) => Promise<void>
  createEnquiry: (input: EnquiryInput) => Promise<Enquiry>
  setEnquiryStatus: (id: ID, status: EnquiryStatus) => Promise<void>
  addEnquiryNote: (id: ID, text: string) => Promise<void>
  deleteEnquiry: (id: ID) => Promise<void>
  convertEnquiry: (id: ID) => Promise<Booking>
  createBooking: (input: BookingInput) => Promise<Booking>
  updateBooking: (id: ID, patch: Partial<Booking>) => Promise<void>
  setBookingStatus: (id: ID, status: BookingStatus) => Promise<void>
  applyDates: (propertyId: ID, dates: ISODate[], change: { status?: DateStatus; price?: number | null; note?: string }) => Promise<void>
  saveSettings: (s: Settings) => Promise<void>
  resetDemo: () => Promise<void>
  clearDemo: () => Promise<void>
}

const BOOKING_TO_ENQUIRY: Partial<Record<BookingStatus, EnquiryStatus>> = { confirmed: 'confirmed', cancelled: 'cancelled', pending: 'pending' }

const DataContext = createContext<(DataState & DataActions) | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>({
    ready: false,
    properties: [],
    enquiries: [],
    bookings: [],
    overrides: [],
    settings: defaultSettings,
  })

  const refresh = useCallback(async () => {
    ensureSeeded()
    const [properties, enquiries, bookings, overrides, settings] = await Promise.all([
      propertyService.list(),
      enquiryService.list(),
      bookingService.list(),
      availabilityService.list(),
      settingsService.get(),
    ])
    setState({ ready: true, properties, enquiries, bookings, overrides, settings })
  }, [])

  useEffect(() => {
    void refresh()
    // Keep multiple tabs in sync (e.g. admin in one tab, public site in another).
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith('wss:v5:')) void refresh()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [refresh])

  /** Throws a readable error if confirming this booking would double-book. */
  const assertBookable = useCallback(
    (b: Pick<Booking, 'propertyId' | 'checkIn' | 'checkOut'>, ignoreId?: ID) => {
      const res = checkRange(b.propertyId, b.checkIn, b.checkOut, state.overrides, state.bookings, ignoreId)
      if (!res.ok) {
        const clash = res.conflictingBookings[0]
        if (clash) throw new Error(`These dates overlap confirmed booking ${clash.reference} (${formatDate(clash.checkIn)} – ${formatDate(clash.checkOut)}).`)
        throw new Error(`Some nights are blocked or marked booked in the calendar: ${res.conflicts.map((d) => formatDate(d)).join(', ')}.`)
      }
    },
    [state.overrides, state.bookings],
  )

  const actions: DataActions = useMemo(
    () => ({
      refresh,
      async createProperty(input) {
        const p = await propertyService.create(input)
        await refresh()
        return p
      },
      async updateProperty(id, input) {
        const p = await propertyService.update(id, input)
        await refresh()
        return p
      },
      async patchProperty(id, patch) {
        await propertyService.patch(id, patch)
        await refresh()
      },
      async deleteProperty(id) {
        await propertyService.remove(id)
        await availabilityService.removeForProperty(id)
        await refresh()
      },
      async createEnquiry(input) {
        const e = await enquiryService.create(input)
        await refresh()
        return e
      },
      async setEnquiryStatus(id, status) {
        await enquiryService.setStatus(id, status)
        await refresh()
      },
      async addEnquiryNote(id, text) {
        await enquiryService.addNote(id, text)
        await refresh()
      },
      async deleteEnquiry(id) {
        await enquiryService.remove(id)
        await refresh()
      },
      async convertEnquiry(id) {
        const e = state.enquiries.find((x) => x.id === id)
        if (!e) throw new Error('Enquiry not found')
        if (e.bookingId && state.bookings.some((b) => b.id === e.bookingId)) throw new Error('This enquiry already has a booking.')
        const property = state.properties.find((p) => p.id === e.propertyId)
        const booking = await bookingService.create({
          enquiryId: e.id,
          propertyId: e.propertyId,
          propertyName: property?.name ?? e.propertyName,
          guestName: e.fullName,
          phone: e.phone,
          email: e.email,
          checkIn: e.checkIn,
          checkOut: e.checkOut,
          occasion: e.occasion,
          groupSize: e.groupSize,
          priceLines: [{ label: 'Estimated total from enquiry', amount: e.estimatedTotal }],
          total: e.estimatedTotal,
          status: 'pending',
          notes: e.specialRequests,
        })
        await enquiryService.update(id, { bookingId: booking.id, status: 'pending' })
        await refresh()
        return booking
      },
      async createBooking(input) {
        if (input.status === 'confirmed') assertBookable(input)
        const b = await bookingService.create(input)
        await refresh()
        return b
      },
      async updateBooking(id, patch) {
        const current = state.bookings.find((b) => b.id === id)
        if (!current) throw new Error('Booking not found')
        const next = { ...current, ...patch }
        if (next.checkOut <= next.checkIn) throw new Error('Check-out must be after check-in.')
        if (next.status === 'confirmed') assertBookable(next, id)
        await bookingService.update(id, patch)
        if (current.enquiryId && patch.status && patch.status !== current.status) {
          const es = BOOKING_TO_ENQUIRY[patch.status]
          if (es) await enquiryService.setStatus(current.enquiryId, es)
        }
        await refresh()
      },
      async setBookingStatus(id, status) {
        const current = state.bookings.find((b) => b.id === id)
        if (!current) throw new Error('Booking not found')
        if (status === 'confirmed') assertBookable(current, id)
        await bookingService.update(id, { status })
        // Keep the linked enquiry in step with the booking.
        if (current.enquiryId) {
          const es = BOOKING_TO_ENQUIRY[status]
          if (es) await enquiryService.setStatus(current.enquiryId, es)
        }
        await refresh()
      },
      async applyDates(propertyId, dates, change) {
        await availabilityService.apply(propertyId, dates, change)
        await refresh()
      },
      async saveSettings(s) {
        await settingsService.update(s)
        await refresh()
      },
      async resetDemo() {
        resetToDemo()
        await refresh()
      },
      async clearDemo() {
        clearDemoActivity()
        await refresh()
      },
    }),
    [refresh, state.enquiries, state.bookings, state.properties, assertBookable],
  )

  return <DataContext.Provider value={{ ...state, ...actions }}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside <DataProvider>')
  return ctx
}

export function usePublishedProperties() {
  const { properties } = useData()
  return useMemo(() => properties.filter((p) => p.published), [properties])
}
