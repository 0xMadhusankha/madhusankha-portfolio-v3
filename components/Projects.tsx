'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { ScrollTrigger } from '@/lib/gsap';
import { sanityLoader, type Project } from '@/lib/sanity';

const CATEGORY_LABELS: Record<string, string> = {
    builds: 'Builds',
    breaks: 'Breaks',
    defends: 'Defends',
    CTF: 'CTF',
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Turns bare URLs inside a description into links
function linkify(text: string) {
    return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
        i % 2 ? (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                {part}
            </a>
        ) : (
            part
        ),
    );
}

// Pick a project on the left; its details show in the glass panel on the right.
const Projects = ({ projects }: { projects: Project[] }) => {
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState(projects[0]?._id);

    // Only offer filters that have at least one project behind them
    const filters = [
        { id: 'all', label: 'All' },
        ...Object.entries(CATEGORY_LABELS)
            .map(([id, label]) => ({ id, label }))
            .filter((f) => projects.some((p) => p.category === f.id)),
    ];
    const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
    const selected = visible.find((p) => p._id === selectedId) ?? visible[0];

    // The panel changes height with each project, so scroll positions below need recalculating
    useEffect(() => {
        ScrollTrigger.refresh();
    }, [filter, selected?._id]);

    return (
        <section id="projects" className="section">
            <div className="wrap">
                <SectionHeading
                    eyebrow="Projects"
                    title="Built, broken"
                    accent="and defended."
                    sub="Tools I have written, labs I run and challenges I have designed."
                />

                <Reveal className="mb-8">
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
                                        layoutId="project-filter"
                                        className="segment-pill"
                                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                    />
                                )}
                                <span className="relative">{f.label}</span>
                            </button>
                        ))}
                    </div>
                </Reveal>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-8">
                    <Reveal className="min-w-0 lg:sticky lg:top-24 lg:self-start">
                        {/* A swipeable row on small screens, a stacked list on large ones */}
                        <ul className="no-scrollbar -mx-6 flex snap-x scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
                            {visible.map((project, i) => {
                                const active = project._id === selected?._id;
                                return (
                                    <li key={project._id} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
                                        <button
                                            type="button"
                                            className="glass-row group h-full w-full p-5 text-left"
                                            aria-pressed={active}
                                            onClick={() => setSelectedId(project._id)}
                                        >
                                            {active && (
                                                <motion.span
                                                    layoutId="project-active"
                                                    className="glass-row-active"
                                                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                                />
                                            )}
                                            <span className="relative flex items-start gap-4">
                                                <span className="pt-0.5 text-sm tabular-nums text-faint">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-xs font-medium uppercase tracking-[0.12em] text-accent">
                                                        {CATEGORY_LABELS[project.category] ?? project.category}
                                                    </span>
                                                    <span className="mt-1.5 block text-lg font-semibold leading-snug tracking-tight">
                                                        {project.title}
                                                    </span>
                                                    <span className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-dim">
                                                        {project.description}
                                                    </span>
                                                </span>
                                                <ArrowRight
                                                    className={`mt-1 h-4 w-4 shrink-0 transition-all duration-300 ${
                                                        active
                                                            ? 'translate-x-0 text-accent'
                                                            : '-translate-x-1 text-faint group-hover:translate-x-0 group-hover:text-fg'
                                                    }`}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Reveal>

                    <Reveal delay={0.1} className="relative min-w-0">
                        {/* Colour behind the panel, so the glass has something to blur */}
                        <div
                            className="glow-accent pointer-events-none absolute -left-10 -top-10 h-72 w-72"
                            aria-hidden="true"
                        />
                        <div
                            className="glow-secondary pointer-events-none absolute -bottom-12 -right-8 h-80 w-80"
                            aria-hidden="true"
                        />

                        <AnimatePresence mode="wait">
                            {selected && (
                                <motion.article
                                    key={selected._id}
                                    className="glass relative overflow-hidden rounded-3xl"
                                    aria-live="polite"
                                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -14 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                >
                                    <div className="relative m-3 aspect-[16/9] overflow-hidden rounded-2xl bg-raised">
                                        {selected.image && (
                                            <Image
                                                loader={sanityLoader}
                                                src={selected.image}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1024px) 700px, 100vw"
                                                className="object-cover"
                                            />
                                        )}
                                        <span className="tag tag-accent absolute left-3 top-3 !bg-ink/70 backdrop-blur-md">
                                            {CATEGORY_LABELS[selected.category] ?? selected.category}
                                        </span>
                                    </div>

                                    <div className="p-6 pt-4 md:p-9 md:pt-5">
                                        <h3 className="headline text-3xl md:text-4xl">{selected.title}</h3>

                                        <p className="mt-5 whitespace-pre-line break-words text-[0.9375rem] leading-relaxed text-dim md:text-base">
                                            {linkify(selected.description)}
                                        </p>

                                        {selected.technologies.length > 0 && (
                                            <ul className="mt-6 flex flex-wrap gap-2">
                                                {selected.technologies.map((tech) => (
                                                    <li key={tech} className="tag">
                                                        {tech}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {(selected.githubUrl || selected.liveUrl) && (
                                            <div className="mt-8 flex flex-wrap gap-3">
                                                {selected.liveUrl && (
                                                    <a
                                                        href={selected.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-primary"
                                                    >
                                                        Live demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                                    </a>
                                                )}
                                                {selected.githubUrl && (
                                                    <a
                                                        href={selected.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary"
                                                    >
                                                        View code <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            )}
                        </AnimatePresence>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default Projects;
