import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function PoliciesPage() {
  useDocumentTitle('Policies')
  const { settings } = useData()
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [hash])
  const sections = [
    { id: 'booking', title: 'Booking policy', body: settings.bookingPolicy },
    { id: 'cancellation', title: 'Cancellation policy', body: settings.cancellationPolicy },
    { id: 'privacy', title: 'Privacy', body: settings.privacyPolicy },
  ]
  return (
    <div className="container-page max-w-3xl pt-32">
      <p className="eyebrow mb-3">Policies</p>
      <h1 className="font-display text-5xl font-semibold text-forest sm:text-6xl">The fine print, kept simple</h1>
      <div className="mt-12 space-y-6">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="card scroll-mt-28 p-7 sm:p-9">
            <h2 className="font-display text-3xl font-semibold text-forest">{s.title}</h2>
            <div className="mt-4 space-y-3 whitespace-pre-line leading-relaxed text-ink/80">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  )
}
