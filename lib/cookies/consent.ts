/**
 * Cookie consent handling for GDPR/DSGVO compliance.
 *
 * Provides storage, retrieval, enforcement checking, and lifecycle hooks
 * for cookie consent. Consuming apps should use `hasConsent()` to gate
 * any tracking or non-essential functionality behind user consent.
 */

export const CONSENT_STORAGE_KEY = 'drk_cookie_consent'
export const CONSENT_COOKIE_KEY = 'drk_cookie_consent_v1'
const CONSENT_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365
const CONSENT_RETENTION_MS = CONSENT_COOKIE_MAX_AGE_SECONDS * 1000
const MAX_COOKIE_SIZE_BYTES = 4096

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

/**
 * Callback signature for consent change events.
 * Apps can use this to send consent to a server-side audit log (DSGVO Art. 7(1)).
 */
export type ConsentChangeCallback = (consent: CookieConsent) => void

let consentChangeListeners: ConsentChangeCallback[] = []

export const DEFAULT_CONSENT: CookieConsent = {
  choiceMade: false,
  timestamp: 0,
  policyVersion: '1',
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
}

/**
 * Registers a listener called whenever consent is stored or cleared.
 * Use this to forward consent events to a server-side audit log.
 * Returns an unsubscribe function.
 */
export function onConsentChange(callback: ConsentChangeCallback): () => void {
  consentChangeListeners.push(callback)
  return () => {
    consentChangeListeners = consentChangeListeners.filter((cb) => cb !== callback)
  }
}

/** Notifies all registered consent listeners. */
function notifyListeners(consent: CookieConsent): void {
  for (const listener of consentChangeListeners) {
    try {
      listener(consent)
    } catch {
      // Listener errors must not break consent flow
    }
  }
}

/**
 * Checks whether a specific cookie category has been consented to.
 * `necessary` always returns true. For all other categories, returns
 * true only when the user has actively given consent.
 *
 * Use this to gate analytics, marketing, or functional scripts:
 *   if (hasConsent('analytics')) { initAnalytics() }
 */
export function hasConsent(category: CookieCategory): boolean {
  if (category === 'necessary') return true
  const stored = getStoredConsent()
  if (!stored.choiceMade) return false
  return stored[category] === true
}

/**
 * Checks whether consent has been granted for all of the given categories.
 */
export function hasAllConsent(categories: CookieCategory[]): boolean {
  return categories.every((cat) => hasConsent(cat))
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
  } catch {
    // Silent fallback: consent is best-effort in constrained environments
  }
  notifyListeners(consent)
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
  if (raw.length > MAX_COOKIE_SIZE_BYTES) return { ...DEFAULT_CONSENT }
  return parseConsentOrDefault(raw)
}

/**
 * Removes all stored consent data (localStorage + cookie).
 * Use for DSGVO Art. 17 (Recht auf Löschung / right to erasure) flows.
 */
export function clearConsentData(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // localStorage may be unavailable
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${CONSENT_COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`
  }
  notifyListeners({ ...DEFAULT_CONSENT })
}

/**
 * Returns consent data in a portable JSON format.
 * Use for DSGVO Art. 20 (Recht auf Datenübertragbarkeit / data portability).
 */
export function getConsentDataForExport(): {
  consent: CookieConsent
  storageKeys: { localStorage: string; cookie: string }
  exportedAt: string
} {
  return {
    consent: getStoredConsent(),
    storageKeys: {
      localStorage: CONSENT_STORAGE_KEY,
      cookie: CONSENT_COOKIE_KEY,
    },
    exportedAt: new Date().toISOString(),
  }
}

function parseConsentOrDefault(raw: string): CookieConsent {
  try {
    if (raw.length > MAX_COOKIE_SIZE_BYTES) return { ...DEFAULT_CONSENT }
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
