import type { Occasion } from '../types'
import { unsplash } from '../utils/image'

// Homepage "What's the plan?" tiles. Photos are Unsplash placeholders.
export interface OccasionInfo {
  occasion: Occasion
  title: string
  line: string
  image: string
}

export const occasionInfo: OccasionInfo[] = [
  { occasion: 'House party', title: 'House party', line: 'Music, lights and the whole place to yourselves.', image: unsplash('1545128485-c400e7702796', 900) },
  { occasion: 'Birthday', title: 'Birthday bash', line: 'Balloons up, cake out, friends stay over.', image: unsplash('1741969494307-55394e3e4071', 900) },
  { occasion: 'Office party', title: 'Office party', line: 'Team nights, farewells and launch parties.', image: unsplash('1758520144658-c87be518b87e', 900) },
  { occasion: 'Get-together', title: 'Get-together', line: 'Reunions, potlucks and long dinners.', image: unsplash('1527529482837-4698179dc6ce', 900) },
  { occasion: 'Movie night', title: 'Movie night', line: 'Projector, big sofa, zero interruptions.', image: unsplash('1663811397219-c572550dffc5', 900) },
  { occasion: 'Date night', title: 'Date night', line: 'Candles, city lights and some privacy.', image: unsplash('1513279922550-250c2129b13a', 900) },
  { occasion: 'Staycation', title: 'Staycation', line: 'Just need a break? Stay the weekend.', image: unsplash('1560448075-57d0285fc59b', 900) },
]

export const occasionLabel = (o: string) => occasionInfo.find((x) => x.occasion === o)?.title ?? o

/** Group-size choices used in search. Value is the number of people. */
export const GROUP_SIZES = [
  { value: 2, label: 'Just 2 of us' },
  { value: 6, label: 'Up to 6' },
  { value: 10, label: 'Up to 10' },
  { value: 20, label: 'Up to 20' },
  { value: 30, label: 'Up to 30' },
  { value: 40, label: '40+' },
]
