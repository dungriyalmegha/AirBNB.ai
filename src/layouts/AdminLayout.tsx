import { CalendarDays, ExternalLink, Home, Inbox, LayoutDashboard, LogOut, Menu, NotebookTabs, Settings, X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { classNames } from '../utils/format'
import { PageLoader } from './PublicLayout'
import { ThikanaMark } from '../components/Logo'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export function AdminLayout() {
  const { settings, enquiries, ready } = useData()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.title = `Admin · ${settings.businessName}` }, [settings.businessName, pathname])
  const newCount = enquiries.filter((e) => e.status === 'new').length

  const nav = [
    { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/admin/properties', label: 'Properties', Icon: Home },
    { to: '/admin/calendar', label: 'Availability', Icon: CalendarDays },
    { to: '/admin/enquiries', label: 'Enquiries', Icon: Inbox, badge: newCount },
    { to: '/admin/bookings', label: 'Bookings', Icon: NotebookTabs },
    { to: '/admin/settings', label: 'Settings', Icon: Settings },
  ]

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center gap-2.5">
          <ThikanaMark color="#F7F4EE" className="h-8 w-[27px]" />
          <div className="font-display text-2xl font-semibold leading-tight text-ivory">{settings.businessName}</div>
        </div>
        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-ivory/50">Owner dashboard</div>
      </div>
      <nav className="flex-1 space-y-1 px-3" aria-label="Admin">
        {nav.map(({ to, label, Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              classNames('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition', isActive ? 'bg-ivory text-forest' : 'text-ivory/75 hover:bg-white/10 hover:text-white')
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="flex-1">{label}</span>
            {!!badge && <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-white">{badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory/75 hover:bg-white/10 hover:text-white">
          <ExternalLink className="h-[18px] w-[18px]" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory/75 hover:bg-white/10 hover:text-white">
          <LogOut className="h-[18px] w-[18px]" /> Sign out
        </button>
        <div className="px-3 pt-2 text-[11px] text-ivory/40">{user?.email}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-forest lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="animate-fade-up absolute inset-y-0 left-0 w-72 bg-forest">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-5 rounded-full p-2 text-ivory/70 hover:bg-white/10" aria-label="Close menu"><X className="h-5 w-5" /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="bg-[#f6ead3] px-4 py-2 text-center text-xs text-[#6f4a12]">
          <strong>Demo mode:</strong> sign-in and data are stored only in this browser (localStorage). Not secure for real customer data. Connect a backend before going live.
        </div>
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-[#f3f1ec]/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-full p-2 text-forest hover:bg-cream" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <span className="font-display text-xl font-semibold text-forest">{settings.businessName}</span>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8">{ready ? <Outlet /> : <PageLoader />}</main>
      </div>
    </div>
  )
}
