/**
 * Input component - single-line text input with error state and optional hint.
 */

import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.scss'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Whether the input has a validation error. */
  error?: boolean
  /** Optional full-width block layout. */
  fullWidth?: boolean
}

/**
 * Accessible text input. Pair with Label for full form semantics.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error, fullWidth, className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={[
        styles.input,
        error && styles.inputError,
        fullWidth && styles.inputFullWidth,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={error}
      {...props}
    />
  )
})

export default Input
