/**
 * Header component - site logo and main navigation from Sanity.
 */

import Image from 'next/image'
import Link from 'next/link'
import { SiteConfig } from '../../lib/site'
import { urlFor } from '../../lib/sanity/client'
import Navigation from '../Navigation/Navigation'
import styles from './Header.module.scss'

interface HeaderProps {
  site: SiteConfig | null
}

/**
 * Renders the site header with logo and navigation from Sanity site config.
 */
export default function Header({ site }: HeaderProps) {
  if (!site) {
    return (
      <header className={styles.header}>
        <div className={styles.header__inner}>
          <span className={styles.header__siteName}>Corporate Site</span>
        </div>
      </header>
    )
  }

  const logoUrl = site.logo
    ? urlFor(site.logo).height(120).fit('max').auto('format').url()
    : null

  return (
    <header className={styles.header} role="banner">
      <div className={styles.header__inner}>
        <div className={styles.header__brand}>
          <Link href="/" className={styles.header__logoLink} aria-label={`${site.name} home`}>
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={site.name}
                width={120}
                height={120}
                className={styles.header__logo}
                unoptimized
              />
            ) : (
              <span className={styles.header__siteName}>{site.name}</span>
            )}
          </Link>
        </div>
        <Navigation site={site} />
      </div>
    </header>
  )
}
