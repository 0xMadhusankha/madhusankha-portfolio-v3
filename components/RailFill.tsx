'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Bright line that grows down a timeline's rail as the list scrolls past
const RailFill = () => {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            ref.current,
            { scaleY: 0 },
            {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: { trigger: ref.current?.parentElement, start: 'top 75%', end: 'bottom 55%', scrub: true },
            },
        );
    });

    return (
        <span
            ref={ref}
            className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-accent/60 to-transparent"
            aria-hidden="true"
        />
    );
};

export default RailFill;
