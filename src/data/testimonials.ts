import type { Testimonial } from '../types'

// SAMPLE reviews for layout only. They are labelled as samples on the site.
// Replace them with real guest reviews (set isSample to false) before launch.
export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Sample guest',
    from: 'Bengaluru',
    rating: 5,
    stay: 'Olive Grove Cottage',
    text: 'Placeholder review. Replace this with a real guest’s words about the estate walks, the breakfasts and the misty mornings on the verandah.',
    isSample: true,
  },
  {
    id: 't2',
    name: 'Sample guest',
    from: 'Mumbai',
    rating: 5,
    stay: 'Casa Ivory',
    text: 'Placeholder review. A real guest might talk about the pool, the garden, how easy it was to arrange the stay over WhatsApp, and the housekeeping.',
    isSample: true,
  },
  {
    id: 't3',
    name: 'Sample guest',
    from: 'Delhi',
    rating: 5,
    stay: 'Pine Hollow Cabin',
    text: 'Placeholder review. Swap in a real review about the mountain views, the wood stove and the caretaker’s home-cooked dinners.',
    isSample: true,
  },
]
