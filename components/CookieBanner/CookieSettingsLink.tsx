'use client'

/**
 * Link to reopen cookie settings (GDPR/DSGVO: user must be able to change consent).
 *
 * Dispatches a custom event that CookieBanner listens for, so the banner
 * reopens with current preferences pre-filled instead of clearing consent.
 */

import { REOPEN_CONSENT_EVENT } from './CookieBanner'
import styles from './CookieBanner.module.scss'

interface CookieSettingsLinkProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Renders a button that reopens the CookieBanner with current preferences.
 */
export default function CookieSettingsLink({
  className,
  children = 'Cookie-Einstellungen',
}: CookieSettingsLinkProps) {
  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    window.dispatchEvent(new Event(REOPEN_CONSENT_EVENT))
  }

  return (
    <button
      type="button"
      className={className ?? styles.settingsLink}
      onClick={handleClick}
      data-consent-settings
    >
      {children}
    </button>
  )
}
