'use client';

import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

interface SectionHeadingProps {
    eyebrow: string;
    title: string;
    /** Trailing part of the title, shown in the accent gradient. */
    accent?: string;
    sub?: string;
    /** Spacing below the heading block. */
    className?: string;
}

const SectionHeading = ({ eyebrow, title, accent, sub, className = 'mb-12 md:mb-16' }: SectionHeadingProps) => {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const trigger = { trigger: root.current, start: 'top 85%', once: true };

            // Each line of the title slides up from behind a mask
            SplitText.create('[data-title]', {
                type: 'lines',
                mask: 'lines',
                autoSplit: true,
                onSplit: (self) =>
                    gsap.from(self.lines, {
                        yPercent: 110,
                        duration: 1.1,
                        stagger: 0.1,
                        ease: 'power4.out',
                        scrollTrigger: trigger,
                    }),
            });
            gsap.from('[data-fade]', {
                autoAlpha: 0,
                y: 20,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: trigger,
            });
        },
        { scope: root },
    );

    return (
        <div ref={root} className={`max-w-3xl ${className}`}>
            <p className="eyebrow" data-fade>
                {eyebrow}
            </p>
            <h2 className="headline mt-4 pb-1 text-[clamp(2.25rem,5.2vw,4rem)]" data-title>
                {title}
                {accent && (
                    <>
                        {' '}
                        <span className="text-gradient">{accent}</span>
                    </>
                )}
            </h2>
            {sub && (
                <p className="lede mt-5" data-fade>
                    {sub}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
