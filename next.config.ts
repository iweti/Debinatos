import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    poweredByHeader: false,
    devIndicators: false,
    experimental: {
        agentUpgrade: 'security',
        serverActions: { bodySizeLimit: '4250kb' },
    },
}

export default nextConfig
