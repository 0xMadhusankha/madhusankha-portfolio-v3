'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    /** Maximum tilt in degrees. */
    tilt?: number;
}

// A card that leans towards the pointer and lights up where it is
const TiltCard = ({ children, className = '', tilt = 6 }: TiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el || !window.matchMedia('(hover: hover)').matches) return;

        const rotateX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const rotateY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        const onMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            el.style.setProperty('--mx', `${px * 100}%`);
            el.style.setProperty('--my', `${py * 100}%`);
            rotateY((px - 0.5) * tilt);
            rotateX((0.5 - py) * tilt);
        };
        const onLeave = () => {
            rotateX(0);
            rotateY(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
        };
    });

    return (
        <div className="tilt-wrap h-full">
            <div ref={ref} className={`tilt-card card h-full ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
