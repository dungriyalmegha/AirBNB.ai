import { Mail, MapPin, Phone } from 'lucide-react'
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from './ui/SocialIcons'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useWhatsApp } from '../hooks/useWhatsApp'
import { Logo } from './Logo'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

export function Footer() {
  const { settings, properties } = useData()
  const wa = useWhatsApp()
  const socials = [
    { href: settings.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: settings.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: settings.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
    { href: settings.social.x, label: 'X (Twitter)', Icon: XIcon },
  ].filter((s) => s.href)

  return (
    <footer className="mt-24 bg-forest pb-16 text-ivory/80 lg:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ivory/65">{settings.tagline}</p>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-ivory/20 transition hover:bg-ivory/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/stays" className="hover:text-white">All places</Link></li>
            <li><Link to="/about" className="hover:text-white">About us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our homes</h3>
          <ul className="space-y-2.5 text-sm">
            {properties.filter((p) => p.published).map((p) => (
              <li key={p.id}><Link to={`/stays/${p.slug}`} className="hover:text-white">{p.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4">
          <h3 className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-accent">Get in touch</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={wa('Hi! I have a question about your places.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white">
                <WhatsAppIcon className="h-4 w-4 text-accent" /> WhatsApp: +{settings.whatsappNumber}
              </a>
            </li>
            {settings.contactPhone && (
              <li><a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-accent" /> {settings.contactPhone}</a></li>
            )}
            {settings.contactEmail && (
              <li><a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 hover:text-white"><Mail className="h-4 w-4 text-accent" /> {settings.contactEmail}</a></li>
            )}
            {settings.address && <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> {settings.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {settings.businessName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/policies#booking" className="hover:text-white">Booking policy</Link>
            <Link to="/policies#cancellation" className="hover:text-white">Cancellation</Link>
            <Link to="/policies#privacy" className="hover:text-white">Privacy</Link>
            <Link to="/admin" className="hover:text-white">Owner login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
