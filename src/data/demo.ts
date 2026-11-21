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
      propertyName: 'Skyline Penthouse',
      guestName: 'Demo Guest (Ananya R.)',
      phone: '+91 98000 00001',
      email: 'demo.guest1@example.com',
      checkIn: addDays(t, 12),
      checkOut: addDays(t, 13),
      occasion: 'Birthday',
      groupSize: 20,
      priceLines: [
        { label: 'Accommodation · 1 night', amount: 15000 },
        { label: 'Extra people · 5 × 1 night', amount: 1500 },
        { label: 'Cleaning fee', amount: 2000 },
      ],
      total: 18500,
      status: 'confirmed',
      notes: 'Wants balloons and a cake ready by 7 pm.',
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
      checkOut: addDays(t, 21),
      occasion: 'Movie night',
      groupSize: 6,
      priceLines: [
        { label: 'Accommodation · 1 night', amount: 4200 },
        { label: 'Cleaning fee', amount: 800 },
      ],
      total: 5000,
      status: 'pending',
      notes: '',
      createdAt: ago(3),
      updatedAt: ago(3),
    },
  ]

  const enquiries: Enquiry[] = [
    {
      id: 'enq_demo_1', reference: 'ENQ-DEMO01', propertyId: 'prop_skyline', propertyName: 'Skyline Penthouse',
      fullName: 'Demo Guest (Ananya R.)', phone: '+91 98000 00001', email: 'demo.guest1@example.com',
      checkIn: addDays(t, 12), checkOut: addDays(t, 13), occasion: 'Birthday', groupSize: 20,
      specialRequests: 'Birthday for my sister. Can you arrange balloons and a cake?', estimatedTotal: 18500, status: 'confirmed',
      notes: [{ id: 'n1', text: 'Advance received via bank transfer.', createdAt: ago(8) }], bookingId: 'bk_demo_1',
      source: 'demo', createdAt: ago(10), updatedAt: ago(8),
    },
    {
      id: 'enq_demo_2', reference: 'ENQ-DEMO02', propertyId: 'prop_cyber_loft', propertyName: 'The Cyber Loft',
      fullName: 'Demo Guest (Rahul M.)', phone: '+91 98000 00002', email: 'demo.guest2@example.com',
      checkIn: addDays(t, 20), checkOut: addDays(t, 21), occasion: 'Movie night', groupSize: 6,
      specialRequests: 'Does the projector have HDMI?', estimatedTotal: 5000, status: 'pending',
      notes: [], bookingId: 'bk_demo_2', source: 'demo', createdAt: ago(4), updatedAt: ago(3),
    },
    {
      id: 'enq_demo_3', reference: 'ENQ-DEMO03', propertyId: 'prop_courtyard', propertyName: 'The Terrace House',
      fullName: 'Demo Guest (Meera K.)', phone: '+91 98000 00003', email: 'demo.guest3@example.com',
      checkIn: addDays(t, 30), checkOut: addDays(t, 31), occasion: 'Office party', groupSize: 35,
      specialRequests: 'Team farewell, we will bring our own caterer.', estimatedTotal: 21250, status: 'new',
      notes: [], source: 'demo', createdAt: ago(1), updatedAt: ago(1),
    },
    {
      id: 'enq_demo_4', reference: 'ENQ-DEMO04', propertyId: 'prop_skyline', propertyName: 'Skyline Penthouse',
      fullName: 'Demo Guest (Kabir S.)', phone: '+91 98000 00004', email: 'demo.guest4@example.com',
      checkIn: addDays(t, 45), checkOut: addDays(t, 47), occasion: 'House party', groupSize: 15,
      specialRequests: 'College reunion, some of us will stay over.', estimatedTotal: 32000, status: 'contacted',
      notes: [{ id: 'n2', text: 'Called — waiting for final headcount.', createdAt: ago(20) }],
      source: 'demo', createdAt: ago(35), updatedAt: ago(20),
    },
    {
      id: 'enq_demo_5', reference: 'ENQ-DEMO05', propertyId: 'prop_cyber_loft', propertyName: 'The Cyber Loft',
      fullName: 'Demo Guest (Sara D.)', phone: '+91 98000 00005', email: 'demo.guest5@example.com',
      checkIn: addDays(t, 5), checkOut: addDays(t, 7), occasion: 'Staycation', groupSize: 2,
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
