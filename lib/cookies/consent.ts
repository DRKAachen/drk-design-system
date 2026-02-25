/**
 * Cookie consent handling for GDPR/DSGVO compliance.
 */

export const CONSENT_STORAGE_KEY = 'drk_cookie_consent'

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookieConsent {
  choiceMade: boolean
  timestamp: number
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export const DEFAULT_CONSENT: CookieConsent = {
  choiceMade: false,
  timestamp: 0,
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

export function getAllConsent(): CookieConsent {
  return {
    choiceMade: true,
    timestamp: Date.now(),
    necessary: true,
    functional: true,
    analytics: true,
    marketing: true,
  }
}

export function getNecessaryOnlyConsent(): CookieConsent {
  return {
    choiceMade: true,
    timestamp: Date.now(),
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  }
}

export function getStoredConsent(): CookieConsent {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_CONSENT }
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONSENT }
    const parsed = JSON.parse(raw) as Partial<CookieConsent>
    if (!parsed || typeof parsed.choiceMade !== 'boolean') {
      return { ...DEFAULT_CONSENT }
    }
    return {
      choiceMade: parsed.choiceMade,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : 0,
      necessary: parsed.necessary !== false,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return { ...DEFAULT_CONSENT }
  }
}

export function setStoredConsent(consent: CookieConsent): CookieConsent {
  if (typeof window === 'undefined') return consent
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
  } catch (e) {
    console.warn('[CookieConsent] Could not save consent to localStorage:', e)
  }
  return consent
}

export function shouldShowBanner(): boolean {
  const stored = getStoredConsent()
  return !stored.choiceMade
}
