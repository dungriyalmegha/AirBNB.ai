import { Info } from 'lucide-react'
import { ThikanaMark } from '../../components/Logo'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { TextField } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { DEMO_CREDENTIALS } from '../../services/authService'
import { unsplash } from '../../utils/image'
import { SmartImage } from '../../components/ui/SmartImage'

export function AdminLogin() {
  const { user, login } = useAuth()
  const { settings } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (user) return <Navigate to={from} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const ok = await login(email, password)
    setBusy(false)
    if (ok) navigate(from, { replace: true })
    else setError('That email and password don’t match.')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <SmartImage src={unsplash('1731520705670-6ae7e5dec0f3', 1600)} alt="" quietFallback className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-forest/55" />
        <div className="absolute bottom-12 left-12 right-12 text-ivory">
          <div className="font-display text-5xl font-semibold leading-tight">{settings.businessName}</div>
          <p className="mt-2 text-ivory/80">Owner dashboard</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-ivory px-5 py-12">
        <div className="w-full max-w-sm">
          <ThikanaMark className="h-14 w-12" />
          <h1 className="mt-6 font-display text-4xl font-semibold text-forest">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to manage properties, enquiries and bookings.</p>

          <div className="mt-6 rounded-2xl border border-[#e8d4ad] bg-[#fbf3e3] p-4 text-xs leading-relaxed text-[#6f4a12]">
            <p className="flex items-center gap-1.5 font-semibold"><Info className="h-3.5 w-3.5" /> Demo login (not secure)</p>
            <p className="mt-1">Email: <code className="font-semibold">{DEMO_CREDENTIALS.email}</code> · Password: <code className="font-semibold">{DEMO_CREDENTIALS.password}</code></p>
            <p className="mt-1">This sign-in runs only in the browser. Replace it with real authentication before going live.</p>
            <button type="button" className="mt-2 font-semibold underline underline-offset-2" onClick={() => { setEmail(DEMO_CREDENTIALS.email); setPassword(DEMO_CREDENTIALS.password) }}>Fill demo details</button>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <TextField id="email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <TextField id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required error={error} />
            <Button type="submit" full size="lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <Link to="/" className="mt-6 block text-center text-sm text-muted hover:text-forest">← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
