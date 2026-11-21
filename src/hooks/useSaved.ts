import { useCallback, useSyncExternalStore } from 'react'

// Guests' saved (favourite) homes. Stored in this browser only.
const KEY = 'wss:saved'
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}
let cache = read()
const emit = () => listeners.forEach((l) => l())
window.addEventListener('storage', (e) => {
  if (e.key === KEY) { cache = read(); emit() }
})

export function useSaved() {
  const saved = useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => cache,
  )
  const toggle = useCallback((id: string) => {
    cache = cache.includes(id) ? cache.filter((x) => x !== id) : [...cache, id]
    localStorage.setItem(KEY, JSON.stringify(cache))
    emit()
  }, [])
  return { saved, isSaved: (id: string) => saved.includes(id), toggle }
}
