'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { ScrollTrigger } from '@/lib/gsap';
import { sanityLoader, type Certificate } from '@/lib/sanity';

const CATEGORY_LABELS: Record<string, string> = {
    cisco: 'Cisco',
    aws: 'AWS',
    'red-team': 'Red Team',
    'blue-team': 'Blue Team',
    other: 'Other',
};

const INITIAL_COUNT = 6;

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

function verification(cert: Certificate) {
    switch (cert.verificationType) {
        case 'credly':
            return { label: 'Verify badge', href: cert.verificationUrl };
        case 'pdf':
            return { label: 'View certificate', href: cert.pdfUrl };
        default:
            return { label: 'Verify', href: cert.verificationUrl };
    }
}

const Certificates = ({ certificates }: { certificates: Certificate[] }) => {
    const [filter, setFilter] = useState('all');
    const [expanded, setExpanded] = useState(false);

    const filters = [
        { id: 'all', label: 'All' },
        ...Object.entries(CATEGORY_LABELS)
            .map(([id, label]) => ({ id, label }))
            .filter((f) => certificates.some((c) => c.category === f.id)),
    ];
    const matching = filter === 'all' ? certificates : certificates.filter((c) => c.category === filter);
    const visible = expanded ? matching : matching.slice(0, INITIAL_COUNT);

    // The list changes height, so everything below needs its scroll positions recalculated
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [filter, expanded]);

    return (
        <section id="certificates" className="section">
            <div className="wrap">
                <SectionHeading
                    eyebrow="Certificates"
                    title={`${certificates.length} certifications,`}
                    accent="all verifiable."
                    sub="Each one links to the issuer's badge, portal or original certificate."
                />

                <Reveal className="mb-10">
                    <div className="segmented">
                        {filters.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                className="segment"
                                aria-pressed={filter === f.id}
                                onClick={() => setFilter(f.id)}
                            >
                                {filter === f.id && (
                                    <motion.span
                                        layoutId="certificate-filter"
                                        className="segment-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                    />
                                )}
                                <span className="relative">{f.label}</span>
                            </button>
                        ))}
                    </div>
                </Reveal>

                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((cert, i) => {
                        const { label, href } = verification(cert);
                        return (
                            <li key={cert._id}>
                                <Reveal delay={(i % 3) * 0.1} className="h-full">
                                    <TiltCard>
                                        <a
                                            href={href ?? undefined}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${label} for ${cert.title}`}
                                            className="group flex h-full flex-col"
                                        >
                                            <div className="relative aspect-[16/10] bg-raised">
                                                {cert.image && (
                                                    <Image
                                                        loader={sanityLoader}
                                                        src={cert.image}
                                                        alt=""
                                                        fill
                                                        sizes="(min-width: 1024px) 370px, (min-width: 640px) 50vw, 100vw"
                                                        className="object-contain p-5 transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex flex-1 flex-col p-6">
                                                <p className="text-sm text-faint">
                                                    {cert.issuer} · {dateFormat.format(new Date(cert.issueDate))}
                                                </p>
                                                <h3 className="mt-2 line-clamp-2 font-semibold leading-snug tracking-tight">
                                                    {cert.title}
                                                </h3>
                                                <span className="mt-auto flex items-center gap-1 pt-5 text-sm font-medium text-dim transition-colors group-hover:text-accent">
                                                    {label}
                                                    <ArrowUpRight
                                                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </div>
                                        </a>
                                    </TiltCard>
                                </Reveal>
                            </li>
                        );
                    })}
                </ul>

                {matching.length > INITIAL_COUNT && (
                    <div className="mt-10">
                        <button type="button" className="btn btn-secondary" onClick={() => setExpanded(!expanded)}>
                            {expanded ? 'Show fewer' : `Show all ${matching.length}`}
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
