import type { ID, Property } from '../types'
import { slugify, uid } from '../utils/format'
import { KEYS } from './seed'
import { delay, storage } from './storage'

// Swap this module's internals for Supabase/Firebase/REST calls later;
// keep the function signatures and the UI won't need to change.

const read = () => storage.read<Property[]>(KEYS.properties, [])
const write = (list: Property[]) => storage.write(KEYS.properties, list)

function uniqueSlug(name: string, list: Property[], ignoreId?: ID): string {
  const base = slugify(name) || 'property'
  let slug = base
  let i = 2
  while (list.some((p) => p.slug === slug && p.id !== ignoreId)) slug = `${base}-${i++}`
  return slug
}

export type PropertyInput = Omit<Property, 'id' | 'slug' | 'createdAt' | 'updatedAt'>

export const propertyService = {
  async list(): Promise<Property[]> {
    await delay()
    return read()
  },
  async create(input: PropertyInput): Promise<Property> {
    await delay()
    const list = read()
    const now = new Date().toISOString()
    const property: Property = { ...input, id: uid('prop'), slug: uniqueSlug(input.name, list), createdAt: now, updatedAt: now }
    write([...list, property])
    return property
  },
  async update(id: ID, input: PropertyInput): Promise<Property> {
    await delay()
    const list = read()
    const existing = list.find((p) => p.id === id)
    if (!existing) throw new Error('Property not found')
    const updated: Property = {
      ...existing,
      ...input,
      slug: existing.name === input.name ? existing.slug : uniqueSlug(input.name, list, id),
      updatedAt: new Date().toISOString(),
    }
    write(list.map((p) => (p.id === id ? updated : p)))
    return updated
  },
  async patch(id: ID, patch: Partial<Property>): Promise<void> {
    await delay(60)
    write(read().map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)))
  },
  async remove(id: ID): Promise<void> {
    await delay()
    write(read().filter((p) => p.id !== id))
  },
}
