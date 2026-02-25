/**
 * Utility functions for common operations.
 */

import { headers } from 'next/headers'

export function getSiteHostname(headersList: Headers): string {
  return headersList.get('x-site-hostname') || headersList.get('host') || ''
}

export async function getSiteIdFromHeaders(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-site-id')
}

export async function getSiteHostnameFromHeaders(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-site-hostname')
}

/**
 * Formats a date for display. Uses German locale by default (DRK apps).
 * @param date - Date string or Date object
 * @param locale - Optional locale (default: de-DE)
 */
export function formatDate(date: string | Date, locale = 'de-DE'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
