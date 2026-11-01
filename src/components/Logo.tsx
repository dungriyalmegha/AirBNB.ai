import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { classNames } from '../utils/format'

/** The Thikana mark: a Mughal arch doorway whose opening forms a "T", with a bronze lamp at its heart. */
export function ThikanaMark({ color = '#34463B', className }: { color?: string; className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M10 116V54C10 31 28 15 50 4C72 15 90 31 90 54V116H55.5V63H73V54H27V63H44.5V116Z" fill={color} />
      <circle cx="50" cy="35" r="6.5" fill="#C49A6C" />
    </svg>
  )
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  const { settings } = useData()
  return (
    <Link to="/" className={classNames('group flex items-center gap-2.5', className)} aria-label={`${settings.businessName} home`}>
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
      ) : (
        <ThikanaMark color={light ? '#F7F4EE' : '#34463B'} className="h-9 w-[30px] transition group-hover:-translate-y-0.5" />
      )}
      <span className="flex flex-col">
        <span className={classNames('font-display text-[26px] font-semibold leading-none tracking-tight', light ? 'text-ivory' : 'text-forest')}>
          {settings.businessName}
        </span>
        <span className={classNames('mt-0.5 text-[9px] font-bold uppercase tracking-[0.3em]', light ? 'text-sand' : 'text-olive')}>Stays · Gurgaon</span>
      </span>
    </Link>
  )
}
