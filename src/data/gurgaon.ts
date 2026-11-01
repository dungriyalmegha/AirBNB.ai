import { unsplash } from '../utils/image'

// Local content for the Gurgaon site. Edit freely; nothing here is fetched.
// Distances and drive times are approximate.

export const CITY = 'Gurgaon'

// Placeholder until the owner uploads their own photo of DLF Cyber City
// Building 9A & 9B in Admin → Settings → Homepage photo.
// Placeholder: Cyber City, Gurugram by Ishaan Sen on Unsplash (free Unsplash License).
export const DEFAULT_HERO = unsplash('1775582336512-a8a714980243', 2400)
export const DEFAULT_HERO_ALT = 'Glass office building with the Cyber City sign in Gurgaon'

export interface Neighbourhood {
  name: string
  /** Value used for the "where" search; matches a property's area/location. */
  query: string
  blurb: string
  landmarks: string[]
  image: string
}

export const neighbourhoods: Neighbourhood[] = [
  {
    name: 'Cyber City',
    query: 'Cyber City',
    blurb: 'Gurgaon’s business heart: glass towers, Cyber Hub restaurants and the Rapid Metro.',
    landmarks: ['DLF Building 9A & 9B', 'Cyber Hub', 'Rapid Metro'],
    image: unsplash('1775582336512-a8a714980243', 1200),
  },
  {
    name: 'Golf Course Road',
    query: 'Golf Course Road',
    blurb: 'Leafy high-rise living, cafés and Galleria Market, a short drive from everything.',
    landmarks: ['Galleria Market', 'DLF Golf & Country Club', 'Sector 54 metro'],
    image: unsplash('1731520705670-6ae7e5dec0f3', 1200),
  },
  {
    name: 'Sector 29',
    query: 'Sector 29',
    blurb: 'Restaurants, bars and the green lawns of Leisure Valley Park.',
    landmarks: ['Leisure Valley Park', 'Sector 29 market', 'Millennium City Centre'],
    image: unsplash('1695667424131-a9680e0307ee', 1200),
  },
]

export const stayNear = [
  { label: 'Stays near DLF Cyber City', where: 'Cyber City' },
  { label: 'Stays near Cyber Hub', where: 'Cyber Hub' },
  { label: 'Stays near Building 9A & 9B', where: '9A' },
  { label: 'Stays on Golf Course Road', where: 'Golf Course Road' },
  { label: 'Stays near Galleria Market', where: 'Galleria' },
  { label: 'Stays in Sector 29', where: 'Sector 29' },
  { label: 'Stays near Leisure Valley Park', where: 'Leisure Valley' },
  { label: 'Stays near Ambience Mall', where: 'Ambience' },
  { label: 'Stays near IGI Airport', where: 'Airport' },
]

export const faqs = [
  {
    q: 'Can I book on Airbnb instead?',
    a: 'Yes. Several of our homes are also listed on Airbnb. Look for the “Book on Airbnb” button on a home. You can also enquire directly here or on WhatsApp and we’ll confirm with you personally.',
  },
  {
    q: 'Is my booking confirmed when I send an enquiry?',
    a: 'Not yet. An enquiry lets us check your dates. We’ll reply with availability and payment details, and your stay is confirmed once we send written confirmation.',
  },
  {
    q: 'How far are you from DLF Cyber City and the airport?',
    a: 'Each home lists nearby places and approximate distances. Our homes are within a short drive of Cyber City, and IGI Airport is usually 25–40 minutes away depending on traffic.',
  },
  {
    q: 'Do you offer weekly or monthly stays for work trips?',
    a: 'Yes. Message us with your dates on WhatsApp and we’ll share long-stay rates for the home that suits you.',
  },
  {
    q: 'How does check-in work?',
    a: 'We share check-in instructions and the exact address after your booking is confirmed. Please carry a valid photo ID for every guest.',
  },
  {
    q: 'What is your cancellation policy?',
    a: 'See our policies page for the full details. In short: free cancellation well ahead of your stay, partial refunds closer to the date.',
  },
]
