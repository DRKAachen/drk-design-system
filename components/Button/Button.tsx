/**
 * Button component - reusable button with variants and optional link rendering.
 */

import styles from './Button.module.scss'
import { ButtonHTMLAttributes, cloneElement, isValidElement, ReactElement, ReactNode } from 'react'

interface ButtonPropsBase {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  className?: string
  disabled?: boolean
}

interface ButtonAsButton extends ButtonPropsBase, ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: false
}

interface ButtonAsChild extends ButtonPropsBase {
  asChild: true
  children: ReactElement
}

export type ButtonProps = ButtonAsButton | ButtonAsChild

/**
 * Builds the combined class string for the button styles.
 */
function getButtonClassNames(
  variant: 'primary' | 'secondary' | 'outline',
  size: 'sm' | 'md' | 'lg',
  className?: string
): string {
  return [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

/**
 * Button component with multiple style variants and optional size.
 * Use asChild with a single Link or <a> child to render a link that looks like a button.
 */
export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    className,
    asChild = false,
    ...rest
  } = props

  const classNames = getButtonClassNames(variant, size, className)

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement<{ className?: string }>, {
      className: [classNames, (children as ReactElement<{ className?: string }>).props?.className]
        .filter(Boolean)
        .join(' '),
    })
  }

  const { disabled, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      type="button"
      className={classNames}
      disabled={disabled}
      aria-disabled={disabled}
      {...buttonProps}
    >
      {children}
    </button>
  )
}
