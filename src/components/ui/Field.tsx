import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { classNames } from '../../utils/format'

interface Wrap {
  label?: ReactNode
  error?: string
  hint?: ReactNode
  className?: string
  id: string
}

function FieldWrap({ label, error, hint, className, id, children }: Wrap & { children: ReactNode }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-[#a8432f]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export const TextField = forwardRef<HTMLInputElement, Wrap & InputHTMLAttributes<HTMLInputElement>>(function TextField(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  return (
    <FieldWrap {...{ label, error, hint, className, id }}>
      <input ref={ref} id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={classNames('field', error && 'field-error')} {...rest} />
    </FieldWrap>
  )
})

export function TextArea({ label, error, hint, className, id, ...rest }: Wrap & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldWrap {...{ label, error, hint, className, id }}>
      <textarea id={id} aria-invalid={!!error} className={classNames('field min-h-[110px] resize-y', error && 'field-error')} {...rest} />
    </FieldWrap>
  )
}

export function SelectField({ label, error, hint, className, id, children, ...rest }: Wrap & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldWrap {...{ label, error, hint, className, id }}>
      <select id={id} aria-invalid={!!error} className={classNames('field appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%2385877D%27 stroke-width=%272.5%27%3E%3Cpath d=%27m6 9 6 6 6-6%27/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9', error && 'field-error')} {...rest}>
        {children}
      </select>
    </FieldWrap>
  )
}

export function Toggle({ checked, onChange, label, description, id }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; description?: ReactNode; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-line bg-white p-4">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-sand transition peer-checked:bg-forest peer-focus-visible:ring-4 peer-focus-visible:ring-olive/30" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  )
}
