import type { DateOverride, DateStatus, ID, ISODate } from '../types'
import { KEYS } from './seed'
import { delay, storage } from './storage'

const read = () => storage.read<DateOverride[]>(KEYS.overrides, [])
const write = (list: DateOverride[]) => storage.write(KEYS.overrides, list)

const clean = (o: DateOverride) => (o.status && o.status !== 'available') || (o.price && o.price > 0) || o.note

export const availabilityService = {
  async list(): Promise<DateOverride[]> {
    await delay(60)
    return read()
  },
  /** Set status (and optionally a special price) for many dates at once. */
  async apply(propertyId: ID, dates: ISODate[], change: { status?: DateStatus; price?: number | null; note?: string }): Promise<void> {
    await delay(60)
    const list = read()
    const map = new Map(list.map((o) => [`${o.propertyId}|${o.date}`, o]))
    for (const date of dates) {
      const key = `${propertyId}|${date}`
      const current: DateOverride = map.get(key) ?? { propertyId, date }
      const next: DateOverride = { ...current }
      if (change.status) next.status = change.status
      if (change.price === null) delete next.price
      else if (typeof change.price === 'number') next.price = change.price
      if (change.note !== undefined) next.note = change.note || undefined
      if (next.status === 'available') delete next.status
      map.set(key, next)
    }
    write([...map.values()].filter(clean))
  },
  async removeForProperty(propertyId: ID): Promise<void> {
    write(read().filter((o) => o.propertyId !== propertyId))
  },
}
