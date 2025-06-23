/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@pos-crm/ui", "@pos-crm/utils"],
  experimental: {
    esmExternals: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 