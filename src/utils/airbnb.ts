/** Adds the guest's dates and guest count to an Airbnb listing link so it opens pre-filled. */
export function airbnbLink(url: string, stay?: { checkIn?: string; checkOut?: string; adults?: number; children?: number }): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (!/airbnb\./i.test(u.hostname) || !stay) return url
    if (stay.checkIn && stay.checkOut && stay.checkOut > stay.checkIn) {
      u.searchParams.set('check_in', stay.checkIn)
      u.searchParams.set('check_out', stay.checkOut)
    }
    if (stay.adults) u.searchParams.set('adults', String(stay.adults))
    if (stay.children) u.searchParams.set('children', String(stay.children))
    return u.toString()
  } catch {
    return url
  }
}

export const isValidUrl = (s: string) => {
  try {
    const u = new URL(s)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}
