import type { ReactNode } from 'react'
import { classNames } from '../../utils/format'
import { Flower } from '../Boho'

export function SectionHeading({ eyebrow, title, intro, align = 'left', action }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; align?: 'left' | 'center'; action?: ReactNode }) {
  return (
    <div className={classNames('mb-10 flex flex-col gap-4 sm:mb-12', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={classNames('mb-1 flex items-center gap-2 font-hand text-2xl font-bold text-coral', align === 'center' && 'justify-center')}><Flower className="h-4 w-4 text-marigold" />{eyebrow.toLowerCase()}</p>}
        <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">{title}</h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-ink/70">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
