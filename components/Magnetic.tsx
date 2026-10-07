'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Pulls its child a little towards the pointer while hovered
const Magnetic = ({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el || !window.matchMedia('(hover: hover)').matches) return;

        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
            yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
            xTo(0);
            yTo(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    });

    return (
        <span ref={ref} className="inline-block">
            {children}
        </span>
    );
};

export default Magnetic;
