import type { Testimonial } from '../types'

// SAMPLE reviews for layout only. They are labelled as samples on the site.
// Replace them with real guest reviews (set isSample to false) before launch.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sample guest',
    from: 'Bengaluru',
    rating: 5,
    stay: 'The Terrace House',
    text: 'Placeholder review. Replace this with a real guest’s words about throwing a birthday on the terrace under the string lights.',
    isSample: true,
  },
  {
    id: 't2',
    name: 'Sample guest',
    from: 'Delhi',
    rating: 5,
    stay: 'Skyline Penthouse',
    text: 'Placeholder review. A real guest might talk about their office farewell, the skyline from the balcony and how easy it was to sort out on WhatsApp.',
    isSample: true,
  },
  {
    id: 't3',
    name: 'Sample guest',
    from: 'Mumbai',
    rating: 5,
    stay: 'The Cyber Loft',
    text: 'Placeholder review. Swap in a real review about a movie night with friends on the projector, with food from Cyber Hub.',
    isSample: true,
  },
]
