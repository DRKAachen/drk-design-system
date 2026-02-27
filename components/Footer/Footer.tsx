/**
 * Footer component - DRK Corporate Design. Renders site footer with legal links (DSGVO) and optional links from Sanity.
 */

import Link from 'next/link'
import { SiteConfig } from '../../lib/site-config'
import CookieSettingsLink from '../CookieBanner/CookieSettingsLink'
import styles from './Footer.module.scss'

const LEGAL_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
]

interface FooterProps {
  site: SiteConfig | null
}

function getFooterLinks(site: SiteConfig | null): Array<{ label: string; href: string }> {
  const legalHrefs = new Set(LEGAL_LINKS.map((l) => l.href))
  const combined: Array<{ label: string; href: string }> = [...LEGAL_LINKS]
  if (site?.footerLinks) {
    for (const link of site.footerLinks) {
      if (!legalHrefs.has(link.href)) {
        legalHrefs.add(link.href)
        combined.push(link)
      }
    }
  }
  return combined
}

export default function Footer({ site }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const links = getFooterLinks(site)

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.footer__inner}>
        <nav className={styles.footer__nav} aria-label="Footer navigation">
          <ul className={styles.footer__links}>
            {links.map((link, index) => (
              <li key={`${link.href}-${index}`} className={styles.footer__linkItem}>
                <Link href={link.href} className={styles.footer__link}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className={styles.footer__linkItem}>
              <CookieSettingsLink className={styles.footer__cookieBtn} />
            </li>
          </ul>
        </nav>

        <div className={styles.footer__copyright}>
          <p>&copy; {currentYear} {site?.name || 'Deutsches Rotes Kreuz'}</p>
        </div>
      </div>
    </footer>
  )
}
