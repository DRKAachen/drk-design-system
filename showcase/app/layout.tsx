import type { Metadata } from 'next'
import '../../styles/globals.scss'

export const metadata: Metadata = {
  title: 'DRK Design System Showcase',
  description: 'Interactive component showcase for @drkaachen/design-system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="app">{children}</body>
    </html>
  )
}
