import { ImageOff } from 'lucide-react'
import { useState, type ImgHTMLAttributes } from 'react'
import { classNames } from '../../utils/format'
import { sized } from '../../utils/image'

/** Image with lazy loading, a soft placeholder while loading and a tasteful fallback if the URL fails. */
export function SmartImage({ src, alt, className, width, eager, quietFallback, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string; width?: number; eager?: boolean; quietFallback?: boolean }) {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading')
  const url = width ? sized(src, width) : src
  if (!src || state === 'error') {
    return (
      <div className={classNames('flex items-center justify-center bg-gradient-to-br from-sand to-cream text-forest/40', quietFallback && 'from-forest to-olive', className)} role="img" aria-label={alt}>
        {!quietFallback && <ImageOff className="h-8 w-8" />}
      </div>
    )
  }
  return (
    <img
      src={url}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setState('loaded')}
      onError={() => setState('error')}
      className={classNames('bg-sand/60 object-cover transition-opacity duration-500', state === 'loaded' ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  )
}
