/**
 * Select component - native select with error state and optional placeholder.
 */

import { SelectHTMLAttributes, forwardRef } from 'react'
import styles from './Select.module.scss'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Options for the select. */
  options: SelectOption[]
  /** Placeholder option (e.g. "Bitte wählen"). */
  placeholder?: string
  /** Whether the select has a validation error. */
  error?: boolean
  /** Optional full-width block layout. */
  fullWidth?: boolean
}

/**
 * Accessible native select. Pair with Label for full form semantics.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, error, fullWidth, className, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={[
        styles.select,
        error && styles.selectError,
        fullWidth && styles.selectFullWidth,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={error}
      {...props}
    >
      {placeholder !== undefined && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  )
})

export default Select
