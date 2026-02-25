import { beforeEach, describe, expect, it } from 'vitest'
import {
  CONSENT_COOKIE_KEY,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  getAllConsent,
  getNecessaryOnlyConsent,
  getStoredConsent,
  getStoredConsentFromCookieHeader,
  setStoredConsent,
  shouldShowBanner,
  type CookieConsent,
} from '../lib/cookies/consent'

class LocalStorageMock {
  private store = new Map<string, string>()

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

function createWindowMock(protocol: 'http:' | 'https:' = 'https:') {
  const localStorage = new LocalStorageMock()
  let cookieJar = ''

  const documentMock = {
    get cookie() {
      return cookieJar
    },
    set cookie(value: string) {
      cookieJar = cookieJar ? `${cookieJar}; ${value}` : value
    },
  }

  const windowMock = {
    localStorage,
    location: { protocol },
  }

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: windowMock,
  })
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: documentMock,
  })
}

describe('cookie consent storage', () => {
  beforeEach(() => {
    createWindowMock('https:')
  })

  it('defaults to banner visible when no consent exists', () => {
    expect(getStoredConsent()).toEqual(DEFAULT_CONSENT)
    expect(shouldShowBanner()).toBe(true)
  })

  it('stores and reads full consent through localStorage and cookie', () => {
    const consent = getAllConsent()
    const stored = setStoredConsent(consent)

    expect(stored.choiceMade).toBe(true)
    expect(getStoredConsent().analytics).toBe(true)
    expect(document.cookie).toContain(`${CONSENT_COOKIE_KEY}=`)
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeTruthy()
    expect(shouldShowBanner()).toBe(false)
  })

  it('reads consent from cookie when localStorage is empty', () => {
    const consent: CookieConsent = getNecessaryOnlyConsent()
    const encoded = encodeURIComponent(JSON.stringify(consent))
    document.cookie = `${CONSENT_COOKIE_KEY}=${encoded}; Path=/; SameSite=Lax`

    expect(getStoredConsent()).toMatchObject({
      choiceMade: true,
      necessary: true,
      analytics: false,
      marketing: false,
    })
  })

  it('shows banner again when consent is expired', () => {
    const expiredConsent: CookieConsent = {
      ...getNecessaryOnlyConsent(),
      timestamp: Date.now() - 366 * 24 * 60 * 60 * 1000,
    }
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(expiredConsent))
    expect(shouldShowBanner()).toBe(true)
  })

  it('parses consent from server cookie header', () => {
    const consent = getAllConsent()
    const encoded = encodeURIComponent(JSON.stringify(consent))
    const header = `foo=bar; ${CONSENT_COOKIE_KEY}=${encoded}; another=value`

    expect(getStoredConsentFromCookieHeader(header)).toMatchObject({
      choiceMade: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
  })

  it('returns defaults for invalid server cookie payloads', () => {
    const header = `${CONSENT_COOKIE_KEY}=not-json`
    expect(getStoredConsentFromCookieHeader(header)).toEqual(DEFAULT_CONSENT)
  })
})
