/**
 * Spinner component - loading indicator.
 */

import styles from './Spinner.module.scss'

export interface SpinnerProps {
  /** Size of the spinner. */
  size?: 'sm' | 'md' | 'lg'
  /** Optional accessible label (announced to screen readers). */
  'aria-label'?: string
  /** Optional class name. */
  className?: string
}

/**
 * Renders a circular loading spinner. Use for buttons, sections, or full-page loading.
 */
export default function Spinner({
  size = 'md',
  'aria-label': ariaLabel = 'Laden',
  className,
}: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[`spinner--${size}`], className].filter(Boolean).join(' ')}
      role="status"
      aria-label={ariaLabel}
    >
      <span className={styles.spinner__circle} aria-hidden="true" />
    </span>
  )
}
