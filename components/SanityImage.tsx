'use client';

import Image, { type ImageProps } from 'next/image';
import { sanityLoader } from '@/lib/sanity';

// next/image with Sanity's CDN loader. The loader is a function, which a
// server component cannot pass to next/image, so the pairing lives here.
const SanityImage = (props: Omit<ImageProps, 'loader'>) => <Image loader={sanityLoader} {...props} />;

export default SanityImage;
