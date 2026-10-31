import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { ISODate } from '../types'
import { monthMatrix, parseISODate, today } from '../utils/dates'
import { classNames } from '../utils/format'

export interface DayInfo {
  disabled?: boolean
  className?: string
  content?: ReactNode
  title?: string
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

/** Generic month calendar. Callers decide how each day looks and what a click does. */
export function Calendar({
  months = 2,
  initialMonth,
  dayInfo,
  onDayClick,
  minMonth,
  dense,
}: {
  months?: 1 | 2
  initialMonth?: ISODate
  dayInfo: (date: ISODate) => DayInfo
  onDayClick?: (date: ISODate, e: React.MouseEvent) => void
  minMonth?: ISODate
  dense?: boolean
}) {
  const start = parseISODate(initialMonth ?? today())
  const [cursor, setCursor] = useState({ y: start.getFullYear(), m: start.getMonth() })
  const min = parseISODate(minMonth ?? today())
  const canPrev = cursor.y > min.getFullYear() || (cursor.y === min.getFullYear() && cursor.m > min.getMonth())

  const shift = (d: number) =>
    setCursor(({ y, m }) => {
      const nm = m + d
      return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 }
    })

  const list = Array.from({ length: months }, (_, i) => {
    const nm = cursor.m + i
    return { y: cursor.y + Math.floor(nm / 12), m: nm % 12 }
  })

  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 flex justify-between">
        <button type="button" onClick={() => shift(-1)} disabled={!canPrev} className="flex h-9 w-9 items-center justify-center rounded-full text-forest transition hover:bg-cream disabled:opacity-25" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => shift(1)} className="flex h-9 w-9 items-center justify-center rounded-full text-forest transition hover:bg-cream" aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className={classNames('grid gap-8', months === 2 && 'md:grid-cols-2')}>
        {list.map(({ y, m }, idx) => (
          <div key={`${y}-${m}`} className={classNames(idx === 1 && 'hidden md:block')}>
            <div className="mb-4 flex h-9 items-center justify-center font-display text-xl font-semibold text-forest">
              {new Date(y, m, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </div>
            <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase tracking-wider text-muted">
              {WEEKDAYS.map((d) => <div key={d} className="pb-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
              {monthMatrix(y, m).map((date, i) => {
                if (!date) return <div key={i} />
                const info = dayInfo(date)
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={info.disabled}
                    title={info.title}
                    onClick={(e) => onDayClick?.(date, e)}
                    className={classNames(
                      'relative mx-auto flex w-full flex-col items-center justify-center text-sm transition',
                      dense ? 'h-10' : 'h-11 sm:h-12',
                      info.className,
                    )}
                    aria-label={`${parseISODate(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}${info.title ? `, ${info.title}` : ''}`}
                  >
                    {info.content ?? parseISODate(date).getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
