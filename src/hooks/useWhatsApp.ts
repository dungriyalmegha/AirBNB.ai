import { useData } from '../context/DataContext'
import { whatsappLink } from '../utils/whatsapp'

export function useWhatsApp() {
  const { settings } = useData()
  return (message?: string) => whatsappLink(settings.whatsappNumber, message)
}
