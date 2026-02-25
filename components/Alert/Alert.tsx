/**
 * Alert component - feedback message with variant (success, error, warning, info).
 */

import styles from './Alert.module.scss'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  /** Visual variant. */
  variant?: AlertVariant
  /** Alert heading (optional). */
  title?: string
  /** Alert body. */
  children: React.ReactNode
  /** Optional class name. */
  className?: string
  /** Role for accessibility (default: region with role="alert" for error, "status" for others). */
  role?: 'alert' | 'status' | 'region'
}

/**
 * Renders a dismissible or static alert box. Use for form feedback, notifications, or inline messages.
 */
export default function Alert({
  variant = 'info',
  title,
  children,
  className,
  role = variant === 'error' ? 'alert' : 'status',
}: AlertProps) {
  return (
    <div
      className={[styles.alert, styles[`alert--${variant}`], className].filter(Boolean).join(' ')}
      role={role}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      {title && <p className={styles.alert__title}>{title}</p>}
      <div className={styles.alert__content}>{children}</div>
    </div>
  )
}
