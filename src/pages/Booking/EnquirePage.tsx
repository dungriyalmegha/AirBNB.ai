import { Clock, MessageCircle, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Stay } from '../../components/BookingWidget'
import { EnquiryForm } from '../../components/EnquiryForm'
import { SmartImage } from '../../components/ui/SmartImage'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { usePublishedProperties } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import type { Property } from '../../types'

export function EnquirePage() {
  useDocumentTitle('Enquire')
  const [params] = useSearchParams()
  const properties = usePublishedProperties()
  const wa = useWhatsApp()
  const [selected, setSelected] = useState<Property | undefined>(properties.find((p) => p.slug === params.get('property')))
  const [stay, setStay] = useState<Stay>({ checkIn: params.get('in') ?? '', checkOut: params.get('out') ?? '', adults: Math.max(1, Number(params.get('guests') ?? 2)), children: 0 })

  return (
    <div className="container-page pt-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="eyebrow mb-3">Booking enquiry</p>
          <h1 className="font-display text-5xl font-semibold leading-none text-forest sm:text-6xl">Tell us about your stay</h1>
          <p className="mb-8 mt-4 max-w-xl text-ink/70">Share your dates and we’ll confirm availability and the final price. It only takes a minute.</p>
          <EnquiryForm property={selected} allowPropertyChange stay={stay} onStayChange={setStay} onPropertyChange={setSelected} />
        </div>
        <aside className="space-y-5 lg:pt-28">
          {selected && (
            <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
              <SmartImage src={selected.images[0]?.url ?? ''} alt={selected.images[0]?.alt ?? selected.name} width={800} className="aspect-[16/10] w-full" />
              <div className="p-5">
                <div className="font-display text-2xl font-semibold text-forest">{selected.name}</div>
                <div className="text-sm text-muted">{selected.location}</div>
              </div>
            </div>
          )}
          <div className="rounded-3xl bg-cream p-6">
            <h2 className="font-display text-2xl font-semibold text-forest">What happens next</h2>
            <ol className="mt-4 space-y-4 text-sm text-ink/80">
              <li className="flex gap-3"><MessageCircle className="h-5 w-5 shrink-0 text-olive" /> We check your dates and reply on WhatsApp, phone or email.</li>
              <li className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-olive" /> If you’d like to go ahead, we share the final price and payment details.</li>
              <li className="flex gap-3"><Clock className="h-5 w-5 shrink-0 text-olive" /> Your booking is confirmed once we send written confirmation.</li>
            </ol>
            <a href={wa('Hello! I have a question before I enquire.')} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-2 text-sm font-semibold text-forest underline underline-offset-4">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" /> Questions first? Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </div>
  )
}
