/**
 * BlockRenderer - renders content blocks from Sanity.
 * Supports hero, text+image, CTA, and FAQ blocks.
 */

import Image from 'next/image'
import { urlFor } from '../../lib/sanity/client'

interface BlockRendererProps {
  block: any
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block._type) {
    case 'heroBlock':
      return <HeroBlock block={block} />

    case 'textImageBlock':
      return <TextImageBlock block={block} />

    case 'ctaSection':
      return <CTASection block={block} />

    case 'faqBlock':
      return <FAQBlock block={block} />

    default:
      return null
  }
}

function HeroBlock({ block }: { block: any }) {
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
          <a href={block.ctaLink} className="button button--primary">
            {block.ctaText}
          </a>
        )}
      </div>
    </section>
  )
}

function TextImageBlock({ block }: { block: any }) {
  const imageUrl = block.image
    ? urlFor(block.image).width(600).height(400).url()
    : null

  return (
    <section
      className={`block block--text-image ${block.imagePosition === 'left' ? 'block--image-left' : ''}`}
    >
      <div className="block__content">
        <h2 className="block__heading">{block.heading}</h2>
        {block.text && (
          <div className="block__text" dangerouslySetInnerHTML={{ __html: block.text }} />
        )}
        {block.ctaText && block.ctaLink && (
          <a href={block.ctaLink} className="button">
            {block.ctaText}
          </a>
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

function CTASection({ block }: { block: any }) {
  return (
    <section className="block block--cta">
      <h2 className="block__heading">{block.heading}</h2>
      {block.text && <p className="block__text">{block.text}</p>}
      {block.ctaText && block.ctaLink && (
        <a href={block.ctaLink} className="button button--primary">
          {block.ctaText}
        </a>
      )}
    </section>
  )
}

function FAQBlock({ block }: { block: any }) {
  return (
    <section className="block block--faq">
      <h2 className="block__heading">{block.heading}</h2>
      <div className="faq-list">
        {block.items?.map((item: any, index: number) => (
          <div key={index} className="faq-item">
            <h3 className="faq-item__question">{item.question}</h3>
            <div
              className="faq-item__answer"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
