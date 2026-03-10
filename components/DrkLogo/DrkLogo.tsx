/**
 * DRK (Deutsches Rotes Kreuz) logo component.
 * Renders the official DRK circular emblem (red cross with
 * "DEUTSCHES ROTES KREUZ" text around the perimeter).
 *
 * The logo image must be placed in the consuming app's public directory
 * as `/drk-logo.png`. A copy is shipped in the package's `assets/` folder.
 */

interface DrkLogoProps {
  /** Width and height of the logo in pixels. Defaults to 42. */
  size?: number
  /** Image source path. Defaults to `/drk-logo.png` (served from public/). */
  src?: string
  /** Additional CSS class name. */
  className?: string
}

/**
 * Renders the official DRK emblem as an img element.
 * Consuming apps must place `drk-logo.png` in their public directory.
 */
export default function DrkLogo({ size = 42, src = '/drk-logo.png', className }: DrkLogoProps) {
  return (
    <img
      src={src}
      alt="Deutsches Rotes Kreuz"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
