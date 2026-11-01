import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Link2, Plus, Save, Star, Trash2, Upload, X } from 'lucide-react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader, Panel } from '../../components/admin/AdminUI'
import { AmenityIcon } from '../../components/AmenityIcon'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'
import { SelectField, TextArea, TextField, Toggle } from '../../components/ui/Field'
import { SmartImage } from '../../components/ui/SmartImage'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import type { PropertyInput } from '../../services/propertyService'
import { PROPERTY_TYPES, type NearbyAttraction, type Property, type PropertyType, type SeasonalPrice } from '../../types'
import { isValidUrl } from '../../utils/airbnb'
import { classNames, uid } from '../../utils/format'
import { fileToCompressedDataUrl } from '../../utils/image'

const COMMON_AMENITIES = [
  'Wi-Fi', 'Air conditioning', 'Workspace', 'Kitchen', 'Power backup', 'Free parking', 'Lift', 'Security', 'Swimming pool', 'Gym', 'Balcony',
  'Smart TV', 'Washing machine', 'Housekeeping', 'Self check-in', 'Hot water', 'Heating', 'Garden', 'City view', 'Breakfast (on request)', 'Pet friendly',
]

function blank(defaults: { checkIn: string; checkOut: string }): PropertyInput {
  return {
    name: '', type: 'Apartment', location: '', region: '', tagline: '', shortDescription: '', description: '', images: [],
    maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1, amenities: ['Wi-Fi', 'Air conditioning', 'Power backup'], highlights: [], houseRules: ['No smoking indoors', 'No parties or events'],
    checkInTime: defaults.checkIn, checkOutTime: defaults.checkOut, locationInfo: '', mapQuery: '', nearby: [],
    pricing: { basePrice: 0, weekendPrice: 0, seasonal: [], includedGuests: 2, extraGuestFee: 0, cleaningFee: 0, minNights: 1 },
    airbnbUrl: '', featured: false, published: false,
  }
}

function toInput(p: Property): PropertyInput {
  const { id: _id, slug: _slug, createdAt: _c, updatedAt: _u, ...rest } = p
  return structuredClone(rest)
}

type Errors = Record<string, string>

export function PropertyEditor() {
  const { id } = useParams()
  const { properties, settings, createProperty, updateProperty } = useData()
  const existing = id ? properties.find((p) => p.id === id) : undefined
  if (id && !existing) {
    return <EmptyState title="Property not found" body="It may have been deleted." action={<Link to="/admin/properties" className="font-semibold text-forest underline">Back to properties</Link>} />
  }
  return <Editor key={id ?? 'new'} existing={existing} initial={existing ? toInput(existing) : blank({ checkIn: settings.defaultCheckIn, checkOut: settings.defaultCheckOut })} save={(input) => (existing ? updateProperty(existing.id, input) : createProperty(input))} />
}

