/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@drkaachen/design-system'],
  sassOptions: {
    includePaths: ['./node_modules/@drkaachen/design-system/styles', './app'],
  },
}

module.exports = nextConfig
