/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@drkaachen/design-system-ui'],
  sassOptions: {
    includePaths: ['./node_modules/@drkaachen/design-system-ui/styles', './app'],
  },
}

module.exports = nextConfig
