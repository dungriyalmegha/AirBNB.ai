import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { classNames } from '../utils/format'

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  const { settings } = useData()
  return (
    <Link to="/" className={classNames('group flex items-center gap-2.5', className)} aria-label={`${settings.businessName} home`}>
      {settings.logoUrl ? (
        <img src={settings.logoUrl} alt="" className="h-9 w-9 rounded-xl object-cover" />
      ) : (
        <span className={classNames('flex h-9 w-9 items-center justify-center rounded-xl transition', light ? 'bg-ivory/15 ring-1 ring-ivory/40' : 'bg-forest')}>
          <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
            <path d="M14 40 32 18l18 22" fill="none" stroke="#F7F4EE" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M24 46h16" stroke="#C49A6C" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </span>
      )}
      <span className={classNames('font-display text-[22px] font-semibold leading-none tracking-tight', light ? 'text-ivory' : 'text-forest')}>
        {settings.businessName}
      </span>
    </Link>
  )
}
