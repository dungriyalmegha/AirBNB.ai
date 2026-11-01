import { isValidISODate, today } from './dates'

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim())

/** Accepts international numbers: 8–15 digits after removing spaces, dashes, brackets, leading +. */
export const isPhone = (s: string) => {
  const digits = s.replace(/[\s\-()+]/g, '')
  return /^\d{8,15}$/.test(digits)
}

export function validateStayDates(checkIn: string, checkOut: string): { checkIn?: string; checkOut?: string } {
  const errors: { checkIn?: string; checkOut?: string } = {}
  if (!checkIn) errors.checkIn = 'Choose a check-in date'
  else if (!isValidISODate(checkIn)) errors.checkIn = 'Enter a valid date'
  else if (checkIn < today()) errors.checkIn = 'Check-in can’t be in the past'

  if (!checkOut) errors.checkOut = 'Choose a check-out date'
  else if (!isValidISODate(checkOut)) errors.checkOut = 'Enter a valid date'
  else if (checkIn && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in'
  return errors
}
