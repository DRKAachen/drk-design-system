/**
 * Utility functions for runtime site metadata access.
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
