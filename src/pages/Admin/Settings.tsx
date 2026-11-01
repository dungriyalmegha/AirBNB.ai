import { AlertTriangle, Database, ImageIcon, RotateCcw, Save, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { PageHeader, Panel } from '../../components/admin/AdminUI'
import { Button, ButtonA } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { SelectField, TextArea, TextField } from '../../components/ui/Field'
import { WhatsAppIcon } from '../../components/ui/WhatsAppIcon'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import type { Settings } from '../../types'
import { DEFAULT_HERO } from '../../data/gurgaon'
import { SmartImage } from '../../components/ui/SmartImage'
import { formatMoney } from '../../utils/format'
import { fileToCompressedDataUrl } from '../../utils/image'
import { normalizeWhatsAppNumber, whatsappLink } from '../../utils/whatsapp'

const CURRENCIES = [
  { code: 'INR', locale: 'en-IN', label: 'Indian Rupee (₹)' },
  { code: 'USD', locale: 'en-US', label: 'US Dollar ($)' },
  { code: 'EUR', locale: 'en-IE', label: 'Euro (€)' },
  { code: 'GBP', locale: 'en-GB', label: 'British Pound (£)' },
  { code: 'AED', locale: 'en-AE', label: 'UAE Dirham (AED)' },
  { code: 'AUD', locale: 'en-AU', label: 'Australian Dollar (A$)' },
  { code: 'SGD', locale: 'en-SG', label: 'Singapore Dollar (S$)' },
  { code: 'THB', locale: 'th-TH', label: 'Thai Baht (฿)' },
  { code: 'IDR', locale: 'id-ID', label: 'Indonesian Rupiah (Rp)' },
]

export function AdminSettings() {
  const { settings, saveSettings, resetDemo, clearDemo, enquiries } = useData()
  const toast = useToast()
  const [f, setF] = useState<Settings>(settings)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<'reset' | 'clear' | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const heroRef = useRef<HTMLInputElement>(null)
  const [heroBusy, setHeroBusy] = useState(false)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setF((s) => ({ ...s, [k]: v }))
  const demoCount = enquiries.filter((e) => e.source === 'demo').length

  const save = async () => {
    const e: Record<string, string> = {}
    if (!f.businessName.trim()) e.businessName = 'Required'
    const wa = normalizeWhatsAppNumber(f.whatsappNumber)
    if (wa.length < 10 || wa.length > 15) e.whatsappNumber = 'Use full international format, digits only, e.g. 919876543210'
    if (f.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactEmail)) e.contactEmail = 'Invalid email'
    setErrors(e)
    if (Object.keys(e).length) return toast('Please fix the highlighted fields', 'error')
    setBusy(true)
    try {
      await saveSettings({ ...f, whatsappNumber: wa, businessName: f.businessName.trim() })
      toast('Settings saved. The website has been updated.')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Business details used across the website." actions={<Button onClick={save} disabled={busy} icon={<Save className="h-4 w-4" />}>{busy ? 'Saving…' : 'Save settings'}</Button>} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Business">
          <div className="grid gap-4">
            <TextField id="s-name" label="Business name" value={f.businessName} error={errors.businessName} onChange={(e) => set('businessName', e.target.value)} />
            <TextField id="s-tag" label="Tagline (footer)" value={f.tagline} onChange={(e) => set('tagline', e.target.value)} />
            <div>
              <span className="field-label">Logo</span>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-cream">{f.logoUrl ? <img src={f.logoUrl} alt="Logo preview" className="h-full w-full object-cover" /> : <span className="text-xs text-muted">None</span>}</div>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) set('logoUrl', await fileToCompressedDataUrl(file, 256, 0.9)) }} />
                <Button variant="secondary" size="sm" icon={<Upload className="h-4 w-4" />} onClick={() => logoRef.current?.click()}>Upload</Button>
                {f.logoUrl && <Button variant="ghost" size="sm" onClick={() => set('logoUrl', '')}>Remove</Button>}
              </div>
              <input value={f.logoUrl.startsWith('data:') ? '' : f.logoUrl} onChange={(e) => set('logoUrl', e.target.value)} placeholder="…or paste a logo URL" className="field mt-3 !py-2.5" aria-label="Logo URL" />
            </div>
          </div>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Homepage photo</span>} className="xl:col-span-2">
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl bg-forest">
              <SmartImage src={f.heroImageUrl || DEFAULT_HERO} alt={f.heroImageAlt} width={1200} quietFallback className="aspect-[16/9] w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <span className="absolute bottom-3 left-4 font-display text-2xl font-semibold text-white">Find Your Place to Slow Down.</span>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-ink/75">The big photo at the top of the homepage. Use your best wide, landscape shot of DLF Cyber City Building 9A &amp; 9B (at least 2000 px wide). Only use photos you took or have permission to use.</p>
              <input ref={heroRef} type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setHeroBusy(true)
                try { set('heroImageUrl', await fileToCompressedDataUrl(file, 2200, 0.82)) } catch (err) { toast(err instanceof Error ? err.message : 'Upload failed', 'error') } finally { setHeroBusy(false); e.target.value = '' }
              }} />
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" disabled={heroBusy} icon={<Upload className="h-4 w-4" />} onClick={() => heroRef.current?.click()}>{heroBusy ? 'Processing…' : 'Upload photo'}</Button>
                <Button variant="ghost" size="sm" onClick={() => set('heroImageUrl', DEFAULT_HERO)}>Use placeholder</Button>
              </div>
              <input value={f.heroImageUrl.startsWith('data:') ? '' : f.heroImageUrl} onChange={(e) => set('heroImageUrl', e.target.value)} placeholder="…or paste an image link (https://…)" className="field !py-2.5" aria-label="Homepage photo URL" />
              <TextField id="s-heroalt" label="Photo description (alt text)" value={f.heroImageAlt} onChange={(e) => set('heroImageAlt', e.target.value)} placeholder="DLF Cyber City Building 9A and 9B at dusk" />
              <p className="text-xs text-muted">Click “Save settings” to publish the new photo.</p>
            </div>
          </div>
        </Panel>

        <Panel title="WhatsApp & contact">
          <div className="grid gap-4">
            <TextField id="s-wa" label="Business WhatsApp number" value={f.whatsappNumber} error={errors.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} inputMode="tel"
              hint={<>Country code + number, no + or spaces. e.g. <code>919876543210</code> for +91 98765 43210.</>} />
            <ButtonA href={whatsappLink(f.whatsappNumber, 'Test message from my website settings')} target="_blank" rel="noopener noreferrer" variant="outline" size="sm" className="self-start" icon={<WhatsAppIcon className="h-4 w-4 text-whatsapp" />}>Test this number</ButtonA>
            <TextField id="s-phone" label="Contact phone" value={f.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} />
            <TextField id="s-email" label="Contact email" type="email" value={f.contactEmail} error={errors.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
            <TextField id="s-addr" label="Address / region" value={f.address} onChange={(e) => set('address', e.target.value)} />
          </div>
        </Panel>

        <Panel title="Social links">
          <div className="grid gap-4 sm:grid-cols-2">
            {(['instagram', 'facebook', 'youtube', 'x'] as const).map((k) => (
              <TextField key={k} id={`s-${k}`} label={k === 'x' ? 'X (Twitter)' : k[0]!.toUpperCase() + k.slice(1)} value={f.social[k]} placeholder="https://…" onChange={(e) => set('social', { ...f.social, [k]: e.target.value })} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">Leave empty to hide an icon.</p>
        </Panel>

        <Panel title="Currency & defaults">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField id="s-cur" label="Currency" value={f.currency} className="sm:col-span-2" onChange={(e) => { const c = CURRENCIES.find((x) => x.code === e.target.value)!; setF((s) => ({ ...s, currency: c.code, locale: c.locale })) }}
              hint={`Preview: ${formatMoney(12500, f.currency, f.locale)}. Changing currency doesn’t convert existing prices.`}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </SelectField>
            <TextField id="s-in" label="Default check-in" type="time" value={f.defaultCheckIn} onChange={(e) => set('defaultCheckIn', e.target.value)} hint="Used for new properties" />
            <TextField id="s-out" label="Default check-out" type="time" value={f.defaultCheckOut} onChange={(e) => set('defaultCheckOut', e.target.value)} />
          </div>
        </Panel>

        <Panel title="Policies" className="xl:col-span-2">
          <div className="grid gap-4 lg:grid-cols-3">
            <TextArea id="s-bp" label="Booking policy" rows={7} value={f.bookingPolicy} onChange={(e) => set('bookingPolicy', e.target.value)} />
            <TextArea id="s-cp" label="Cancellation policy" rows={7} value={f.cancellationPolicy} onChange={(e) => set('cancellationPolicy', e.target.value)} />
            <TextArea id="s-pp" label="Privacy" rows={7} value={f.privacyPolicy} onChange={(e) => set('privacyPolicy', e.target.value)} />
          </div>
        </Panel>

        <Panel title={<span className="flex items-center gap-2"><Database className="h-4 w-4" /> Demo data</span>} className="xl:col-span-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-2xl text-sm text-ink/75">
              Everything is saved in this browser only. {demoCount > 0 ? `There are ${demoCount} sample enquiries and their bookings to show how the dashboard works.` : 'No demo enquiries remain.'} Remove them before taking real enquiries, or reset everything to the original sample state.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" disabled={demoCount === 0} onClick={() => setConfirm('clear')}>Remove demo enquiries & bookings</Button>
              <Button variant="danger" icon={<RotateCcw className="h-4 w-4" />} onClick={() => setConfirm('reset')}>Reset all data</Button>
            </div>
          </div>
        </Panel>
      </div>
      <div className="mt-6 flex justify-end"><Button onClick={save} disabled={busy} size="lg" icon={<Save className="h-4 w-4" />}>{busy ? 'Saving…' : 'Save settings'}</Button></div>

      <ConfirmDialog open={confirm === 'clear'} onClose={() => setConfirm(null)} title="Remove demo data?" confirmLabel="Remove"
        body="Sample enquiries, bookings and blocked dates are removed. Your properties, settings and any real enquiries stay."
        onConfirm={async () => { await clearDemo(); setConfirm(null); toast('Demo enquiries and bookings removed') }} />
      <ConfirmDialog open={confirm === 'reset'} onClose={() => setConfirm(null)} danger title="Reset all data?" confirmLabel="Reset everything"
        body={<span className="flex gap-2"><AlertTriangle className="h-5 w-5 shrink-0 text-[#a8432f]" /> This replaces ALL properties, enquiries, bookings, calendar changes and settings in this browser with the original sample data. It can’t be undone.</span>}
        onConfirm={async () => { await resetDemo(); setConfirm(null); window.location.reload() }} />
    </>
  )
}
