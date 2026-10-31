import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type Tone = 'success' | 'error' | 'info'
interface Toast { id: number; tone: Tone; message: string }

const Ctx = createContext<(message: string, tone?: Tone) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback((message: string, tone: Tone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, tone, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])
  const Icon = { success: CheckCircle2, error: XCircle, info: Info }
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => {
          const I = Icon[t.tone]
          return (
            <div
              key={t.id}
              role="status"
              className={`toast-in pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-sm shadow-lift ${
                t.tone === 'error' ? 'bg-[#5b2a22] text-white' : 'bg-forest text-ivory'
              }`}
            >
              <I className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{t.message}</span>
            </div>
          )
        })}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
