import { ArrowRight, BadgeCheck, Ban, Home, Inbox, Plus, Timer, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookingStatusBadge, EnquiryStatusBadge, PageHeader, Panel, StatCard, bookingStatusMeta } from '../../components/admin/AdminUI'
import { ButtonLink } from '../../components/ui/Button'
import { useData } from '../../context/DataContext'
import { useMoney } from '../../hooks/useMoney'
import type { BookingStatus } from '../../types'
import { formatDate, formatDateTime, today } from '../../utils/dates'

export function AdminDashboard() {
  const { properties, enquiries, bookings } = useData()
  const money = useMoney()

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed')
    return {
      properties: properties.length,
      published: properties.filter((p) => p.published).length,
      enquiries: enquiries.length,
      pending: enquiries.filter((e) => ['new', 'contacted', 'pending'].includes(e.status)).length,
      confirmed: confirmed.length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      revenue: confirmed.reduce((s, b) => s + b.total, 0),
    }
  }, [properties, enquiries, bookings])

  const months = useMemo(() => {
    const out: { key: string; label: string; count: number }[] = []
    const d = new Date()
    for (let i = 5; i >= 0; i--) {
      const m = new Date(d.getFullYear(), d.getMonth() - i, 1)
      const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`
      out.push({ key, label: m.toLocaleDateString('en-GB', { month: 'short' }), count: 0 })
    }
    for (const e of enquiries) {
      const k = e.createdAt.slice(0, 7)
      const row = out.find((x) => x.key === k)
      if (row) row.count++
    }
    return out
  }, [enquiries])
  const maxMonth = Math.max(1, ...months.map((m) => m.count))

  const statusCounts = (Object.keys(bookingStatusMeta) as BookingStatus[]).map((s) => ({ s, n: bookings.filter((b) => b.status === s).length }))
  const totalBookings = Math.max(1, bookings.length)
  const barColor: Record<BookingStatus, string> = { pending: '#d8a54a', confirmed: '#4f7a57', cancelled: '#b5543c', completed: '#4f6f8e' }

  const performance = properties.map((p) => {
    const pe = enquiries.filter((e) => e.propertyId === p.id)
    const pb = bookings.filter((b) => b.propertyId === p.id && (b.status === 'confirmed' || b.status === 'completed'))
    return { p, enquiries: pe.length, bookings: pb.length, revenue: pb.reduce((s, b) => s + b.total, 0), conversion: pe.length ? Math.round((pb.length / pe.length) * 100) : 0 }
  })

  const recentEnquiries = [...enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5)
  const upcoming = bookings.filter((b) => b.checkOut >= today() && b.status !== 'cancelled').sort((a, b) => a.checkIn.localeCompare(b.checkIn)).slice(0, 5)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        actions={<ButtonLink to="/admin/properties/new" icon={<Plus className="h-4 w-4" />}>Add property</ButtonLink>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Properties" value={stats.properties} hint={`${stats.published} published`} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Enquiries" value={stats.enquiries} hint="All time" icon={<Inbox className="h-4 w-4" />} tone="accent" />
        <StatCard label="Awaiting action" value={stats.pending} hint="New, contacted or pending" icon={<Timer className="h-4 w-4" />} tone="amber" />
        <StatCard label="Confirmed" value={stats.confirmed} hint="Confirmed + completed" icon={<BadgeCheck className="h-4 w-4" />} tone="green" />
        <StatCard label="Cancelled" value={stats.cancelled} hint="Bookings" icon={<Ban className="h-4 w-4" />} tone="red" />
        <StatCard label="Est. revenue" value={<span className="text-2xl">{money(stats.revenue)}</span>} hint="From confirmed bookings" icon={<Wallet className="h-4 w-4" />} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Panel title="Enquiries per month" className="lg:col-span-2">
          <div className="flex h-56 items-end gap-3 sm:gap-6" role="img" aria-label={`Enquiries per month: ${months.map((m) => `${m.label} ${m.count}`).join(', ')}`}>
            {months.map((m) => (
              <div key={m.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold tabular-nums text-ink/70">{m.count}</span>
                <div className="w-full max-w-14 rounded-t-lg bg-forest/85 transition-all" style={{ height: `${(m.count / maxMonth) * 80 + 2}%` }} />
                <span className="text-xs text-muted">{m.label}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Booking status">
          <div className="flex h-3 overflow-hidden rounded-full bg-cream">
            {statusCounts.map(({ s, n }) => n > 0 && <div key={s} style={{ width: `${(n / totalBookings) * 100}%`, background: barColor[s] }} title={`${bookingStatusMeta[s].label}: ${n}`} />)}
          </div>
          <ul className="mt-5 space-y-3">
            {statusCounts.map(({ s, n }) => (
              <li key={s} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: barColor[s] }} />{bookingStatusMeta[s].label}</span>
                <span className="font-semibold tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs text-muted">{bookings.length} booking{bookings.length === 1 ? '' : 's'} in total</p>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Recent enquiries" action={<Link to="/admin/enquiries" className="flex items-center gap-1 text-xs font-semibold text-forest">View all <ArrowRight className="h-3 w-3" /></Link>} padded={false}>
          {recentEnquiries.length === 0 ? <p className="p-5 text-sm text-muted">No enquiries yet.</p> : (
            <ul className="divide-y divide-line/70">
              {recentEnquiries.map((e) => (
                <li key={e.id}>
                  <Link to={`/admin/enquiries?open=${e.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-ivory">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{e.fullName}</div>
                      <div className="truncate text-xs text-muted">{e.propertyName} · {formatDate(e.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(e.checkOut, { day: 'numeric', month: 'short' })} · {formatDateTime(e.createdAt)}</div>
                    </div>
                    <EnquiryStatusBadge status={e.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
        <Panel title="Upcoming bookings" action={<Link to="/admin/bookings" className="flex items-center gap-1 text-xs font-semibold text-forest">View all <ArrowRight className="h-3 w-3" /></Link>} padded={false}>
          {upcoming.length === 0 ? <p className="p-5 text-sm text-muted">No upcoming bookings.</p> : (
            <ul className="divide-y divide-line/70">
              {upcoming.map((b) => (
                <li key={b.id}>
                  <Link to={`/admin/bookings?open=${b.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-ivory">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{b.guestName}</div>
                      <div className="truncate text-xs text-muted">{b.propertyName} · {formatDate(b.checkIn, { day: 'numeric', month: 'short' })} – {formatDate(b.checkOut, { day: 'numeric', month: 'short' })} · {money(b.total)}</div>
                    </div>
                    <BookingStatusBadge status={b.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Property performance" className="mt-6" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-semibold">Property</th>
                <th className="px-5 py-3 font-semibold">Enquiries</th>
                <th className="px-5 py-3 font-semibold">Bookings</th>
                <th className="px-5 py-3 font-semibold">Conversion</th>
                <th className="px-5 py-3 text-right font-semibold">Est. revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {performance.map(({ p, enquiries: en, bookings: bk, revenue, conversion }) => (
                <tr key={p.id}>
                  <td className="px-5 py-3.5"><Link to={`/admin/properties/${p.id}`} className="font-semibold hover:text-olive">{p.name}</Link>{!p.published && <span className="ml-2 text-xs text-muted">(hidden)</span>}</td>
                  <td className="px-5 py-3.5 tabular-nums">{en}</td>
                  <td className="px-5 py-3.5 tabular-nums">{bk}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-cream"><div className="h-full bg-olive" style={{ width: `${conversion}%` }} /></div><span className="tabular-nums text-xs">{conversion}%</span></div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{money(revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}
