import { Heart } from 'lucide-react'
import { PropertyCard } from '../../components/PropertyCard'
import { ButtonLink } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { usePublishedProperties } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useSaved } from '../../hooks/useSaved'

export function SavedPage() {
  useDocumentTitle('Saved stays')
  const properties = usePublishedProperties()
  const { saved } = useSaved()
  const list = properties.filter((p) => saved.includes(p.id))
  return (
    <div className="container-page pt-32">
      <p className="eyebrow mb-3">Your shortlist</p>
      <h1 className="font-display text-5xl font-semibold leading-none text-forest sm:text-6xl">Saved stays</h1>
      <p className="mt-4 text-ink/70">Tap the heart on any home to keep it here. Saved on this device only.</p>
      {list.length === 0 ? (
        <div className="mt-10"><EmptyState icon={<Heart className="h-6 w-6" />} title="Nothing saved yet" body="Browse our homes in Gurgaon and tap the heart to build your shortlist." action={<ButtonLink to="/stays">Explore stays</ButtonLink>} /></div>
      ) : (
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <PropertyCard key={p.id} property={p} showDescription />)}
        </div>
      )}
    </div>
  )
}
