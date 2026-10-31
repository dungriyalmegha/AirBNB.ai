import type { Booking, ID } from '../types'
import { reference, uid } from '../utils/format'
import { KEYS } from './seed'
import { delay, storage } from './storage'

const read = () => storage.read<Booking[]>(KEYS.bookings, [])
const write = (list: Booking[]) => storage.write(KEYS.bookings, list)

export type BookingInput = Omit<Booking, 'id' | 'reference' | 'createdAt' | 'updatedAt'>

// Overlap rules are enforced in the data context (it has availability too).
// A real backend should enforce them again in the database (e.g. an exclusion
// constraint) so two people can't confirm the same dates at once.

export const bookingService = {
  async list(): Promise<Booking[]> {
    await delay()
    return read()
  },
  async create(input: BookingInput): Promise<Booking> {
    await delay()
    const now = new Date().toISOString()
    const booking: Booking = { ...input, id: uid('bk'), reference: reference('BK'), createdAt: now, updatedAt: now }
    write([booking, ...read()])
    return booking
  },
  async update(id: ID, patch: Partial<Booking>): Promise<void> {
    await delay(60)
    write(read().map((b) => (b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b)))
  },
  async remove(id: ID): Promise<void> {
    await delay(60)
    write(read().filter((b) => b.id !== id))
  },
}
