import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { SANITY_TAG } from '@/lib/sanity';

// Sanity calls this (a webhook set up in sanity.io/manage) whenever a document
// is published, changed or deleted, so the site rebuilds straight away instead
// of waiting for its timed refresh. The request is signed with
// SANITY_REVALIDATE_SECRET, which must match the webhook's secret.
export async function POST(request: NextRequest) {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) return NextResponse.json({ message: 'Revalidation is not configured' }, { status: 500 });

    // The third argument waits until Sanity's CDN has the change, so the
    // rebuilt page does not read the old content
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
    if (!isValidSignature) return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });

    revalidateTag(SANITY_TAG);
    revalidatePath('/', 'layout');
    return NextResponse.json({ revalidated: true, type: body?._type ?? null });
}
