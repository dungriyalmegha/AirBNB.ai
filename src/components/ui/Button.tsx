import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { classNames } from '../../utils/format'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'whatsapp' | 'danger' | 'light'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] whitespace-nowrap'

const variants: Record<Variant, string> = {
  primary: 'bg-forest text-ivory hover:bg-forest-dark shadow-sm',
  secondary: 'bg-cream text-forest hover:bg-sand',
  outline: 'border border-forest/25 text-forest hover:border-forest hover:bg-forest/5',
  ghost: 'text-forest hover:bg-forest/5',
  accent: 'bg-accent text-white hover:bg-accent-dark shadow-sm',
  whatsapp: 'bg-whatsapp text-white hover:brightness-95 shadow-sm',
  danger: 'bg-[#a8432f] text-white hover:bg-[#8e3624]',
  light: 'bg-white/95 text-forest hover:bg-white shadow-sm backdrop-blur',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[15px] min-h-[52px]',
}

interface Common {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  full?: boolean
}

export function buttonClass({ variant = 'primary', size = 'md', full }: Common = {}, extra?: string) {
  return classNames(base, variants[variant], sizes[size], full && 'w-full', extra)
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { variant, size, icon, iconRight, full, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button ref={ref} type={type} className={buttonClass({ variant, size, full }, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
})

export function ButtonLink({ variant, size, icon, iconRight, full, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={buttonClass({ variant, size, full }, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function ButtonA({ variant, size, icon, iconRight, full, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass({ variant, size, full }, className)} {...rest}>
      {icon}
      {children}
      {iconRight}
    </a>
  )
}
