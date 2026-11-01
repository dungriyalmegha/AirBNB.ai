import { ArrowRight } from 'lucide-react'
import { ButtonLink } from '../../components/ui/Button'
import { SmartImage } from '../../components/ui/SmartImage'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { unsplash } from '../../utils/image'

export function AboutPage() {
  useDocumentTitle('About us')
  const { settings, properties } = useData()
  const count = properties.filter((p) => p.published).length
  return (
    <div className="pt-32">
      <section className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">About us</p>
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-forest sm:text-6xl">A few Gurgaon homes, looked after properly</h1>
          <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
            <p>{settings.businessName} is a small, owner-run collection of {count} home{count === 1 ? '' : 's'} in Gurgaon, close to DLF Cyber City. We’re not a marketplace: every home is one we manage ourselves, from the linen to the welcome.</p>
            <p>That means honest photos, clear prices and a real person on the other end of WhatsApp. Whether you’re here for a week of meetings in Cyber City, a family wedding or a weekend away, we’ll help with airport pickups, local tips and anything else you need.</p>
            <p className="text-sm text-muted">(Edit this story to tell guests about yourself, your homes and why you started.)</p>
          </div>
          <ButtonLink to="/stays" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" />}>Explore our stays</ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SmartImage src={unsplash('1715870251864-64fd4a6ae4ad', 900)} alt="Gurgaon’s high-rise skyline" className="aspect-[3/4] w-full rounded-3xl" />
          <SmartImage src={unsplash('1583847268964-b28dc8f51f92', 900)} alt="Light-filled apartment living room" className="mt-12 aspect-[3/4] w-full rounded-3xl" />
        </div>
      </section>
      <section className="container-page mt-24 grid gap-6 sm:grid-cols-3">
        {[
          ['Owner-managed', 'Every home is run by us, not by a third party.'],
          ['Direct booking', 'Talk to us directly and avoid platform fees.'],
          ['Local knowledge', 'We live in Gurgaon and know the best places to eat, work and unwind.'],
        ].map(([t, b]) => (
          <div key={t} className="card p-7">
            <h2 className="font-display text-2xl font-semibold text-forest">{t}</h2>
            <p className="mt-2 text-sm text-ink/70">{b}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
