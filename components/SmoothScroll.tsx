'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const SmoothScroll = () => {
    useEffect(() => {
        // Lenis drives the scroll position; GSAP's ticker drives Lenis so that
        // ScrollTrigger and the smooth scroll stay on the same frame.
        // Lenis switches its smoothing off when the OS asks for reduced motion.
        // The site owner wants the smooth scroll everywhere, so that is overridden.
        const lenis = new Lenis({ lerp: 0.085, respectReducedMotion: false });
        lenis.on('scroll', ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        const onClick = (e: MouseEvent) => {
            const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
            const target = link && document.getElementById(link.hash.slice(1));
            if (!target) return;
            e.preventDefault();
            // Lenis already honours the scroll-padding-top set on <html>
            lenis.scrollTo(target, { duration: 1.4 });
        };
        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
            gsap.ticker.remove(tick);
            lenis.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
