'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

// Counts up to `value` the first time it scrolls into view
const Counter = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const state = { n: 0 };
            gsap.to(state, {
                n: value,
                duration: 1.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: ref.current, start: 'top 95%', once: true },
                onUpdate: () => {
                    if (ref.current) ref.current.textContent = String(Math.round(state.n));
                },
            });
        },
        [value],
    );

    return (
        <span ref={ref} className="tabular-nums">
            {value}
        </span>
    );
};

export default Counter;
