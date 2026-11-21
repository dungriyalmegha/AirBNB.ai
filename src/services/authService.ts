// DEMO AUTHENTICATION ONLY.
// Credentials live in the browser bundle, so anyone can read them. This exists
// to demonstrate the admin flow. Before going live, replace it with real auth
// (e.g. Supabase Auth, Clerk, Auth0) and protect the data on the server.

export const DEMO_CREDENTIALS = { email: 'admin@demo.com', password: 'demo1234' }

const SESSION_KEY = 'wss:demo-admin-session'

export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 400))
    const ok = email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
    if (ok) sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: DEMO_CREDENTIALS.email, at: Date.now() }))
    return ok
  },
  logout(): void {
    sessionStorage.removeItem(SESSION_KEY)
  },
  currentUser(): { email: string } | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      return raw ? (JSON.parse(raw) as { email: string }) : null
    } catch {
      return null
    }
  },
}
