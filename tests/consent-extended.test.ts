import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CONSENT_COOKIE_KEY,
  CONSENT_STORAGE_KEY,
  DEFAULT_CONSENT,
  clearConsentData,
  getConsentDataForExport,
  hasAllConsent,
  hasConsent,
  onConsentChange,
  setStoredConsent,
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

describe('hasConsent', () => {
  beforeEach(() => {
    createWindowMock()
  })

  it('always returns true for "necessary" category', () => {
    expect(hasConsent('necessary')).toBe(true)
  })

  it('returns false for non-necessary categories when no choice has been made', () => {
    expect(hasConsent('analytics')).toBe(false)
    expect(hasConsent('marketing')).toBe(false)
    expect(hasConsent('functional')).toBe(false)
  })

  it('returns true for a consented category after storing consent', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    }
    setStoredConsent(consent)
    expect(hasConsent('functional')).toBe(true)
    expect(hasConsent('analytics')).toBe(false)
    expect(hasConsent('marketing')).toBe(false)
  })

  it('returns false when choiceMade is false even if category is true', () => {
    const consent: CookieConsent = {
      choiceMade: false,
      timestamp: 0,
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
    expect(hasConsent('analytics')).toBe(false)
  })
})

describe('hasAllConsent', () => {
  beforeEach(() => {
    createWindowMock()
  })

  it('returns true when all requested categories are consented', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setStoredConsent(consent)
    expect(hasAllConsent(['necessary', 'functional', 'analytics', 'marketing'])).toBe(true)
  })

  it('returns false when at least one category is not consented', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    }
    setStoredConsent(consent)
    expect(hasAllConsent(['functional', 'analytics'])).toBe(false)
  })

  it('returns true for an empty array of categories', () => {
    expect(hasAllConsent([])).toBe(true)
  })

  it('returns true when only "necessary" is requested (always true)', () => {
    expect(hasAllConsent(['necessary'])).toBe(true)
  })

  it('returns false for non-necessary categories when no choice made', () => {
    expect(hasAllConsent(['analytics', 'marketing'])).toBe(false)
  })
})

describe('clearConsentData', () => {
  beforeEach(() => {
    createWindowMock()
  })

  it('removes consent from localStorage', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setStoredConsent(consent)
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeTruthy()

    clearConsentData()
    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull()
  })

  it('sets cookie with Max-Age=0 to expire it', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    }
    setStoredConsent(consent)
    clearConsentData()
    expect(document.cookie).toContain(`${CONSENT_COOKIE_KEY}=; Path=/; Max-Age=0`)
  })

  it('notifies listeners with DEFAULT_CONSENT after clearing', () => {
    const listener = vi.fn()
    const unsub = onConsentChange(listener)

    setStoredConsent({
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    })
    listener.mockClear()

    clearConsentData()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ choiceMade: false }))

    unsub()
  })
})

describe('getConsentDataForExport', () => {
  beforeEach(() => {
    createWindowMock()
  })

  it('returns current consent data', () => {
    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: false,
      analytics: true,
      marketing: false,
    }
    setStoredConsent(consent)

    const exported = getConsentDataForExport()
    expect(exported.consent.choiceMade).toBe(true)
    expect(exported.consent.analytics).toBe(true)
    expect(exported.consent.functional).toBe(false)
  })

  it('includes storage key identifiers', () => {
    const exported = getConsentDataForExport()
    expect(exported.storageKeys.localStorage).toBe(CONSENT_STORAGE_KEY)
    expect(exported.storageKeys.cookie).toBe(CONSENT_COOKIE_KEY)
  })

  it('includes an ISO date string for exportedAt', () => {
    const exported = getConsentDataForExport()
    expect(exported.exportedAt).toBeTruthy()
    const parsed = new Date(exported.exportedAt)
    expect(parsed.getTime()).not.toBeNaN()
  })

  it('returns default consent when nothing has been stored', () => {
    const exported = getConsentDataForExport()
    expect(exported.consent).toEqual(DEFAULT_CONSENT)
  })
})

describe('onConsentChange', () => {
  beforeEach(() => {
    createWindowMock()
  })

  afterEach(() => {
    // Ensure no lingering listeners leak between tests
  })

  it('calls the listener when consent is stored', () => {
    const listener = vi.fn()
    const unsub = onConsentChange(listener)

    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: false,
      marketing: false,
    }
    setStoredConsent(consent)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(consent)

    unsub()
  })

  it('returns an unsubscribe function that removes the listener', () => {
    const listener = vi.fn()
    const unsub = onConsentChange(listener)

    unsub()

    setStoredConsent({
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })

    expect(listener).not.toHaveBeenCalled()
  })

  it('supports multiple listeners', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    const unsub1 = onConsentChange(listener1)
    const unsub2 = onConsentChange(listener2)

    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }
    setStoredConsent(consent)

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)

    unsub1()
    unsub2()
  })

  it('unsubscribing one listener does not affect others', () => {
    const listener1 = vi.fn()
    const listener2 = vi.fn()
    const unsub1 = onConsentChange(listener1)
    const unsub2 = onConsentChange(listener2)

    unsub1()

    setStoredConsent({
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    })

    expect(listener1).not.toHaveBeenCalled()
    expect(listener2).toHaveBeenCalledTimes(1)

    unsub2()
  })

  it('listener errors do not break consent flow', () => {
    const badListener = vi.fn(() => {
      throw new Error('Listener exploded')
    })
    const goodListener = vi.fn()
    const unsub1 = onConsentChange(badListener)
    const unsub2 = onConsentChange(goodListener)

    const consent: CookieConsent = {
      choiceMade: true,
      timestamp: Date.now(),
      policyVersion: '1',
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    }

    expect(() => setStoredConsent(consent)).not.toThrow()
    expect(badListener).toHaveBeenCalledTimes(1)
    expect(goodListener).toHaveBeenCalledTimes(1)

    unsub1()
    unsub2()
  })

  it('fires on clearConsentData as well', () => {
    const listener = vi.fn()
    const unsub = onConsentChange(listener)

    clearConsentData()

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ choiceMade: false }))

    unsub()
  })
})
