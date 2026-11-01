import { Mail, MapPin, Phone } from 'lucide-react'
import { EnquiryForm } from '../../components/EnquiryForm'
import { ButtonA } from '../../components/ui/Button'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData } from '../../context/DataContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export function ContactPage() {
  useDocumentTitle('Contact')
  const { settings } = useData()
  const wa = useWhatsApp()
  return (
    <div className="container-page pt-32">
      <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <h1 className="font-display text-5xl font-semibold leading-none text-forest sm:text-6xl">We’d love to hear from you</h1>
          <p className="mt-5 text-ink/70">The fastest way to reach us is WhatsApp. We usually reply within a few hours.</p>
          <ButtonA href={wa('Hi! I have a question about your places.')} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg" className="mt-6" icon={<WhatsAppIcon />}>Chat on WhatsApp</ButtonA>
          <ul className="mt-10 space-y-5 text-sm">
            {settings.contactPhone && <li><a className="flex items-center gap-3 hover:text-forest" href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"><Phone className="h-4 w-4 text-forest" /></span>{settings.contactPhone}</a></li>}
            {settings.contactEmail && <li><a className="flex items-center gap-3 hover:text-forest" href={`mailto:${settings.contactEmail}`}><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"><Mail className="h-4 w-4 text-forest" /></span>{settings.contactEmail}</a></li>}
            {settings.address && <li className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream"><MapPin className="h-4 w-4 text-forest" /></span>{settings.address}</li>}
          </ul>
        </div>
        <div>
          <h2 className="mb-5 font-display text-3xl font-semibold text-forest">Send a booking enquiry</h2>
          <EnquiryForm allowPropertyChange />
        </div>
      </div>
    </div>
  )
}
