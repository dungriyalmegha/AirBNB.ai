import { seedDemoActivity } from '../data/demo'
import { seedProperties } from '../data/properties'
import { defaultSettings } from '../data/settings'
import { storage } from './storage'

export const KEYS = {
  properties: 'properties',
  enquiries: 'enquiries',
  bookings: 'bookings',
  overrides: 'availability',
  settings: 'settings',
  seeded: 'seeded',
} as const

/** First visit: load sample properties and demo admin activity. */
export function ensureSeeded(): void {
  if (storage.has(KEYS.seeded)) return
  resetToDemo()
}

export function resetToDemo(): void {
  const demo = seedDemoActivity()
  storage.write(KEYS.properties, seedProperties)
  storage.write(KEYS.enquiries, demo.enquiries)
  storage.write(KEYS.bookings, demo.bookings)
  storage.write(KEYS.overrides, demo.overrides)
  storage.write(KEYS.settings, defaultSettings)
  storage.write(KEYS.seeded, new Date().toISOString())
}

/** Removes demo enquiries/bookings but keeps properties and settings. */
export function clearDemoActivity(): void {
  const enquiries = storage.read<{ source: string; id: string }[]>(KEYS.enquiries, [])
  const bookings = storage.read<{ id: string }[]>(KEYS.bookings, [])
  storage.write(KEYS.enquiries, enquiries.filter((e) => e.source !== 'demo'))
  storage.write(KEYS.bookings, bookings.filter((b) => !b.id.startsWith('bk_demo_')))
  const overrides = storage.read<{ note?: string }[]>(KEYS.overrides, [])
  storage.write(KEYS.overrides, overrides.filter((o) => o.note !== 'Owner maintenance'))
}
