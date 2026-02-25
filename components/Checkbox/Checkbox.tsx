/**
 * Checkbox component - accessible checkbox with label and optional error.
 */

import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Checkbox.module.scss'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label text shown next to the checkbox. */
  label: React.ReactNode
  /** Whether the checkbox has a validation error. */
  error?: boolean
  /** Optional hint below the checkbox. */
  hint?: string
}

/**
 * Accessible checkbox with visible label. Use when the label should sit beside the control.
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, error, hint, id: idProp, className, ...props },
  ref
) {
  const id = idProp || `checkbox-${Math.random().toString(36).slice(2, 9)}`
  return (
    <div className={[styles.checkboxWrap, error && styles.checkboxWrapError, className].filter(Boolean).join(' ')}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className={styles.checkbox}
        aria-invalid={error}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...props}
      />
      <label htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
      {hint && (
        <span id={`${id}-hint`} className={styles.checkboxHint}>
          {hint}
        </span>
      )}
    </div>
  )
})

export default Checkbox
