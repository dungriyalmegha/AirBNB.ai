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
  { label: 'Party places near Cyber Hub', where: 'Cyber Hub' },
  { label: 'Places near DLF Cyber City', where: 'Cyber City' },
  { label: 'Places near Building 9A & 9B', where: '9A' },
  { label: 'Party places on Golf Course Road', where: 'Golf Course Road' },
  { label: 'Places near Galleria Market', where: 'Galleria' },
  { label: 'Party places in Sector 29', where: 'Sector 29' },
  { label: 'Places near Leisure Valley Park', where: 'Leisure Valley' },
  { label: 'Places near Ambience Mall', where: 'Ambience' },
  { label: 'Places near IGI Airport', where: 'Airport' },
]

/** House rules shown on the homepage. Edit to match how you actually run your places. */
export const partyRules = [
  { title: 'The whole place is yours', body: 'No reception, no shared rooms, no strangers. Just your group.' },
  { title: 'Be kind to the neighbours', body: 'Music at a sensible volume after 10 pm, as most Gurgaon societies require.' },
  { title: 'One grown-up in charge', body: 'The person booking must be 18+ and share a photo ID.' },
  { title: 'Refundable deposit', body: 'A small security deposit for parties, returned after checkout.' },
]

export const faqs = [
  {
    q: 'Can we really throw a party here?',
    a: 'Yes, that’s the point. You book the whole place, and each listing shows how many people it fits for a party and how many can stay overnight. Just keep the music sensible after 10 pm.',
  },
  {
    q: 'Do I pay per person or for the whole place?',
    a: 'For the whole place, per night. Some places include a set number of people and add a small charge per extra person. You’ll see the full estimate before you send anything.',
  },
  {
    q: 'Is there a security deposit?',
    a: 'For parties, yes: a refundable deposit that we return after checkout once everything’s in order. We’ll share the amount when we confirm your booking.',
  },
  {
    q: 'Can you help with decor, a cake or food?',
    a: 'Ask us on WhatsApp. Depending on the date we can often help arrange balloons, decor or a cake, or point you to good caterers nearby.',
  },
  {
    q: 'Can I book on Airbnb instead?',
    a: 'Yes. Places that are on Airbnb show a “Book on Airbnb” button. You can also enquire here or on WhatsApp and talk to us directly.',
  },
  {
    q: 'Is my booking confirmed when I send an enquiry?',
    a: 'Not yet. An enquiry lets us check your date. We’ll reply with availability and payment details, and your booking is confirmed once we send written confirmation.',
  },
  {
    q: 'What if we just want a quiet stay?',
    a: 'Totally fine. Every place works as a normal stay too: book it for a staycation, a family visit or a work trip.',
  },
]
