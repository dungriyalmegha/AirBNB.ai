import type { Enquiry, EnquiryStatus, ID } from '../types'
import { reference, uid } from '../utils/format'
import { notificationService } from './notificationService'
import { KEYS } from './seed'
import { delay, storage } from './storage'

const read = () => storage.read<Enquiry[]>(KEYS.enquiries, [])
const write = (list: Enquiry[]) => storage.write(KEYS.enquiries, list)

export type EnquiryInput = Pick<
  Enquiry,
  'propertyId' | 'propertyName' | 'fullName' | 'phone' | 'email' | 'checkIn' | 'checkOut' | 'occasion' | 'groupSize' | 'specialRequests' | 'estimatedTotal'
>

export const enquiryService = {
  async list(): Promise<Enquiry[]> {
    await delay()
    return read()
  },
  async create(input: EnquiryInput, source: Enquiry['source'] = 'website'): Promise<Enquiry> {
    await delay(300)
    const now = new Date().toISOString()
    const enquiry: Enquiry = {
      ...input,
      id: uid('enq'),
      reference: reference('ENQ'),
      status: 'new',
      notes: [],
      source,
      createdAt: now,
      updatedAt: now,
    }
    write([enquiry, ...read()])
    // Hook for a backend to email/WhatsApp the owner. No-op in the frontend demo.
    void notificationService.newEnquiry(enquiry)
    return enquiry
  },
  async update(id: ID, patch: Partial<Enquiry>): Promise<void> {
    await delay(60)
    write(read().map((e) => (e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e)))
  },
  async setStatus(id: ID, status: EnquiryStatus): Promise<void> {
    return this.update(id, { status })
  },
  async addNote(id: ID, text: string): Promise<void> {
    await delay(60)
    write(
      read().map((e) =>
        e.id === id
          ? { ...e, notes: [...e.notes, { id: uid('note'), text, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString() }
          : e,
      ),
    )
  },
  async remove(id: ID): Promise<void> {
    await delay(60)
    write(read().filter((e) => e.id !== id))
  },
}
