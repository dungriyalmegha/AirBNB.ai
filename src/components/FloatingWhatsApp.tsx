import { useWhatsApp } from '../hooks/useWhatsApp'
import { WhatsAppIcon } from './ui/WhatsAppIcon'

export function FloatingWhatsApp() {
  const wa = useWhatsApp()
  return (
    <a
      href={wa('Hello! I’d like to know more about your stays.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`group fixed right-4 z-40 items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-lift transition hover:scale-105 sm:right-6 bottom-5 sm:bottom-6 hidden lg:flex`}
    >
      <WhatsAppIcon className="h-6 w-6" />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[160px] group-hover:pr-1 sm:inline">
        Chat with us
      </span>
    </a>
  )
}
