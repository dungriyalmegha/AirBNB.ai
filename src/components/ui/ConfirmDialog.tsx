import type { ReactNode } from 'react'
import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', danger, onConfirm, onClose, busy }: {
  open: boolean; title: string; body: ReactNode; confirmLabel?: string; danger?: boolean; onConfirm: () => void; onClose: () => void; busy?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>{busy ? 'Working…' : confirmLabel}</Button>
      </>}>
      <div className="text-sm leading-relaxed text-ink/80">{body}</div>
    </Modal>
  )
}
