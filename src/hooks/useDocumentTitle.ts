import { useEffect } from 'react'
import { useData } from '../context/DataContext'

export function useDocumentTitle(title?: string) {
  const { settings } = useData()
  useEffect(() => {
    document.title = title ? `${title} · ${settings.businessName}` : `${settings.businessName} · Boutique stays`
  }, [title, settings.businessName])
}
