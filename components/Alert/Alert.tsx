/**
 * Alert component - feedback message with variant (success, error, warning, info).
 * Optionally dismissible via an onDismiss callback.
 */

import styles from './Alert.module.scss'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  /** Visual variant. */
  variant?: AlertVariant
  /** Alert heading (optional). */
  title?: string
  /**
   * HTML element for the title. Defaults to 'strong'.
   * Use a heading level (h2–h6) when alerts appear in page flow for
   * screen-reader heading navigation.
   */
  titleAs?: 'strong' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  /** Alert body. */
  children: React.ReactNode
  /** Optional class name. */
  className?: string
  /** Role for accessibility (default: role="alert" for error, "status" for others). */
  role?: 'alert' | 'status' | 'region'
  /** When provided, a close button is shown and this callback fires on dismiss. */
  onDismiss?: () => void
}

/**
 * Renders a static or dismissible alert box. Use for form feedback,
 * notifications, or inline messages.
 */
export default function Alert({
  variant = 'info',
  title,
  titleAs: TitleTag = 'strong',
  children,
  className,
  role = variant === 'error' ? 'alert' : 'status',
  onDismiss,
}: AlertProps) {
  return (
    <div
      className={[styles.alert, styles[`alert--${variant}`], className].filter(Boolean).join(' ')}
      role={role}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className={styles.alert__body}>
        {title && <TitleTag className={styles.alert__title}>{title}</TitleTag>}
        <div className={styles.alert__content}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.alert__dismiss}
          onClick={onDismiss}
          aria-label="Meldung schließen"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  )
}
