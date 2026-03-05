'use client'

/**
 * Cookie banner for GDPR/DSGVO compliance.
 * Shown until the user makes a choice; re-openable via CookieSettingsLink
 * without losing existing preferences (D8/A6).
 */

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  type CookieConsent,
  type CookieCategory,
  getStoredConsent,
  setStoredConsent,
  shouldShowBanner,
  getAllConsent,
  getNecessaryOnlyConsent,
} from '../../lib/cookies/consent'
import styles from './CookieBanner.module.scss'

/** Custom event name dispatched by CookieSettingsLink to reopen the banner. */
export const REOPEN_CONSENT_EVENT = 'drk-reopen-consent'

export interface CategoryDescription {
  category: Exclude<CookieCategory, 'necessary'>
  label: string
}

export interface CookieBannerProps {
  /**
   * Optional per-category descriptions for the preferences panel.
   * When not provided, sensible German defaults are used.
   */
  categoryDescriptions?: CategoryDescription[]
}

const DEFAULT_CATEGORIES: CategoryDescription[] = [
  { category: 'functional', label: 'Funktional (z.\u00a0B. Komfortfunktionen)' },
  { category: 'analytics', label: 'Analytics (anonyme Nutzungsstatistik)' },
  { category: 'marketing', label: 'Marketing (externe Kampagnenmessung)' },
]

/**
 * Renders the cookie consent banner when no consent has been stored,
 * or when the user requests to change their settings.
 */
export default function CookieBanner({
  categoryDescriptions = DEFAULT_CATEGORIES,
}: CookieBannerProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    functional: false,
    analytics: false,
    marketing: false,
  })

  /** Loads current stored consent into the preferences state. */
  const syncPreferencesFromStorage = useCallback(() => {
    const stored = getStoredConsent()
    setPreferences({
      functional: stored.functional,
      analytics: stored.analytics,
      marketing: stored.marketing,
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setVisible(shouldShowBanner()), 0)
    syncPreferencesFromStorage()
    return () => clearTimeout(t)
  }, [mounted, syncPreferencesFromStorage])

  /** Listen for CookieSettingsLink dispatching the reopen event. */
  useEffect(() => {
    const handleReopen = () => {
      syncPreferencesFromStorage()
      setShowPreferences(true)
      setVisible(true)
    }

    window.addEventListener(REOPEN_CONSENT_EVENT, handleReopen)
    return () => window.removeEventListener(REOPEN_CONSENT_EVENT, handleReopen)
  }, [syncPreferencesFromStorage])

  const handleAcceptAll = (): void => {
    setStoredConsent(getAllConsent())
    setVisible(false)
    setShowPreferences(false)
  }

  const handleNecessaryOnly = (): void => {
    setStoredConsent(getNecessaryOnlyConsent())
    setVisible(false)
    setShowPreferences(false)
  }

  const handleSavePreferences = (): void => {
    const savedConsent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: preferences.functional,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
    }
    setStoredConsent(savedConsent)
    setVisible(false)
    setShowPreferences(false)
  }

  if (!mounted || !visible) {
    return null
  }

  return (
    <aside
      className={styles.banner}
      role="dialog"
      aria-label="Cookie-Einstellungen"
      aria-live="polite"
      lang="de"
    >
      <div className={styles.banner__inner}>
        <div className={styles.banner__content}>
          <h2 className={styles.banner__heading}>Cookie-Hinweis</h2>
          <p className={styles.banner__text}>
            Wir verwenden Cookies und ähnliche Technologien (z.&nbsp;B. localStorage), um die
            Nutzung der Website zu ermöglichen und zu verbessern. Notwendige Cookies sind für
            den Betrieb erforderlich. Weitere Informationen finden Sie in unserer{' '}
            <Link href="/datenschutz" className={styles.banner__link}>
              Datenschutzerklärung
            </Link>{' '}
            und im{' '}
            <Link href="/impressum" className={styles.banner__link}>
              Impressum
            </Link>
            .
          </p>
        </div>
        <div className={styles.banner__actions}>
          <button
            type="button"
            className={styles.banner__btnPrimary}
            onClick={handleAcceptAll}
            data-consent="all"
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            className={styles.banner__btnSecondary}
            onClick={handleNecessaryOnly}
            data-consent="necessary"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            className={styles.banner__btnGhost}
            onClick={() => setShowPreferences((prev) => !prev)}
            aria-expanded={showPreferences}
            aria-controls="cookie-preferences"
          >
            {showPreferences ? 'Auswahl schließen' : 'Auswahl anpassen'}
          </button>
        </div>
      </div>

      <div
        id="cookie-preferences"
        className={`${styles.banner__preferences} ${showPreferences ? styles['banner__preferences--open'] : ''}`}
        aria-hidden={!showPreferences}
      >
        <fieldset className={styles.banner__fieldset}>
          <legend className={styles.banner__legend}>Optionale Cookies</legend>
          {categoryDescriptions.map(({ category, label }) => (
            <label key={category} className={styles.banner__choice}>
              <input
                type="checkbox"
                checked={preferences[category]}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, [category]: event.target.checked }))
                }
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <div className={styles.banner__prefActions}>
          <button
            type="button"
            className={styles.banner__btnSecondary}
            onClick={handleSavePreferences}
          >
            Auswahl speichern
          </button>
        </div>
      </div>
    </aside>
  )
}
