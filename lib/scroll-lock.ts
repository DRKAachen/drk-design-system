/**
 * iOS-safe body scroll lock.
 *
 * `overflow: hidden` on <body> doesn't prevent scrolling on iOS Safari.
 * This utility saves the scroll position, fixes the body, and restores
 * the position on unlock.
 */

let scrollY = 0
let lockCount = 0

/** Prevents body from scrolling (stacks with multiple callers). */
export function lockBodyScroll(): void {
  lockCount++
  if (lockCount > 1) return

  scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.overflow = 'hidden'
}

/** Restores body scrolling (only when all locks are released). */
export function unlockBodyScroll(): void {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount > 0) return

  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.overflow = ''
  window.scrollTo(0, scrollY)
}
