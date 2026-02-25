'use client'

/**
 * Legal page component that renders Portable Text content from Sanity.
 */

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Link from 'next/link'
import styles from './LegalPage.module.scss'

interface LegalPageProps {
  title: string
  content: any[]
  lastUpdated?: string
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className={styles.heading2}>{children}</h2>,
    h3: ({ children }) => <h3 className={styles.heading3}>{children}</h3>,
    h4: ({ children }) => <h4 className={styles.heading4}>{children}</h4>,
    normal: ({ children }) => <p className={styles.paragraph}>{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ value, children }) => {
      const target = value?.openInNewTab ? '_blank' : undefined
      const rel = value?.openInNewTab ? 'noopener noreferrer' : undefined
      return (
        <a href={value?.href} target={target} rel={rel}>
          {children}
        </a>
      )
    },
    internalLink: ({ value, children }) => {
      const href = value?.reference?.slug?.current
        ? `/${value.reference.slug.current}`
        : '#'
      return <Link href={href}>{children}</Link>
    },
  },
  list: {
    bullet: ({ children }) => <ul className={styles.list}>{children}</ul>,
    number: ({ children }) => <ol className={styles.list}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

export default function LegalPage({ title, content, lastUpdated }: LegalPageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page__title">{title}</h1>
        {lastUpdated && (
          <p className={styles.lastUpdated}>
            Stand: {formatDate(lastUpdated)}
          </p>
        )}
        <div className={styles.legalContent}>
          <PortableText value={content} components={portableTextComponents} />
        </div>
      </div>
    </div>
  )
}
