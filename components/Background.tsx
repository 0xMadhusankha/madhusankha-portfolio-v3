'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Fixed backdrop behind the whole page: grid, drifting colour, grain and a
// soft light that follows the pointer.
const Background = () => {
    const glow = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const xTo = gsap.quickTo(glow.current, 'x', { duration: 0.9, ease: 'power3.out' });
        const yTo = gsap.quickTo(glow.current, 'y', { duration: 0.9, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    });

    return (
        <div className="bg" aria-hidden="true">
            <div className="bg-orb bg-orb-a" />
            <div className="bg-orb bg-orb-b" />
            <div className="bg-orb bg-orb-c" />
            <div className="bg-grid" />
            <div ref={glow} className="bg-glow" />
            <div className="bg-noise" />
        </div>
    );
};

export default Background;
