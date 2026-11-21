import { ChevronLeft, ChevronRight, Grid3x3, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PropertyImage } from '../types'
import { classNames } from '../utils/format'
import { SmartImage } from './ui/SmartImage'

export function Gallery({ images, name }: { images: PropertyImage[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [active, setActive] = useState(0)
  if (images.length === 0) {
    return <SmartImage src="" alt={name} className="aspect-[16/9] w-full rounded-3xl" />
  }
  const main = images.slice(0, 5)
  return (
    <>
      {/* Desktop mosaic */}
      <div className="relative hidden gap-2 overflow-hidden rounded-[28px] md:grid md:h-[520px] md:grid-cols-4 md:grid-rows-2">
        {main.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpen(i)}
            className={classNames('group relative overflow-hidden', i === 0 ? 'col-span-2 row-span-2' : '', main.length < 5 && i === main.length - 1 && i > 0 ? 'col-span-2' : '')}
            aria-label={`Open photo ${i + 1}: ${img.alt}`}
          >
            <SmartImage src={img.url} alt={img.alt} width={i === 0 ? 1600 : 800} eager={i === 0} className="h-full w-full transition duration-700 group-hover:scale-[1.03]" />
            <span className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/10" />
          </button>
        ))}
        <button onClick={() => setOpen(0)} className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 text-sm font-semibold text-forest shadow-lift transition hover:bg-white">
          <Grid3x3 className="h-4 w-4" /> Show all {images.length} photos
        </button>
      </div>

      {/* Mobile: main image + thumbnails */}
      <div className="md:hidden">
        <button onClick={() => setOpen(active)} className="relative block w-full overflow-hidden rounded-3xl" aria-label="Open full-screen gallery">
          <SmartImage src={images[active]!.url} alt={images[active]!.alt} width={1000} eager className="aspect-[4/3] w-full" />
          <span className="absolute bottom-3 right-3 rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-white">{active + 1} / {images.length}</span>
        </button>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)} className={classNames('shrink-0 overflow-hidden rounded-xl ring-2 transition', i === active ? 'ring-forest' : 'ring-transparent opacity-70')} aria-label={`Show photo ${i + 1}`}>
              <SmartImage src={img.url} alt="" width={240} className="h-16 w-20" />
            </button>
          ))}
        </div>
      </div>

      {open !== null && <Lightbox images={images} start={open} onClose={() => setOpen(null)} />}
    </>
  )
}

function Lightbox({ images, start, onClose }: { images: PropertyImage[]; start: number; onClose: () => void }) {
  const [i, setI] = useState(start)
  const go = useCallback((d: number) => setI((x) => (x + d + images.length) % images.length), [images.length])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [go, onClose])

  const [touchX, setTouchX] = useState<number | null>(null)
  const img = images[i]!
  return createPortal(
    <div className="fixed inset-0 z-[95] flex flex-col bg-[#141713]/97 text-white" role="dialog" aria-modal="true" aria-label="Photo gallery">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="text-sm text-white/70">{i + 1} / {images.length}</span>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Close gallery"><X className="h-6 w-6" /></button>
      </div>
      <div
        className="relative flex flex-1 items-center justify-center px-2 sm:px-20"
        onTouchStart={(e) => setTouchX(e.touches[0]!.clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return
          const dx = e.changedTouches[0]!.clientX - touchX
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          setTouchX(null)
        }}
      >
        <SmartImage key={img.id} src={img.url} alt={img.alt} width={2000} eager className="max-h-[72vh] w-auto max-w-full rounded-xl !object-contain bg-transparent" />
        <button onClick={() => go(-1)} className="absolute left-3 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex" aria-label="Previous photo"><ChevronLeft /></button>
        <button onClick={() => go(1)} className="absolute right-3 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 sm:flex" aria-label="Next photo"><ChevronRight /></button>
      </div>
      <p className="px-6 pt-3 text-center text-sm text-white/70">{img.alt}</p>
      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 py-4">
        {images.map((m, n) => (
          <button key={m.id} onClick={() => setI(n)} className={classNames('shrink-0 overflow-hidden rounded-lg ring-2 transition', n === i ? 'ring-accent' : 'ring-transparent opacity-50 hover:opacity-90')} aria-label={`Photo ${n + 1}`}>
            <SmartImage src={m.url} alt="" width={200} className="h-14 w-20" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
