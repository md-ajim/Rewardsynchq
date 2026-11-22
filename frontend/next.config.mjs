const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://b5g2sob5d0.execute-api.us-east-1.amazonaws.com'

let apiOrigin = ''
let apiHost = ''
try {
  const parsed = new URL(apiBaseUrl)
  apiOrigin = parsed.origin
  apiHost = parsed.hostname
} catch {
  // Ignore malformed URLs; the app falls back to the default API.
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a self-contained server bundle for the Docker runtime stage.
  output: 'standalone',
  // Production config
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'dew9cnwc0a7w5.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'b5g2sob5d0.execute-api.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'play-lh.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.sentrypc.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow next/image to serve media uploaded to the Django backend.
      ...(apiHost && !['localhost', '127.0.0.1'].includes(apiHost)
        ? [{ protocol: 'https', hostname: apiHost }]
        : []),
    ],
  },

  async rewrites() {
    return [];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' blob: data: https:; connect-src 'self' http://localhost:8000 ${apiOrigin} https://*.execute-api.us-east-1.amazonaws.com https://logo.clearbit.com https://*.google-analytics.com https://*.analytics.google.com; frame-src 'self' https://accounts.google.com https://www.google.com; object-src 'none';`,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

export default nextConfig
