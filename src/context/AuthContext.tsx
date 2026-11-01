import { createContext, useContext, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'

interface AuthCtx {
  user: { email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(authService.currentUser())
  const value: AuthCtx = {
    user,
    async login(email, password) {
      const ok = await authService.login(email, password)
      if (ok) setUser(authService.currentUser())
      return ok
    },
    logout() {
      authService.logout()
      setUser(null)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
