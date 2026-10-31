import { useCallback } from 'react'
import { useData } from '../context/DataContext'
import { formatMoney } from '../utils/format'

/** Formats an amount in the currency chosen in Admin → Settings. */
export function useMoney() {
  const { settings } = useData()
  return useCallback((n: number) => formatMoney(n, settings.currency, settings.locale), [settings.currency, settings.locale])
}
