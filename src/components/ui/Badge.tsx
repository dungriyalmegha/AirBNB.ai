import type { ReactNode } from 'react'
import { classNames } from '../../utils/format'

export type Tone = 'neutral' | 'green' | 'olive' | 'amber' | 'red' | 'blue' | 'accent'

const tones: Record<Tone, string> = {
  neutral: 'bg-cream text-ink/70',
  green: 'bg-[#e3ecdf] text-[#2f5a37]',
  olive: 'bg-olive/15 text-forest',
  amber: 'bg-[#f6ead3] text-[#8a5a14]',
  red: 'bg-[#f5e1dc] text-[#9a3b27]',
  blue: 'bg-[#e1e9f1] text-[#2f4f6e]',
  accent: 'bg-accent/15 text-accent-dark',
}

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={classNames('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
