/**
 * Navigation component - renders site navigation from Sanity.
 * Includes mobile hamburger menu and keyboard-accessible dropdowns.
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { SiteConfig } from '../../lib/site'
import styles from './Navigation.module.scss'

interface NavigationProps {
  site: SiteConfig
}

export default function Navigation({ site }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null)

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        setOpenSubmenuIndex(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent,
    index: number,
    hasChildren: boolean
  ) => {
    if (!hasChildren) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenSubmenuIndex(openSubmenuIndex === index ? null : index)
    } else if (event.key === 'Escape') {
      setOpenSubmenuIndex(null)
    }
  }

  if (!site.navigation || site.navigation.length === 0) {
    return null
  }

  return (
    <nav className={styles.navigation} role="navigation" aria-label="Hauptnavigation">
      <button
        type="button"
        className={styles.navigation__toggle}
        onClick={toggleMobileMenu}
        aria-expanded={isMobileMenuOpen}
        aria-controls="main-navigation"
        aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
      >
        <span className={styles.navigation__toggleIcon} aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {isMobileMenuOpen && (
        <div
          className={styles.navigation__backdrop}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <ul
        id="main-navigation"
        className={`${styles.navigation__list} ${isMobileMenuOpen ? styles['navigation__list--open'] : ''}`}
      >
        {site.navigation.map((item, index) => {
          const hasChildren = item.children && item.children.length > 0
          const isSubmenuOpen = openSubmenuIndex === index

          return (
            <li
              key={index}
              className={`${styles.navigation__item} ${isSubmenuOpen ? styles['navigation__item--open'] : ''}`}
              onMouseEnter={() => hasChildren && setOpenSubmenuIndex(index)}
              onMouseLeave={() => hasChildren && setOpenSubmenuIndex(null)}
            >
              {hasChildren ? (
                <button
                  type="button"
                  className={styles.navigation__link}
                  aria-expanded={isSubmenuOpen}
                  aria-haspopup="true"
                  onKeyDown={(e) => handleSubmenuKeyDown(e, index, true)}
                  onFocus={() => setOpenSubmenuIndex(index)}
                >
                  {item.label}
                  <span className={styles.navigation__arrow} aria-hidden="true" />
                </button>
              ) : (
                <a
                  href={item.href}
                  className={styles.navigation__link}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              )}

              {hasChildren && (
                <ul
                  className={styles.navigation__submenu}
                  aria-label={`${item.label} Untermenü`}
                >
                  <li className={styles['navigation__submenu-item']}>
                    <a
                      href={item.href}
                      className={`${styles['navigation__submenu-link']} ${styles['navigation__submenu-link--parent']}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label} Übersicht
                    </a>
                  </li>
                  {item.children!.map((child, childIndex) => (
                    <li key={childIndex} className={styles['navigation__submenu-item']}>
                      <a
                        href={child.href}
                        className={styles['navigation__submenu-link']}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
