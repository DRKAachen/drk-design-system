/**
 * BlockRenderer - renders content blocks from Sanity.
 * Supports hero, text+image, CTA, and FAQ blocks.
 * Uses typed blocks and sanitized HTML for rich text (XSS-safe).
 */

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../lib/sanity/client'
import { sanitizeHtml } from '../../lib/sanitize'
import {
  type BlockRendererBlock,
  type HeroBlock,
  type TextImageBlock,
  type CtaSectionBlock,
  type FaqBlock,
  isInternalPath,
} from '../../lib/blocks'
import Button from '../Button/Button'

interface BlockRendererProps {
  block: BlockRendererBlock
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block._type) {
    case 'heroBlock':
      return <HeroBlockComponent block={block} />
    case 'textImageBlock':
      return <TextImageBlockComponent block={block} />
    case 'ctaSection':
      return <CTASection block={block} />
    case 'faqBlock':
      return <FAQBlockComponent block={block} />
    default:
      return null
  }
}

function CtaButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
}) {
  if (isInternalPath(href)) {
    return (
      <Button variant={variant} asChild>
        <Link href={href}>{children}</Link>
      </Button>
    )
  }
  return (
    <Button variant={variant} asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    </Button>
  )
}

function HeroBlockComponent({ block }: { block: HeroBlock }) {
  const bgUrl = block.backgroundImage
    ? urlFor(block.backgroundImage)
        .width(1920)
        .fit('max')
        .auto('format')
        .quality(85)
        .url()
    : null

  const hasBackgroundImage = !!bgUrl

  return (
    <section
      className={`block block--hero ${hasBackgroundImage ? 'block--hero-with-image' : ''}`}
    >
      {bgUrl && (
        <Image
          src={bgUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          className="block__hero-image"
        />
      )}
      <div className="block__content">
        <h2 className="block__heading">{block.heading}</h2>
        {block.subheading && <p className="block__subheading">{block.subheading}</p>}
        {block.ctaText && block.ctaLink && (
          <CtaButton href={block.ctaLink} variant="primary">
            {block.ctaText}
          </CtaButton>
        )}
      </div>
    </section>
  )
}

function TextImageBlockComponent({ block }: { block: TextImageBlock }) {
  const imageUrl = block.image
    ? urlFor(block.image).width(600).height(400).url()
    : null

  const safeText = block.text ? sanitizeHtml(block.text) : null

  return (
    <section
      className={`block block--text-image ${block.imagePosition === 'left' ? 'block--image-left' : ''}`}
    >
      <div className="block__content">
        <h2 className="block__heading">{block.heading}</h2>
        {safeText && (
          <div className="block__text" dangerouslySetInnerHTML={{ __html: safeText }} />
        )}
        {block.ctaText && block.ctaLink && (
          <CtaButton href={block.ctaLink} variant="primary">
            {block.ctaText}
          </CtaButton>
        )}
      </div>
      {imageUrl && (
        <div className="block__image">
          <Image
            src={imageUrl}
            alt={block.heading || 'Content image'}
            width={600}
            height={400}
            unoptimized
          />
        </div>
      )}
    </section>
  )
}

function CTASection({ block }: { block: CtaSectionBlock }) {
  return (
    <section className="block block--cta">
      <h2 className="block__heading">{block.heading}</h2>
      {block.text && <p className="block__text">{block.text}</p>}
      {block.ctaText && block.ctaLink && (
        <CtaButton href={block.ctaLink} variant="primary">
          {block.ctaText}
        </CtaButton>
      )}
    </section>
  )
}

function FAQBlockComponent({ block }: { block: FaqBlock }) {
  return (
    <section className="block block--faq">
      <h2 className="block__heading">{block.heading}</h2>
      <div className="faq-list">
        {block.items?.map((item, index) => {
          const safeAnswer = item.answer ? sanitizeHtml(item.answer) : ''
          return (
            <div key={`${index}-${item.question}`} className="faq-item">
              <h3 className="faq-item__question">{item.question}</h3>
              <div
                className="faq-item__answer"
                dangerouslySetInnerHTML={{ __html: safeAnswer }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
