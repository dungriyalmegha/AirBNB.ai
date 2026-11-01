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
          <h1 className="font-display text-5xl font-semibold leading-[1.02] text-forest sm:text-6xl">A few Gurgaon flats, made for good nights</h1>
          <div className="mt-6 space-y-4 leading-relaxed text-ink/75">
            <p>{settings.businessName} is a small, owner-run collection of {count} place{count === 1 ? '' : 's'} in Gurgaon. We turned our flats into spaces you rent whole: for a slow weekend, a long dinner with friends, a movie night or a birthday.</p>
            <p>We’re not a marketplace and not a hotel. Every place is one we look after ourselves, so you get honest photos, clear prices and a real person on WhatsApp who can help with decor, a cake or where to get good food at 2 am.</p>
            <p className="text-sm text-muted">(Edit this story to tell guests about yourself, your homes and why you started.)</p>
          </div>
          <ButtonLink to="/stays" className="mt-8" iconRight={<ArrowRight className="h-4 w-4" />}>See our places</ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SmartImage src={unsplash('1715870251864-64fd4a6ae4ad', 900)} alt="Gurgaon’s high-rise skyline" className="arch aspect-[3/4] w-full" />
          <SmartImage src={unsplash('1583847268964-b28dc8f51f92', 900)} alt="Light-filled apartment living room" className="arch mt-12 aspect-[3/4] w-full" />
        </div>
      </section>
      <section className="container-page mt-24 grid gap-6 sm:grid-cols-3">
        {[
          ['The whole place', 'You rent all of it. Only your group is inside.'],
          ['Made for groups', 'Big living rooms, sound systems and space for everyone.'],
          ['Run by us', 'We live in Gurgaon and answer WhatsApp ourselves.'],
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
