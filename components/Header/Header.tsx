/**
 * Header component - site logo and main navigation from Sanity.
 * Falls back to the DRK Red Cross emblem when no custom logo URL is provided.
 */

import Image from 'next/image'
import Link from 'next/link'
import { SiteConfig } from '../../lib/site-config'
import DrkLogo from '../DrkLogo/DrkLogo'
import Navigation from '../Navigation/Navigation'
import styles from './Header.module.scss'

interface HeaderProps {
  site: SiteConfig | null
}

/**
 * Renders the site header with optional logo URL and navigation.
 * When no logoUrl is set, the DRK Red Cross emblem is shown alongside the site name.
 */
export default function Header({ site }: HeaderProps) {
  if (!site) {
    return (
      <header className={styles.header} role="banner">
        <div className={styles.header__inner}>
          <div className={styles.header__brand}>
            <span className={styles.header__logoLink}>
              <DrkLogo size={36} className={styles.header__emblem} />
              <span className={styles.header__siteName}>Corporate Site</span>
            </span>
          </div>
        </div>
      </header>
    )
  }

  const logoUrl = site.logoUrl || null

  return (
    <header className={styles.header} role="banner">
      <div className={styles.header__inner}>
        <div className={styles.header__brand}>
          <Link
            href="/"
            className={styles.header__logoLink}
            aria-label={`${site.name} – Startseite`}
          >
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
              <>
                <DrkLogo size={36} className={styles.header__emblem} />
                <span className={styles.header__siteName}>{site.name}</span>
              </>
            )}
          </Link>
        </div>
        <Navigation site={site} />
      </div>
    </header>
  )
}
