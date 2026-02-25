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

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
