import { CalendarDays, Eye, EyeOff, Home, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/admin/AdminUI'
import { Badge } from '../../components/ui/Badge'
import { Button, ButtonLink } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { SmartImage } from '../../components/ui/SmartImage'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { useMoney } from '../../hooks/useMoney'
import type { Property } from '../../types'
import { classNames } from '../../utils/format'

export function AdminProperties() {
  const { properties, bookings, patchProperty, deleteProperty } = useData()
  const money = useMoney()
  const toast = useToast()
  const [toDelete, setToDelete] = useState<Property | null>(null)
  const [busy, setBusy] = useState(false)

  const toggle = async (p: Property, key: 'published' | 'featured') => {
    await patchProperty(p.id, { [key]: !p[key] })
    toast(key === 'published' ? (p.published ? `${p.name} is now hidden from the website` : `${p.name} is now live on the website`) : (p.featured ? 'Removed from featured' : 'Marked as featured'))
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    setBusy(true)
    await deleteProperty(toDelete.id)
    setBusy(false)
    toast(`${toDelete.name} deleted`)
    setToDelete(null)
  }

  const activeBookings = (id: string) => bookings.filter((b) => b.propertyId === id && (b.status === 'confirmed' || b.status === 'pending')).length

  return (
    <>
      <PageHeader title="Properties" subtitle={`${properties.length} total · ${properties.filter((p) => p.published).length} live on the website`} actions={<ButtonLink to="/admin/properties/new" icon={<Plus className="h-4 w-4" />}>Add property</ButtonLink>} />

      {properties.length === 0 ? (
        <EmptyState icon={<Home className="h-6 w-6" />} title="No properties yet" body="Add your first home to start receiving enquiries." action={<ButtonLink to="/admin/properties/new" icon={<Plus className="h-4 w-4" />}>Add property</ButtonLink>} />
      ) : (
        <div className="grid gap-4">
          {properties.map((p) => (
            <article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-line/70 bg-white p-4 sm:flex-row sm:items-center">
              <SmartImage src={p.images[0]?.url ?? ''} alt={p.images[0]?.alt ?? p.name} width={400} className="aspect-[16/10] w-full shrink-0 rounded-xl sm:h-24 sm:w-36" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/admin/properties/${p.id}`} className="font-display text-2xl font-semibold text-forest hover:text-olive">{p.name}</Link>
                  {p.published ? <Badge tone="green" dot>Live</Badge> : <Badge dot>Hidden</Badge>}
                  {p.featured && <Badge tone="accent">Featured</Badge>}
                </div>
                <p className="mt-0.5 text-sm text-muted">{p.type} · {p.location}</p>
                <p className="mt-1.5 text-sm text-ink/75">
                  {money(p.pricing.basePrice)}/night{p.pricing.weekendPrice ? ` · ${money(p.pricing.weekendPrice)} weekends` : ''} · up to {p.partyCapacity} people · sleeps {p.maxGuests} · {p.images.length} photos
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:justify-end">
                <IconBtn label={p.published ? 'Unpublish' : 'Publish'} onClick={() => toggle(p, 'published')}>{p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</IconBtn>
                <IconBtn label={p.featured ? 'Unfeature' : 'Feature'} onClick={() => toggle(p, 'featured')} active={p.featured}><Star className={classNames('h-4 w-4', p.featured && 'fill-current')} /></IconBtn>
                <Link to={`/admin/calendar?property=${p.id}`} className="flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-forest ring-1 ring-line hover:ring-forest/40" title="Availability"><CalendarDays className="h-4 w-4" /><span className="hidden xl:inline">Calendar</span></Link>
                {p.published && <a href={`/stays/${p.slug}`} target="_blank" rel="noopener noreferrer" className="flex h-9 items-center rounded-full px-3 text-sm font-medium text-forest ring-1 ring-line hover:ring-forest/40">View</a>}
                <ButtonLink to={`/admin/properties/${p.id}`} size="sm" icon={<Pencil className="h-3.5 w-3.5" />}>Edit</ButtonLink>
                <Button size="sm" variant="ghost" className="!text-[#a8432f]" onClick={() => setToDelete(p)} aria-label={`Delete ${p.name}`} icon={<Trash2 className="h-4 w-4" />} />
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        busy={busy}
        danger
        title="Delete property?"
        confirmLabel="Delete property"
        body={toDelete && (
          <>
            <p><strong>{toDelete.name}</strong> will be removed from the website and its calendar settings deleted. This can’t be undone.</p>
            {activeBookings(toDelete.id) > 0 && <p className="mt-3 rounded-xl bg-[#f8ebe6] p-3 text-[#8e3624]">It has {activeBookings(toDelete.id)} pending or confirmed booking(s). Those records stay in Bookings. Consider unpublishing instead.</p>}
          </>
        )}
      />
    </>
  )
}

function IconBtn({ label, onClick, children, active }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button onClick={onClick} title={label} aria-label={label} className={classNames('flex h-9 w-9 items-center justify-center rounded-full ring-1 transition', active ? 'bg-accent/15 text-accent-dark ring-accent/30' : 'text-forest ring-line hover:ring-forest/40')}>
      {children}
    </button>
  )
}
