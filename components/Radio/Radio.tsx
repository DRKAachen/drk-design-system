/**
 * Radio component - accessible radio group with shared name and optional error.
 */

import { InputHTMLAttributes, forwardRef, useId } from 'react'
import styles from './Radio.module.scss'

export interface RadioOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Options for the radio group. */
  options: RadioOption[]
  /** Whether the group has a validation error. */
  error?: boolean
  /** Optional hint below the group. */
  hint?: string
}

/**
 * Accessible radio group. All options share the same name for correct grouping.
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { options, error, hint, id: idProp, className, name, value: selectedValue, ...props },
  ref
) {
  const generatedId = useId()
  const groupId = idProp || `radio-${name || generatedId}`
  return (
    <div
      className={[styles.radioWrap, error && styles.radioWrapError, className].filter(Boolean).join(' ')}
      role="radiogroup"
      aria-invalid={error}
      aria-describedby={hint ? `${groupId}-hint` : undefined}
    >
      {options.map((opt, index) => {
        const inputId = `${groupId}-${opt.value}-${index}`
        const isFirst = index === 0
        return (
          <div key={opt.value + index} className={styles.radioItem}>
            <input
              ref={isFirst ? ref : undefined}
              type="radio"
              id={inputId}
              name={name}
              value={opt.value}
              checked={selectedValue !== undefined ? selectedValue === opt.value : undefined}
              disabled={opt.disabled}
              className={styles.radio}
              {...props}
            />
            <label htmlFor={inputId} className={styles.radioLabel}>
              {opt.label}
            </label>
          </div>
        )
      })}
      {hint && (
        <span id={`${groupId}-hint`} className={styles.radioHint}>
          {hint}
        </span>
      )}
    </div>
  )
})

export default Radio
