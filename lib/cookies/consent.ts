/**
 * Cookie consent handling for GDPR/DSGVO compliance.
 */

export const CONSENT_STORAGE_KEY = 'drk_cookie_consent'
export const CONSENT_COOKIE_KEY = 'drk_cookie_consent_v1'
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const CONSENT_RETENTION_MS = CONSENT_COOKIE_MAX_AGE_SECONDS * 1000

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookieConsent {
  choiceMade: boolean
  timestamp: number
  policyVersion: string
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

export const DEFAULT_CONSENT: CookieConsent = {
  choiceMade: false,
  timestamp: 0,
  policyVersion: '1',
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

export function getAllConsent(): CookieConsent {
  return {
    choiceMade: true,
    timestamp: Date.now(),
    policyVersion: '1',
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
    policyVersion: '1',
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
    const localRaw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (localRaw) {
      return parseConsentOrDefault(localRaw)
    }

    const cookieRaw = getCookieValue(CONSENT_COOKIE_KEY)
    if (cookieRaw) {
      return parseConsentOrDefault(cookieRaw)
    }

    return { ...DEFAULT_CONSENT }
  } catch {
    return { ...DEFAULT_CONSENT }
  }
}

export function setStoredConsent(consent: CookieConsent): CookieConsent {
  if (typeof window === 'undefined') return consent
  try {
    const serializedConsent = JSON.stringify(consent)
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serializedConsent)
    setConsentCookie(serializedConsent)
  } catch (e) {
    console.warn('[CookieConsent] Could not save consent to localStorage:', e)
  }
  return consent
}

export function shouldShowBanner(): boolean {
  const stored = getStoredConsent()
  if (!stored.choiceMade) return true
  if (!stored.timestamp) return true
  return Date.now() - stored.timestamp > CONSENT_RETENTION_MS
}

/**
 * Reads consent from a Cookie header value (server-side usage).
 * Returns default consent when no valid consent exists.
 */
export function getStoredConsentFromCookieHeader(cookieHeader: string | null): CookieConsent {
  if (!cookieHeader) return { ...DEFAULT_CONSENT }
  const cookieName = `${CONSENT_COOKIE_KEY}=`
  const entry = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName))
  if (!entry) return { ...DEFAULT_CONSENT }
  const raw = entry.slice(cookieName.length)
  return parseConsentOrDefault(raw)
}

function parseConsentOrDefault(raw: string): CookieConsent {
  try {
    const decoded = decodeURIComponent(raw)
    const parsed = JSON.parse(decoded) as Partial<CookieConsent>
    if (!parsed || typeof parsed.choiceMade !== 'boolean') {
      return { ...DEFAULT_CONSENT }
    }
    return {
      choiceMade: parsed.choiceMade,
      timestamp: typeof parsed.timestamp === 'number' ? parsed.timestamp : 0,
      policyVersion: typeof parsed.policyVersion === 'string' ? parsed.policyVersion : '1',
      necessary: parsed.necessary !== false,
      functional: Boolean(parsed.functional),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return { ...DEFAULT_CONSENT }
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null
  const cookieName = `${name}=`
  const entry = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(cookieName))
  return entry ? entry.slice(cookieName.length) : null
}

function setConsentCookie(serializedConsent: string): void {
  if (typeof document === 'undefined') return
  const secureAttribute = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_KEY}=${encodeURIComponent(serializedConsent)}; Path=/; Max-Age=${CONSENT_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secureAttribute}`
}
