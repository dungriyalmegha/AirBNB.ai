// Tiny localStorage wrapper. Everything persistent goes through here, so the
// rest of the app never touches localStorage directly.
//
// NOTE: localStorage lives in one browser on one device. It is fine for a demo,
// but it is not shared between devices or users and is not secure storage.

// Bumping the version reseeds sample data in browsers that saw an older version.
const NAMESPACE = 'wss:v5:'

export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(NAMESPACE + key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  },
  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(NAMESPACE + key, JSON.stringify(value))
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        throw new Error('Browser storage is full. Use image URLs instead of uploads, or remove some photos.')
      }
      throw e
    }
  },
  remove(key: string): void {
    localStorage.removeItem(NAMESPACE + key)
  },
  has(key: string): boolean {
    return localStorage.getItem(NAMESPACE + key) !== null
  },
}

/** Simulates network latency so loading states are exercised like a real API. */
export const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms))
