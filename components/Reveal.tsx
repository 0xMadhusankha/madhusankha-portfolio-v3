'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    /** Seconds to wait after the element enters the viewport; use it to stagger siblings. */
    delay?: number;
}

const Reveal = ({ children, className, delay = 0 }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from(ref.current, {
            autoAlpha: 0,
            y: 40,
            scale: 0.97,
            duration: 1.1,
            delay,
            ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        });
    });

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
};

export default Reveal;
