/**
 * Navigation component - renders site navigation from Sanity.
 * Includes mobile hamburger menu and keyboard-accessible dropdowns.
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { SiteConfig } from '../../lib/site'
import styles from './Navigation.module.scss'

interface NavigationProps {
  site: SiteConfig
}

export default function Navigation({ site }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState<number | null>(null)
  const submenuTriggerRefs = useRef<Array<HTMLButtonElement | null>>([])

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

  const focusSubmenuItem = (index: number, to: 'first' | 'last') => {
    const submenu = document.getElementById(getSubmenuId(index))
    if (!submenu) return
    const links = submenu.querySelectorAll<HTMLAnchorElement>('a[href]')
    if (links.length === 0) return
    if (to === 'first') {
      links[0].focus()
    } else {
      links[links.length - 1].focus()
    }
  }

  const handleSubmenuKeyDown = (
    event: React.KeyboardEvent,
    index: number,
    hasChildren: boolean
  ) => {
    if (!hasChildren) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpenSubmenuIndex(openSubmenuIndex === index ? null : index)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpenSubmenuIndex(index)
      setTimeout(() => focusSubmenuItem(index, 'first'), 0)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpenSubmenuIndex(index)
      setTimeout(() => focusSubmenuItem(index, 'last'), 0)
    } else if (event.key === 'Home') {
      event.preventDefault()
      const firstTrigger = submenuTriggerRefs.current.find(Boolean)
      firstTrigger?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      const lastTrigger = [...submenuTriggerRefs.current].reverse().find(Boolean)
      lastTrigger?.focus()
    } else if (event.key === 'Escape') {
      setOpenSubmenuIndex(null)
    }
  }

  const handleSubmenuItemKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    setOpenSubmenuIndex(null)
    submenuTriggerRefs.current[index]?.focus()
  }

  const getSubmenuId = (index: number) => `navigation-submenu-${index}`

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
                  ref={(element) => {
                    submenuTriggerRefs.current[index] = element
                  }}
                  type="button"
                  className={styles.navigation__link}
                  aria-expanded={isSubmenuOpen}
                  aria-haspopup="true"
                  aria-controls={getSubmenuId(index)}
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
                  id={getSubmenuId(index)}
                  className={styles.navigation__submenu}
                  aria-label={`${item.label} Untermenü`}
                  aria-hidden={!isSubmenuOpen}
                >
                  <li className={styles['navigation__submenu-item']}>
                    <a
                      href={item.href}
                      className={`${styles['navigation__submenu-link']} ${styles['navigation__submenu-link--parent']}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onKeyDown={(event) => handleSubmenuItemKeyDown(event, index)}
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
                        onKeyDown={(event) => handleSubmenuItemKeyDown(event, index)}
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
