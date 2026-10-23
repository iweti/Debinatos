import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    devIndicators: false,
    experimental: {
        agentUpgrade: 'security',
    },
}

export default nextConfig
