import type { Settings } from '../types'
import { DEFAULT_HERO, DEFAULT_HERO_ALT } from './gurgaon'

export const defaultSettings: Settings = {
  businessName: 'Thikana',
  logoUrl: '',
  tagline: 'Thikana (ठिकाना): a place to call home. Thoughtfully curated stays in Gurgaon, close to Cyber City.',
  // Placeholder number — change it in Admin → Settings before going live.
  whatsappNumber: '919999999999',
  contactEmail: 'hello@thikana.example',
  contactPhone: '+91 99999 99999',
  address: 'Gurgaon, Haryana',
  social: { instagram: 'https://instagram.com/', facebook: 'https://facebook.com/', youtube: '', x: '' },
  currency: 'INR',
  locale: 'en-IN',
  defaultCheckIn: '14:00',
  defaultCheckOut: '11:00',
  heroImageUrl: DEFAULT_HERO,
  heroImageAlt: DEFAULT_HERO_ALT,
  bookingPolicy:
    'Submitting an enquiry does not confirm a booking. We will contact you within a few hours to confirm availability and share payment details. Your booking is confirmed only after we send a written confirmation and receive the advance payment.',
  cancellationPolicy:
    'Free cancellation up to 14 days before check-in. 50% refund for cancellations 7–14 days before check-in. No refund within 7 days of check-in. Date changes are subject to availability.',
  privacyPolicy:
    'We only use the details you share to respond to your enquiry and manage your stay. We never sell your information. Contact us any time to have your details removed.',
}
