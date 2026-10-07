import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';
import Counter from './Counter';
import RailFill from './RailFill';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import type { BountyEntry } from '@/content/bug-bounty';

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

const formatDate = (date?: string | null) => (date ? monthFormat.format(new Date(`${date.slice(0, 7)}-01`)) : null);

// Short names are shown whole on the plaque; longer ones become initials
const mark = (program: string) =>
    program.length <= 5
        ? program
        : program
              .split(/\s+/)
              .map((word) => word[0])
              .join('')
              .slice(0, 4)
              .toUpperCase();

// Slow orbit rings behind the mark on each plaque
const Orbit = () => (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
        {[
            { r: 58, duration: '18s' },
            { r: 84, duration: '30s' },
        ].map(({ r, duration }, i) => (
            <g
                key={r}
                style={{
                    transformOrigin: '100px 100px',
                    animation: `spin-slow ${duration} linear infinite ${i % 2 ? 'reverse' : ''}`,
                }}
            >
                <circle cx="100" cy="100" r={r} stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 6" />
                <circle cx={100 + r} cy="100" r="2.5" fill="currentColor" />
            </g>
        ))}
    </svg>
);

const BugBounty = ({ entries }: { entries: BountyEntry[] }) => (
    <section id="bug-bounty" className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
                <SectionHeading
                    eyebrow="Recognition"
                    title="The bug bounty"
                    accent="journey."
                    sub="Vulnerabilities I have reported through public disclosure programmes, and the recognition that followed."
                    className="mb-10"
                />
                <Reveal className="flex items-end gap-4 border-t border-line pt-6">
                    <p className="headline text-6xl md:text-7xl">
                        <Counter value={entries.length} />
                    </p>
                    <p className="pb-2 text-sm leading-snug text-dim">
                        {entries.length === 1 ? 'recognition' : 'recognitions'} so far,
                        <br />
                        and the hunt continues.
                    </p>
                </Reveal>
            </div>

            <ol className="relative space-y-6 border-l border-line pl-9 md:pl-12">
                <RailFill />

                {entries.map((entry, i) => (
                    <li key={`${entry.program}-${entry.title}`} className="relative">
                        <span className="rail-node -left-9 md:-left-12">{String(i + 1).padStart(2, '0')}</span>
                        <Reveal>
                            <TiltCard tilt={3}>
                                <article className="grid gap-6 p-6 sm:grid-cols-[9.5rem_1fr] md:gap-8 md:p-8">
                                    <div className="plaque-mark max-w-[9.5rem]">
                                        <Orbit />
                                        <span className="text-shine relative text-3xl font-semibold tracking-tight">
                                            {mark(entry.program)}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between gap-4 text-sm text-dim">
                                            <span className="flex items-center gap-2">
                                                <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
                                                {entry.label ?? 'Recognition'}
                                            </span>
                                            {formatDate(entry.date) && (
                                                <time dateTime={entry.date ?? undefined}>{formatDate(entry.date)}</time>
                                            )}
                                        </div>
                                        <h3 className="headline mt-3 text-3xl md:text-4xl">{entry.program}</h3>
                                        <p className="mt-2 text-lg font-medium tracking-tight">{entry.title}</p>
                                        <p className="mt-3 text-[0.9375rem] leading-relaxed text-dim">{entry.summary}</p>
                                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                                            {entry.badges && entry.badges.length > 0 && (
                                                <ul className="flex flex-wrap gap-2">
                                                    {entry.badges.map((badge) => (
                                                        <li key={badge} className="tag tag-accent">
                                                            {badge}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {entry.url && (
                                                <a
                                                    href={entry.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-link text-[0.9375rem]"
                                                >
                                                    View proof <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </TiltCard>
                        </Reveal>
                    </li>
                ))}

                <li className="relative">
                    <span className="rail-node -left-9 border-dashed text-dim md:-left-12">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <Reveal>
                        <div className="rounded-3xl border border-dashed border-accent/25 p-6 md:p-8">
                            <p className="font-medium">Next recognition</p>
                            <p className="mt-1 text-sm text-dim">This space fills as new reports are recognised.</p>
                        </div>
                    </Reveal>
                </li>
            </ol>
        </div>
    </section>
);

export default BugBounty;
