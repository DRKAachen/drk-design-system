/**
 * Button component - reusable button with variants.
 */

import styles from './Button.module.scss'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
}

/**
 * Button component with multiple style variants.
 */
export default function Button({ variant = 'primary', children, className, ...props }: ButtonProps) {
  const classNames = [
    styles.button,
    variant && styles[`button--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  )
}
