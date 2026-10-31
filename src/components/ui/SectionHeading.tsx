import type { ReactNode } from 'react'
import { classNames } from '../../utils/format'

export function SectionHeading({ eyebrow, title, intro, align = 'left', action }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; align?: 'left' | 'center'; action?: ReactNode }) {
  return (
    <div className={classNames('mb-10 flex flex-col gap-4 sm:mb-12', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={align === 'center' ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="font-display text-4xl font-semibold leading-[1.05] text-forest sm:text-5xl">{title}</h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-ink/70">{intro}</p>}
      </div>
      {action}
    </div>
  )
}
