'use client'

/**
 * Cookie banner for GDPR/DSGVO compliance.
 * Shown until the user makes a choice; stores consent in localStorage.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  type CookieConsent,
  getStoredConsent,
  setStoredConsent,
  shouldShowBanner,
  getAllConsent,
  getNecessaryOnlyConsent,
} from '../../lib/cookies/consent'
import styles from './CookieBanner.module.scss'

/**
 * Renders the cookie consent banner when no consent has been stored.
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setVisible(shouldShowBanner()), 0)
    const stored = getStoredConsent()
    setPreferences({
      functional: stored.functional,
      analytics: stored.analytics,
      marketing: stored.marketing,
    })
    return () => clearTimeout(t)
  }, [mounted])

  const handleAcceptAll = () => {
    setStoredConsent(getAllConsent())
    setVisible(false)
  }

  const handleNecessaryOnly = () => {
    setStoredConsent(getNecessaryOnlyConsent())
    setVisible(false)
  }

  const handleSavePreferences = () => {
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
    >
      <div className={styles.banner__inner}>
        <div className={styles.banner__content}>
          <h2 className={styles.banner__heading}>Cookie-Hinweis</h2>
          <p className={styles.banner__text}>
            Wir verwenden Cookies und ähnliche Technologien, um die Nutzung der Website zu
            ermöglichen und zu verbessern. Notwendige Cookies sind für den Betrieb erforderlich.
            Weitere Informationen finden Sie in unserer{' '}
            <Link href="/datenschutz" className={styles.banner__link}>
              Datenschutzerklärung
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
          {showPreferences && (
            <button
              type="button"
              className={styles.banner__btnSecondary}
              onClick={handleSavePreferences}
            >
              Auswahl speichern
            </button>
          )}
        </div>
      </div>
      {showPreferences && (
        <div id="cookie-preferences" className={styles.banner__preferences}>
          <fieldset className={styles.banner__fieldset}>
            <legend className={styles.banner__legend}>Optionale Cookies</legend>
            <label className={styles.banner__choice}>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, functional: event.target.checked }))
                }
              />
              <span>Funktional (z. B. Komfortfunktionen)</span>
            </label>
            <label className={styles.banner__choice}>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, analytics: event.target.checked }))
                }
              />
              <span>Analytics (anonyme Nutzungsstatistik)</span>
            </label>
            <label className={styles.banner__choice}>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(event) =>
                  setPreferences((prev) => ({ ...prev, marketing: event.target.checked }))
                }
              />
              <span>Marketing (externe Kampagnenmessung)</span>
            </label>
          </fieldset>
        </div>
      )}
    </aside>
  )
}
