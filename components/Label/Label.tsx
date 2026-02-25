/**
 * Label component - accessible form label with optional required indicator and error.
 */

import { LabelHTMLAttributes, useId } from 'react'
import styles from './Label.module.scss'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Whether the associated field is required (shows asterisk and aria-required). */
  required?: boolean
  /** Error message to show below the label (e.g. validation). */
  error?: string
  /** Optional hint text shown below the label. */
  hint?: string
  children: React.ReactNode
}

/**
 * Accessible label for form controls. Use with Input, Select, Textarea, Checkbox, Radio.
 */
export default function Label({
  required,
  error,
  hint,
  children,
  className,
  id: idProp,
  ...props
}: LabelProps) {
  const generatedId = useId()
  const id = idProp || `label-${generatedId}`
  const errorId = error ? `${id}-error` : undefined
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <label
      id={id}
      className={[styles.label, error && styles.labelError, className].filter(Boolean).join(' ')}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
      {...props}
    >
      <span className={styles.label__text}>
        {children}
        {required && <span className={styles.label__required} aria-hidden="true"> *</span>}
      </span>
      {hint && (
        <span id={hintId} className={styles.label__hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.label__error} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}
