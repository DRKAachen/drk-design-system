'use client'

/**
 * Modal (Dialog) component - accessible overlay dialog with backdrop and optional close.
 */

import { useEffect, useRef, useId } from 'react'
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
  const titleId = useId()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const previousFocusedElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusedElementRef.current = document.activeElement as HTMLElement | null

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    const focusableElements = Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) || []
    )
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      modalRef.current?.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      )
      if (focusables.length === 0) {
        event.preventDefault()
        modalRef.current.focus()
        return
      }

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusedElementRef.current?.focus()
    }
  }, [open, onClose])

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
      aria-labelledby={titleId}
    >
      <div
        ref={modalRef}
        className={[styles.modal, className].filter(Boolean).join(' ')}
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <div className={styles.modal__header}>
          <h2 id={titleId} className={styles.modal__title}>
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
