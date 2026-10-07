import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The Studio lives on the ghost. subdomain (and on localhost for development).
// On any other host /studio does not exist.
export function middleware(request: NextRequest) {
    const hostname = (request.headers.get('host') || '').split(':')[0];
    const { pathname } = request.nextUrl;
    const isStudioHost = hostname.startsWith('ghost.') || hostname === 'localhost' || hostname === '127.0.0.1';

    if (hostname.startsWith('ghost.') && pathname === '/') {
        const url = request.nextUrl.clone();
        url.pathname = '/studio';
        return NextResponse.redirect(url);
    }

    if (pathname.startsWith('/studio') && !isStudioHost) {
        const url = request.nextUrl.clone();
        url.pathname = '/404';
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/studio/:path*'],
};