function Editor({ existing, initial, save }: { existing?: Property; initial: PropertyInput; save: (i: PropertyInput) => Promise<Property> }) {
  const [f, setF] = useState<PropertyInput>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { settings } = useData()

  const set = <K extends keyof PropertyInput>(k: K, v: PropertyInput[K]) => setF((s) => ({ ...s, [k]: v }))
  const setPrice = <K extends keyof PropertyInput['pricing']>(k: K, v: PropertyInput['pricing'][K]) => setF((s) => ({ ...s, pricing: { ...s.pricing, [k]: v } }))
  const num = (v: string) => (v === '' ? 0 : Math.max(0, Number(v)))

  const validate = (): Errors => {
    const e: Errors = {}
    if (!f.name.trim()) e.name = 'Name is required'
    if (!f.location.trim()) e.location = 'Location is required'
    if (!f.region.trim()) e.region = 'Destination is required (used in search)'
    if (!f.shortDescription.trim()) e.shortDescription = 'Add a one or two line summary'
    if (!(f.pricing.basePrice > 0)) e.basePrice = 'Enter a nightly price'
    if (f.maxGuests < 1) e.maxGuests = 'At least 1 guest'
    if (f.pricing.includedGuests < 1) e.includedGuests = 'At least 1'
    if (f.pricing.minNights < 1) e.minNights = 'At least 1 night'
    f.pricing.seasonal.forEach((s, i) => {
      if (!s.start || !s.end || s.end < s.start) e[`season${i}`] = 'End date must be on or after start date'
      if (!(s.pricePerNight > 0)) e[`season${i}`] = 'Enter a price'
    })
    if (f.airbnbUrl && !isValidUrl(f.airbnbUrl)) e.airbnbUrl = 'Paste the full listing link, starting with https://'
    if (f.published && f.images.length === 0) e.images = 'Add at least one photo before publishing'
    return e
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast('Please fix the highlighted fields', 'error')
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 30)
      return
    }
    setBusy(true)
    try {
      const clean: PropertyInput = {
        ...f,
        name: f.name.trim(),
        mapQuery: f.mapQuery.trim() || f.location.trim(),
        airbnbUrl: (f.airbnbUrl ?? '').trim(),
        highlights: f.highlights.map((s) => s.trim()).filter(Boolean),
        houseRules: f.houseRules.map((s) => s.trim()).filter(Boolean),
        nearby: f.nearby.filter((n) => n.name.trim()),
        images: f.images.map((img, i) => ({ ...img, alt: img.alt.trim() || `${f.name} photo ${i + 1}` })),
      }
      const saved = await save(clean)
      toast(existing ? 'Property updated' : 'Property created')
      navigate(existing ? '/admin/properties' : `/admin/properties/${saved.id}`, { replace: !existing })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate>
      <Link to="/admin/properties" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-forest"><ArrowLeft className="h-4 w-4" /> All properties</Link>
      <PageHeader
        title={existing ? `Edit ${existing.name}` : 'Add a property'}
        subtitle={existing ? 'Changes show on the website as soon as you save.' : 'New properties start hidden until you publish them.'}
        actions={<>
          {existing?.published && <a href={`/stays/${existing.slug}`} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center rounded-full px-5 text-sm font-semibold text-forest ring-1 ring-line hover:ring-forest/40">View on site</a>}
          <Button type="submit" disabled={busy} icon={<Save className="h-4 w-4" />}>{busy ? 'Saving…' : 'Save property'}</Button>
        </>}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Panel title="Basics">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField id="name" label="Property name" value={f.name} onChange={(e) => set('name', e.target.value)} error={errors.name} placeholder="e.g. The Cyber Loft" />
              <SelectField id="type" label="Property type" value={f.type} onChange={(e) => set('type', e.target.value as PropertyType)}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </SelectField>
              <TextField id="location" label="Location (shown to guests)" value={f.location} onChange={(e) => set('location', e.target.value)} error={errors.location} placeholder="DLF Phase 2, Gurgaon" />
              <TextField id="region" label="Area (for search)" value={f.region} onChange={(e) => set('region', e.target.value)} error={errors.region} placeholder="Cyber City" />
              <TextField id="tagline" label="Tagline" value={f.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="A designer studio a short walk from Cyber Hub" className="sm:col-span-2" />
              <TextArea id="shortDescription" label="Short description (cards)" value={f.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} error={errors.shortDescription} rows={2} maxLength={240} hint={`${f.shortDescription.length}/240`} className="sm:col-span-2" />
              <TextArea id="description" label="Full description" value={f.description} onChange={(e) => set('description', e.target.value)} rows={8} hint="Leave a blank line between paragraphs." className="sm:col-span-2" />
            </div>
          </Panel>

          <PhotosPanel images={f.images} onChange={(images) => set('images', images)} error={errors.images} name={f.name} />

          <Panel title="Capacity">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              <TextField id="maxGuests" label="Max guests" type="number" min={1} value={f.maxGuests} onChange={(e) => set('maxGuests', num(e.target.value))} error={errors.maxGuests} />
              <TextField id="bedrooms" label="Bedrooms" type="number" min={0} value={f.bedrooms} onChange={(e) => set('bedrooms', num(e.target.value))} />
              <TextField id="beds" label="Beds" type="number" min={0} value={f.beds} onChange={(e) => set('beds', num(e.target.value))} />
              <TextField id="bathrooms" label="Bathrooms" type="number" min={0} step={0.5} value={f.bathrooms} onChange={(e) => set('bathrooms', num(e.target.value))} />
            </div>
          </Panel>

          <Panel title="Pricing">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
              <TextField id="basePrice" label={`Base nightly (${settings.currency})`} type="number" min={0} value={f.pricing.basePrice || ''} onChange={(e) => setPrice('basePrice', num(e.target.value))} error={errors.basePrice} />
              <TextField id="weekendPrice" label="Weekend nightly" type="number" min={0} value={f.pricing.weekendPrice || ''} onChange={(e) => setPrice('weekendPrice', num(e.target.value))} hint="Fri & Sat. Empty = base" />
              <TextField id="cleaningFee" label="Cleaning fee (per stay)" type="number" min={0} value={f.pricing.cleaningFee || ''} onChange={(e) => setPrice('cleaningFee', num(e.target.value))} />
              <TextField id="includedGuests" label="Guests included" type="number" min={1} value={f.pricing.includedGuests} onChange={(e) => setPrice('includedGuests', num(e.target.value))} error={errors.includedGuests} />
              <TextField id="extraGuestFee" label="Extra guest / night" type="number" min={0} value={f.pricing.extraGuestFee || ''} onChange={(e) => setPrice('extraGuestFee', num(e.target.value))} />
              <TextField id="minNights" label="Minimum nights" type="number" min={1} value={f.pricing.minNights} onChange={(e) => setPrice('minNights', num(e.target.value))} error={errors.minNights} />
            </div>
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Seasonal pricing</h3>
                <Button size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setPrice('seasonal', [...f.pricing.seasonal, { id: uid('season'), label: 'Peak season', start: '', end: '', pricePerNight: f.pricing.basePrice }])}>Add season</Button>
              </div>
              {f.pricing.seasonal.length === 0 ? <p className="text-sm text-muted">No seasonal prices. Add one for holidays, peak or off-season rates. For single dates, use the Availability calendar.</p> : (
                <div className="space-y-3">
                  {f.pricing.seasonal.map((s, i) => {
                    const upd = (patch: Partial<SeasonalPrice>) => setPrice('seasonal', f.pricing.seasonal.map((x) => (x.id === s.id ? { ...x, ...patch } : x)))
                    return (
                      <div key={s.id} data-error={!!errors[`season${i}`]} className={classNames('grid gap-3 rounded-2xl bg-ivory p-4 sm:grid-cols-[1.3fr_1fr_1fr_1fr_auto] sm:items-end', errors[`season${i}`] && 'ring-1 ring-[#b5543c]')}>
                        <TextField id={`sl${i}`} label="Label" value={s.label} onChange={(e) => upd({ label: e.target.value })} />
                        <TextField id={`ss${i}`} label="From" type="date" value={s.start} onChange={(e) => upd({ start: e.target.value })} />
                        <TextField id={`se${i}`} label="To (last night)" type="date" min={s.start} value={s.end} onChange={(e) => upd({ end: e.target.value })} />
                        <TextField id={`sp${i}`} label="Price / night" type="number" min={0} value={s.pricePerNight || ''} onChange={(e) => upd({ pricePerNight: num(e.target.value) })} />
                        <Button variant="ghost" size="md" className="!text-[#a8432f]" aria-label="Remove season" onClick={() => setPrice('seasonal', f.pricing.seasonal.filter((x) => x.id !== s.id))} icon={<Trash2 className="h-4 w-4" />} />
                        {errors[`season${i}`] && <p className="text-xs font-medium text-[#a8432f] sm:col-span-5">{errors[`season${i}`]}</p>}
                      </div>
                    )
                  })}
                </div>
              )}
              <p className="mt-3 text-xs text-muted">Price priority: special date price (calendar) → seasonal → weekend → base.</p>
            </div>
          </Panel>

          <Panel title="Amenities">
            <div className="flex flex-wrap gap-2">
              {[...new Set([...COMMON_AMENITIES, ...f.amenities])].map((a) => {
                const on = f.amenities.includes(a)
                return (
                  <button type="button" key={a} onClick={() => set('amenities', on ? f.amenities.filter((x) => x !== a) : [...f.amenities, a])} aria-pressed={on}
                    className={classNames('flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition', on ? 'bg-forest text-ivory' : 'bg-ivory text-ink/70 ring-1 ring-line hover:ring-forest/40')}>
                    <AmenityIcon name={a} className="h-4 w-4" /> {a}
                  </button>
                )
              })}
            </div>
            <AddInline placeholder="Add a custom amenity" onAdd={(v) => !f.amenities.includes(v) && set('amenities', [...f.amenities, v])} />
          </Panel>

          <Panel title="Highlights & house rules">
            <div className="grid gap-8 md:grid-cols-2">
              <ListEditor label="Highlights" items={f.highlights} onChange={(v) => set('highlights', v)} placeholder="Walk to Cyber Hub and DLF Cyber City" />
              <ListEditor label="House rules" items={f.houseRules} onChange={(v) => set('houseRules', v)} placeholder="No smoking indoors" />
            </div>
          </Panel>

          <Panel title="Location">
            <div className="grid gap-5">
              <TextArea id="locationInfo" label="Getting there / area info" value={f.locationInfo} onChange={(e) => set('locationInfo', e.target.value)} rows={3} />
              <TextField id="mapQuery" label="Map search" value={f.mapQuery} onChange={(e) => set('mapQuery', e.target.value)} hint="What to show on the map, e.g. a village or landmark. Avoid your exact address." placeholder={f.location || 'DLF Cyber City, Gurugram'} />
              <NearbyEditor items={f.nearby} onChange={(v) => set('nearby', v)} />
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <div className="space-y-6 xl:sticky xl:top-6">
            <Panel title="Visibility">
              <div className="space-y-3">
                <Toggle id="published" checked={f.published} onChange={(v) => set('published', v)} label="Published" description="Show this property on the website" />
                <Toggle id="featured" checked={f.featured} onChange={(v) => set('featured', v)} label="Featured" description="Show on the homepage and first in listings" />
              </div>
            </Panel>
            <Panel title="Airbnb listing">
              <TextField id="airbnbUrl" label="Airbnb link (optional)" value={f.airbnbUrl ?? ''} error={errors.airbnbUrl} onChange={(e) => set('airbnbUrl', e.target.value)} placeholder="https://www.airbnb.co.in/rooms/…"
                hint="Adds a “Book on Airbnb” button. Guests’ dates and guest count are passed to Airbnb." />
            </Panel>
            <Panel title="Check-in & check-out">
              <div className="grid grid-cols-2 gap-4">
                <TextField id="checkInTime" label="Check-in" type="time" value={f.checkInTime} onChange={(e) => set('checkInTime', e.target.value)} />
                <TextField id="checkOutTime" label="Check-out" type="time" value={f.checkOutTime} onChange={(e) => set('checkOutTime', e.target.value)} />
              </div>
            </Panel>
            <Button type="submit" full size="lg" disabled={busy} icon={<Save className="h-4 w-4" />}>{busy ? 'Saving…' : 'Save property'}</Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function PhotosPanel({ images, onChange, error, name }: { images: PropertyInput['images']; onChange: (i: PropertyInput['images']) => void; error?: string; name: string }) {
  const [url, setUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const addUrl = () => {
    const u = url.trim()
    if (!/^https?:\/\//i.test(u)) return toast('Paste a full image URL starting with https://', 'error')
    onChange([...images, { id: uid('img'), url: u, alt: `${name || 'Property'} photo ${images.length + 1}` }])
    setUrl('')
  }
  const upload = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    try {
      const added = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        added.push({ id: uid('img'), url: await fileToCompressedDataUrl(file), alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') })
      }
      onChange([...images, ...added])
      if (added.length) toast(`${added.length} photo${added.length > 1 ? 's' : ''} added. Save to keep them.`)
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Upload failed', 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }
  const move = (i: number, d: number) => {
    const next = [...images]
    const [it] = next.splice(i, 1)
    next.splice(i + d, 0, it!)
    onChange(next)
  }

  return (
    <Panel title={<>Photos <span className="font-normal text-muted">· first photo is the cover</span></>}>
      <div data-error={!!error}>
        {images.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-sand bg-ivory py-10 text-center">
            <ImagePlus className="h-8 w-8 text-olive" />
            <p className="mt-3 text-sm font-semibold">No photos yet</p>
            <p className="text-xs text-muted">Upload from your device or paste image links below.</p>
          </div>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <li key={img.id} className="overflow-hidden rounded-2xl border border-line bg-ivory">
                <div className="relative">
                  <SmartImage src={img.url} alt={img.alt} width={500} className="aspect-[4/3] w-full" />
                  {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-forest">Cover</span>}
                  <div className="absolute right-2 top-2 flex gap-1">
                    {i > 0 && <MiniBtn label="Make cover" onClick={() => onChange([img, ...images.filter((x) => x.id !== img.id)])}><Star className="h-3.5 w-3.5" /></MiniBtn>}
                    {i > 0 && <MiniBtn label="Move earlier" onClick={() => move(i, -1)}><ArrowUp className="h-3.5 w-3.5" /></MiniBtn>}
                    {i < images.length - 1 && <MiniBtn label="Move later" onClick={() => move(i, 1)}><ArrowDown className="h-3.5 w-3.5" /></MiniBtn>}
                    <MiniBtn label="Remove photo" onClick={() => onChange(images.filter((x) => x.id !== img.id))} danger><X className="h-3.5 w-3.5" /></MiniBtn>
                  </div>
                </div>
                <input value={img.alt} onChange={(e) => onChange(images.map((x) => (x.id === img.id ? { ...x, alt: e.target.value } : x)))} placeholder="Describe the photo (alt text)" aria-label={`Alt text for photo ${i + 1}`} className="w-full border-t border-line bg-white px-3 py-2 text-xs outline-none focus:bg-ivory" />
              </li>
            ))}
          </ul>
        )}
        {error && <p className="mt-3 text-xs font-medium text-[#a8432f]">{error}</p>}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
          <Button variant="secondary" icon={<Upload className="h-4 w-4" />} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? 'Processing…' : 'Upload photos'}</Button>
          <div className="flex flex-1 gap-2">
            <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl() } }} placeholder="https://… paste an image link" className="field !py-2.5" aria-label="Image URL" />
            <Button variant="outline" icon={<Link2 className="h-4 w-4" />} onClick={addUrl}>Add</Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted">Uploads are resized and stored in this browser, which has limited space (about 5 MB). For many photos, host them (e.g. Cloudinary, Supabase Storage) and paste links.</p>
      </div>
    </Panel>
  )
}

