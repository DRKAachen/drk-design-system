'use client'

/**
 * Link to reopen cookie settings (GDPR/DSGVO: user must be able to change consent).
 */

import { CONSENT_STORAGE_KEY } from '../../lib/cookies/consent'
import { CONSENT_COOKIE_KEY } from '../../lib/cookies/consent'
import styles from './CookieBanner.module.scss'

interface CookieSettingsLinkProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Renders a link/button that clears cookie consent and reloads to show the banner again.
 */
export default function CookieSettingsLink({
  className,
  children = 'Cookie-Einstellungen',
}: CookieSettingsLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(CONSENT_STORAGE_KEY)
      document.cookie = `${CONSENT_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`
      window.location.reload()
    } catch {
      window.location.reload()
    }
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
