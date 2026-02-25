/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@drk/design-system'],
  sassOptions: {
    includePaths: ['./node_modules/@drk/design-system/styles', './app'],
  },
}

module.exports = nextConfig
