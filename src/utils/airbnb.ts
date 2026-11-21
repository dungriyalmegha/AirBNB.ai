/**
 * Adds the guest's dates to an Airbnb listing link so it opens pre-filled.
 * Group size isn't passed: party headcounts are above Airbnb's overnight-guest limit.
 */
export function airbnbLink(url: string, stay?: { checkIn?: string; checkOut?: string }): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    if (!/airbnb\./i.test(u.hostname) || !stay) return url
    if (stay.checkIn && stay.checkOut && stay.checkOut > stay.checkIn) {
      u.searchParams.set('check_in', stay.checkIn)
      u.searchParams.set('check_out', stay.checkOut)
    }
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
