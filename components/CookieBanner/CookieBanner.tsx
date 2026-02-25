'use client'

/**
 * Cookie banner for GDPR/DSGVO compliance.
 * Shown until the user makes a choice; stores consent in localStorage.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => setVisible(shouldShowBanner()), 0)
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
        </div>
      </div>
    </aside>
  )
}
