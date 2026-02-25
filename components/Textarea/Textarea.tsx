/**
 * Textarea component - multi-line text input with error state.
 */

import { TextareaHTMLAttributes, forwardRef } from 'react'
import styles from './Textarea.module.scss'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Whether the textarea has a validation error. */
  error?: boolean
  /** Optional full-width block layout. */
  fullWidth?: boolean
}

/**
 * Accessible multi-line text input. Pair with Label for full form semantics.
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { error, fullWidth, className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={[
        styles.textarea,
        error && styles.textareaError,
        fullWidth && styles.textareaFullWidth,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={error}
      {...props}
    />
  )
})

export default Textarea
