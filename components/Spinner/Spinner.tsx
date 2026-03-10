/**
 * Spinner component - loading indicator.
 */

import styles from './Spinner.module.scss'

export interface SpinnerProps {
  /** Size of the spinner. */
  size?: 'sm' | 'md' | 'lg'
  /** Optional accessible label (announced to screen readers). */
  'aria-label'?: string
  /**
   * When true, hides the spinner from assistive technology.
   * Use when placed inside a labeled button to avoid double announcements.
   */
  'aria-hidden'?: boolean
  /** Optional class name. */
  className?: string
}

/**
 * Renders a circular loading spinner. Use for buttons, sections, or full-page loading.
 * Set aria-hidden when used inside a button that already has a loading label.
 */
export default function Spinner({
  size = 'md',
  'aria-label': ariaLabel = 'Laden',
  'aria-hidden': ariaHidden,
  className,
}: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[`spinner--${size}`], className].filter(Boolean).join(' ')}
      role={ariaHidden ? undefined : 'status'}
      aria-label={ariaHidden ? undefined : ariaLabel}
      aria-hidden={ariaHidden || undefined}
    >
      <span className={styles.spinner__circle} aria-hidden="true" />
    </span>
  )
}
