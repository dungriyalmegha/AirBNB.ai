import { Compass, Heart, Home, Send } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSaved } from '../hooks/useSaved'
import { useWhatsApp } from '../hooks/useWhatsApp'
import { classNames } from '../utils/format'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

/** App-style bottom navigation on phones (property pages use their own booking bar instead). */
export function MobileTabBar() {
  const { pathname } = useLocation()
  const { saved } = useSaved()
  const wa = useWhatsApp()
  if (pathname.startsWith('/stays/')) return null
  const item = 'flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-semibold'
  const tabs = [
    { to: '/', label: 'Home', Icon: Home, end: true },
    { to: '/stays', label: 'Explore', Icon: Compass },
    { to: '/saved', label: 'Saved', Icon: Heart, badge: saved.length },
    { to: '/enquire', label: 'Enquire', Icon: Send },
  ]
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 backdrop-blur-md lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} aria-label="Quick navigation">
      <div className="mx-auto flex max-w-lg">
        {tabs.map(({ to, label, Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => classNames(item, isActive ? 'text-forest' : 'text-muted')}>
            <span className="relative">
              <Icon className="h-5 w-5" />
              {!!badge && <span className="absolute -right-2 -top-1.5 rounded-full bg-[#ff385c] px-1 text-[9px] leading-[14px] text-white">{badge}</span>}
            </span>
            {label}
          </NavLink>
        ))}
        <a href={wa('Hello! I’m looking for a stay in Gurgaon.')} target="_blank" rel="noopener noreferrer" className={classNames(item, 'text-whatsapp')}>
          <WhatsAppIcon className="h-5 w-5" /> WhatsApp
        </a>
      </div>
    </nav>
  )
}
