import type { Testimonial } from '../types'

// SAMPLE reviews for layout only. They are labelled as samples on the site.
// Replace them with real guest reviews (set isSample to false) before launch.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sample guest',
    from: 'Bengaluru',
    rating: 5,
    stay: 'The Leisure Valley Suite',
    text: 'Placeholder review. Replace this with a real guest’s words about the quiet balcony, the walks in Leisure Valley and the Sector 29 restaurants.',
    isSample: true,
  },
  {
    id: 't2',
    name: 'Sample guest',
    from: 'Delhi',
    rating: 5,
    stay: 'Skyline Residence',
    text: 'Placeholder review. A real guest might talk about the sunset views, how easy it was to arrange the stay over WhatsApp, and the pool.',
    isSample: true,
  },
  {
    id: 't3',
    name: 'Sample guest',
    from: 'Mumbai',
    rating: 5,
    stay: 'The Cyber Loft',
    text: 'Placeholder review. Swap in a real review about the walk to the office in Cyber City, the desk setup and a good night’s sleep.',
    isSample: true,
  },
]
