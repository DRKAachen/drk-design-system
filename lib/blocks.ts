/**
 * Types for Sanity block content used by BlockRenderer.
 * Align with GROQ queries in lib/sanity/queries.ts.
 */

/** Sanity image reference or asset - compatible with urlFor() from @sanity/image-url. */
export type SanityBlockImageSource = object

/** Base block with _type and optional _key from Sanity. */
export interface SanityBlockBase {
  _type: string
  _key?: string
}

export interface HeroBlock extends SanityBlockBase {
  _type: 'heroBlock'
  heading: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: SanityBlockImageSource
}

export interface TextImageBlock extends SanityBlockBase {
  _type: 'textImageBlock'
  heading: string
  text?: string
  image?: SanityBlockImageSource
  imagePosition?: 'left' | 'right'
  ctaText?: string
  ctaLink?: string
}

export interface CtaSectionBlock extends SanityBlockBase {
  _type: 'ctaSection'
  heading: string
  text?: string
  ctaText?: string
  ctaLink?: string
}

export interface FaqBlockItem {
  question: string
  answer: string
}

export interface FaqBlock extends SanityBlockBase {
  _type: 'faqBlock'
  heading: string
  items?: FaqBlockItem[]
}

export type BlockRendererBlock =
  | HeroBlock
  | TextImageBlock
  | CtaSectionBlock
  | FaqBlock

/** Type guard: href is an internal path (use Next.js Link). */
export function isInternalPath(href: string): boolean {
  const t = href.trim()
  return t.startsWith('/') && !t.startsWith('//')
}

