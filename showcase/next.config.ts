import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@drkaachen/design-system-ui'],
  sassOptions: {
    includePaths: ['./node_modules/@drkaachen/design-system-ui/styles', './app'],
  },
}

export default nextConfig
