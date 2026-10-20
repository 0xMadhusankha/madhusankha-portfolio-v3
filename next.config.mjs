const isDev = process.env.NODE_ENV !== 'production';

const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://va.vercel-scripts.com https://vercel.live`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https://cdn.sanity.io data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://vercel.live" + (isDev ? ' ws:' : ''),
    "frame-src 'self' https://vercel.live",
    "media-src 'self' blob:",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Don't announce the framework in an X-Powered-By header
    poweredByHeader: false,
    // security.txt lives under /.well-known (RFC 9116); the old root location points there
    async redirects() {
        return [{ source: '/security.txt', destination: '/.well-known/security.txt', permanent: true }];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
            {
                // The Studio talks to Sanity's APIs and builds its own UI at runtime,
                // so the site's strict policy is applied to everything except /studio.
                source: '/((?!studio).*)',
                headers: [{ key: 'Content-Security-Policy', value: csp }],
            },
        ];
    },
};

export default nextConfig;
