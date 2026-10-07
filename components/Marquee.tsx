'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

interface MarqueeProps {
    items: string[];
    reverse?: boolean;
    /** Seconds for one full loop at rest. */
    duration?: number;
    className?: string;
}

const Marquee = ({ items, reverse = false, duration = 45, className = '' }: MarqueeProps) => {
    const track = useRef<HTMLDivElement>(null);

    // Short lists are repeated so one group is always wider than the screen
    const group = Array.from({ length: Math.ceil(14 / Math.max(items.length, 1)) }, () => items).flat();

    useGSAP(() => {
        const loop = gsap.fromTo(
            track.current,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 },
        );

        // Scrolling the page pushes the marquee along faster, then it settles
        ScrollTrigger.create({
            onUpdate: (self) => {
                const boost = 1 + Math.min(5, Math.abs(self.getVelocity()) / 300);
                gsap.to(loop, {
                    timeScale: boost,
                    duration: 0.2,
                    overwrite: true,
                    onComplete: () => {
                        gsap.to(loop, { timeScale: 1, duration: 1, overwrite: true });
                    },
                });
            },
        });
    });

    return (
        <div className={`marquee ${className}`}>
            <div ref={track} className="marquee-track">
                {[0, 1].map((copy) => (
                    <ul key={copy} className="marquee-group" aria-hidden={copy === 1}>
                        {group.map((item, i) => (
                            <li key={i} className="flex items-center gap-11 whitespace-nowrap">
                                {item}
                                <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