function MiniBtn({ children, label, onClick, danger }: { children: ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return <button type="button" onClick={onClick} title={label} aria-label={label} className={classNames('flex h-7 w-7 items-center justify-center rounded-full bg-white/95 shadow', danger ? 'text-[#a8432f]' : 'text-forest')}>{children}</button>
}

function AddInline({ placeholder, onAdd }: { placeholder: string; onAdd: (v: string) => void }) {
  const [v, setV] = useState('')
  const add = () => { if (v.trim()) { onAdd(v.trim()); setV('') } }
  return (
    <div className="mt-4 flex gap-2">
      <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder={placeholder} className="field !py-2.5" aria-label={placeholder} />
      <Button variant="outline" icon={<Plus className="h-4 w-4" />} onClick={add}>Add</Button>
    </div>
  )
}

function ListEditor({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (v: string[]) => void; placeholder: string }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{label}</h3>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <input value={it} onChange={(e) => onChange(items.map((x, n) => (n === i ? e.target.value : x)))} className="field !py-2.5" aria-label={`${label} ${i + 1}`} />
            <Button variant="ghost" className="!px-3 !text-[#a8432f]" aria-label="Remove" onClick={() => onChange(items.filter((_, n) => n !== i))} icon={<Trash2 className="h-4 w-4" />} />
          </li>
        ))}
      </ul>
      <AddInline placeholder={placeholder} onAdd={(v) => onChange([...items, v])} />
    </div>
  )
}

function NearbyEditor({ items, onChange }: { items: NearbyAttraction[]; onChange: (v: NearbyAttraction[]) => void }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Nearby attractions</h3>
        <Button size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => onChange([...items, { name: '', distance: '' }])}>Add</Button>
      </div>
      <ul className="space-y-2">
        {items.map((n, i) => (
          <li key={i} className="grid grid-cols-[1fr_110px_auto] gap-2">
            <input value={n.name} onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} placeholder="Place" className="field !py-2.5" aria-label="Attraction name" />
            <input value={n.distance} onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, distance: e.target.value } : x)))} placeholder="4 km" className="field !py-2.5" aria-label="Distance" />
            <Button variant="ghost" className="!px-3 !text-[#a8432f]" aria-label="Remove attraction" onClick={() => onChange(items.filter((_, k) => k !== i))} icon={<Trash2 className="h-4 w-4" />} />
          </li>
        ))}
      </ul>
    </div>
  )
}
