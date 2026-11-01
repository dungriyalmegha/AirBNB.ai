import type { Booking, DateOverride, Enquiry } from '../types'
import { addDays, today } from '../utils/dates'

// Demo enquiries and bookings so the admin dashboard has something to show.
// They're tagged source: 'demo' and can be cleared from Admin → Settings.
// They are never shown on the public website.

export function seedDemoActivity(): { enquiries: Enquiry[]; bookings: Booking[]; overrides: DateOverride[] } {
  const t = today()
  const ago = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toISOString()
  }

  const bookings: Booking[] = [
    {
      id: 'bk_demo_1',
      reference: 'BK-DEMO01',
      enquiryId: 'enq_demo_1',
      propertyId: 'prop_skyline',
      propertyName: 'Skyline Residence',
      guestName: 'Demo Guest (Ananya R.)',
      phone: '+91 98000 00001',
      email: 'demo.guest1@example.com',
      checkIn: addDays(t, 12),
      checkOut: addDays(t, 15),
      adults: 4,
      children: 1,
      priceLines: [
        { label: 'Accommodation · 3 nights', amount: 24500 },
        { label: 'Extra guest fee · 1 guest × 3 nights', amount: 2400 },
        { label: 'Cleaning fee', amount: 800 },
      ],
      total: 27700,
      status: 'confirmed',
      notes: 'Airport pickup requested.',
      createdAt: ago(9),
      updatedAt: ago(8),
    },
    {
      id: 'bk_demo_2',
      reference: 'BK-DEMO02',
      enquiryId: 'enq_demo_2',
      propertyId: 'prop_cyber_loft',
      propertyName: 'The Cyber Loft',
      guestName: 'Demo Guest (Rahul M.)',
      phone: '+91 98000 00002',
      email: 'demo.guest2@example.com',
      checkIn: addDays(t, 20),
      checkOut: addDays(t, 23),
      adults: 2,
      children: 0,
      priceLines: [
        { label: 'Accommodation · 3 nights', amount: 13800 },
        { label: 'Cleaning fee', amount: 500 },
      ],
      total: 14300,
      status: 'pending',
      notes: '',
      createdAt: ago(3),
      updatedAt: ago(3),
    },
  ]

  const enquiries: Enquiry[] = [
    {
      id: 'enq_demo_1', reference: 'ENQ-DEMO01', propertyId: 'prop_skyline', propertyName: 'Skyline Residence',
      fullName: 'Demo Guest (Ananya R.)', phone: '+91 98000 00001', email: 'demo.guest1@example.com',
      checkIn: addDays(t, 12), checkOut: addDays(t, 15), adults: 4, children: 1,
      specialRequests: 'Airport pickup from T3, please.', estimatedTotal: 27700, status: 'confirmed',
      notes: [{ id: 'n1', text: 'Advance received via bank transfer.', createdAt: ago(8) }], bookingId: 'bk_demo_1',
      source: 'demo', createdAt: ago(10), updatedAt: ago(8),
    },
    {
      id: 'enq_demo_2', reference: 'ENQ-DEMO02', propertyId: 'prop_cyber_loft', propertyName: 'The Cyber Loft',
      fullName: 'Demo Guest (Rahul M.)', phone: '+91 98000 00002', email: 'demo.guest2@example.com',
      checkIn: addDays(t, 20), checkOut: addDays(t, 23), adults: 2, children: 0,
      specialRequests: 'Need a desk for work.', estimatedTotal: 14300, status: 'pending',
      notes: [], bookingId: 'bk_demo_2', source: 'demo', createdAt: ago(4), updatedAt: ago(3),
    },
    {
      id: 'enq_demo_3', reference: 'ENQ-DEMO03', propertyId: 'prop_courtyard', propertyName: 'The Courtyard Suite',
      fullName: 'Demo Guest (Meera K.)', phone: '+91 98000 00003', email: 'demo.guest3@example.com',
      checkIn: addDays(t, 30), checkOut: addDays(t, 32), adults: 2, children: 1,
      specialRequests: 'Early check-in if possible.', estimatedTotal: 12700, status: 'new',
      notes: [], source: 'demo', createdAt: ago(1), updatedAt: ago(1),
    },
    {
      id: 'enq_demo_4', reference: 'ENQ-DEMO04', propertyId: 'prop_skyline', propertyName: 'Skyline Residence',
      fullName: 'Demo Guest (Kabir S.)', phone: '+91 98000 00004', email: 'demo.guest4@example.com',
      checkIn: addDays(t, 45), checkOut: addDays(t, 48), adults: 4, children: 0,
      specialRequests: 'Family visiting for a wedding.', estimatedTotal: 25300, status: 'contacted',
      notes: [{ id: 'n2', text: 'Called — waiting for final headcount.', createdAt: ago(20) }],
      source: 'demo', createdAt: ago(35), updatedAt: ago(20),
    },
    {
      id: 'enq_demo_5', reference: 'ENQ-DEMO05', propertyId: 'prop_cyber_loft', propertyName: 'The Cyber Loft',
      fullName: 'Demo Guest (Sara D.)', phone: '+91 98000 00005', email: 'demo.guest5@example.com',
      checkIn: addDays(t, 5), checkOut: addDays(t, 7), adults: 2, children: 0,
      specialRequests: '', estimatedTotal: 9500, status: 'cancelled',
      notes: [], source: 'demo', createdAt: ago(65), updatedAt: ago(60),
    },
  ]

  const overrides: DateOverride[] = [
    { propertyId: 'prop_courtyard', date: addDays(t, 8), status: 'blocked', note: 'Owner maintenance' },
    { propertyId: 'prop_courtyard', date: addDays(t, 9), status: 'blocked', note: 'Owner maintenance' },
  ]

  return { enquiries, bookings, overrides }
}
