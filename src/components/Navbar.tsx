import { Heart, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSaved } from '../hooks/useSaved'
import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useWhatsApp } from '../hooks/useWhatsApp'
import { classNames } from '../utils/format'
import { Logo } from './Logo'
import { ButtonA } from './ui/Button'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/stays', label: 'Explore stays' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const { pathname } = useLocation()
  const overHero = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const wa = useWhatsApp()
  const { saved } = useSaved()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const transparent = overHero && !scrolled && !open
  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        transparent ? 'bg-transparent py-5' : 'border-b border-line/70 bg-ivory/90 py-3 backdrop-blur-md',
      )}
    >
      <nav className="container-page flex items-center justify-between gap-6" aria-label="Main">
        <Logo light={transparent} />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  classNames(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    transparent ? 'text-ivory/90 hover:bg-white/10 hover:text-white' : 'text-ink/75 hover:bg-cream hover:text-forest',
                    isActive && (transparent ? 'text-white' : 'bg-cream text-forest'),
                  )
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link to="/saved" aria-label={`Saved stays (${saved.length})`} className={classNames('relative hidden rounded-full p-2.5 transition sm:block', transparent ? 'text-ivory hover:bg-white/10' : 'text-forest hover:bg-cream')}>
            <Heart className="h-5 w-5" />
            {saved.length > 0 && <span className="absolute right-1 top-1 rounded-full bg-[#ff385c] px-1 text-[9px] font-bold leading-[14px] text-white">{saved.length}</span>}
          </Link>
          <div className="hidden md:block">
            <ButtonA
            href={wa('Hello! I’d like to know more about your stays.')}
            target="_blank"
            rel="noopener noreferrer"
            variant={transparent ? 'light' : 'whatsapp'}
            size="sm"
            icon={<WhatsAppIcon className="h-4 w-4" />}
          >
            WhatsApp us
          </ButtonA>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className={classNames('rounded-full p-2.5 lg:hidden', transparent ? 'text-ivory hover:bg-white/10' : 'text-forest hover:bg-cream')}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="animate-fade-up fixed inset-x-0 bottom-0 top-[65px] z-40 overflow-y-auto bg-ivory px-5 pb-10 pt-6 lg:hidden">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => classNames('block border-b border-line py-4 font-display text-3xl font-semibold', isActive ? 'text-forest' : 'text-ink/70')}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <ButtonA href={wa('Hello! I’d like to know more about your stays.')} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" full className="mt-8" icon={<WhatsAppIcon />}>
            Chat on WhatsApp
          </ButtonA>
        </div>
      )}
    </header>
  )
}
