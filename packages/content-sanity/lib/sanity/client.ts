/**
 * Sanity client configuration for fetching content.
 */

import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'drk-placeholder'
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NODE_ENV !== 'production') {
  console.warn(
    '[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Using placeholder projectId for local rendering.'
  )
}

const client = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export default client
