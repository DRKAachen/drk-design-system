'use client'

/**
 * Modal (Dialog) component - accessible overlay dialog with backdrop and optional close.
 */

import { useEffect, useCallback } from 'react'
import styles from './Modal.module.scss'

export interface ModalProps {
  /** Whether the modal is open. */
  open: boolean
  /** Called when the modal should close (backdrop click or close button). */
  onClose: () => void
  /** Modal title (for aria-labelledby and optional visible heading). */
  title: string
  /** Modal content. */
  children: React.ReactNode
  /** Optional class name for the content box. */
  className?: string
  /** Whether to show a close button inside the modal. */
  showCloseButton?: boolean
}

/**
 * Accessible modal dialog. Traps focus, closes on Escape, and supports backdrop click.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, handleEscape])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={[styles.modal, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className={styles.modal__header}>
          <h2 id="modal-title" className={styles.modal__title}>
            {title}
          </h2>
          {showCloseButton && (
            <button
              type="button"
              className={styles.modal__close}
              onClick={onClose}
              aria-label="Schließen"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
        <div className={styles.modal__body}>{children}</div>
      </div>
    </div>
  )
}
