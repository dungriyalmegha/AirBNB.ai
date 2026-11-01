import { useData } from '../context/DataContext'
import type { ISODate, Property } from '../types'
import { dayState } from '../utils/availability'
import { nightsBetween, parseISODate } from '../utils/dates'
import { classNames } from '../utils/format'
import { Calendar } from './Calendar'

/**
 * Guest-facing calendar: shows real availability and lets the guest pick a
 * check-in and check-out. A range can't cross a blocked or booked night.
 */
export function AvailabilityCalendar({
  property,
  checkIn,
  checkOut,
  onChange,
  months = 2,
}: {
  property: Property
  checkIn: ISODate
  checkOut: ISODate
  onChange: (checkIn: ISODate, checkOut: ISODate) => void
  months?: 1 | 2
}) {
  const { overrides, bookings } = useData()
  const state = (d: ISODate) => dayState(property.id, d, overrides, bookings)
  const rangeFree = (from: ISODate, to: ISODate) => nightsBetween(from, to).every((d) => state(d) === 'available')

  const click = (d: ISODate) => {
    if (checkIn && !checkOut && d > checkIn && rangeFree(checkIn, d)) return onChange(checkIn, d)
    if (state(d) !== 'available') return
    onChange(d, '')
  }

  return (
    <div>
      <Calendar
        months={months}
        initialMonth={checkIn || undefined}
        onDayClick={click}
        dayInfo={(d) => {
          const s = state(d)
          const selectingOut = !!checkIn && !checkOut
          const canBeCheckout = selectingOut && d > checkIn && rangeFree(checkIn, d)
          const isStart = d === checkIn
          const isEnd = d === checkOut
          const inRange = checkIn && checkOut && d > checkIn && d < checkOut
          const unavailable = s !== 'available'
          const disabled = s === 'past' || (unavailable && !canBeCheckout)
          return {
            disabled,
            title: s === 'booked' ? 'Booked' : s === 'blocked' ? 'Unavailable' : undefined,
            className: classNames(
              'rounded-full',
              isStart || isEnd
                ? 'bg-forest font-semibold text-ivory'
                : inRange
                  ? 'rounded-none bg-olive/15 text-forest'
                  : disabled
                    ? 'cursor-not-allowed text-muted/50 line-through decoration-muted/40'
                    : 'font-medium text-ink hover:ring-1 hover:ring-forest',
              selectingOut && !canBeCheckout && !isStart && !disabled && 'opacity-40',
            ),
            content: parseISODate(d).getDate(),
          }
        }}
      />
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full ring-1 ring-forest/40" /> Available</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-forest" /> Your dates</span>
        <span className="flex items-center gap-2"><span className="text-muted/60 line-through">12</span> Booked or unavailable</span>
        {(checkIn || checkOut) && (
          <button type="button" className="ml-auto font-semibold text-forest underline underline-offset-4" onClick={() => onChange('', '')}>
            Clear dates
          </button>
        )}
      </div>
    </div>
  )
}
