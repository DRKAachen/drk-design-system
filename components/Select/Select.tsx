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
  /** When true, the placeholder option is selectable (allows clearing). */
  allowEmpty?: boolean
}

/**
 * Accessible native select. Pair with Label for full form semantics.
 * Pass aria-describedby to link to error/hint IDs from Label.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    options,
    placeholder,
    error,
    fullWidth,
    allowEmpty = false,
    className,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
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
      aria-invalid={error || undefined}
      aria-describedby={ariaDescribedBy || undefined}
      {...props}
    >
      {placeholder !== undefined && (
        <option value="" disabled={!allowEmpty}>
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

Select.displayName = 'Select'

export default Select
