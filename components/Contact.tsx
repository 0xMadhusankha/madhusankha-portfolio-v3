import type { IconType } from 'react-icons';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { SiHackthebox, SiTryhackme } from 'react-icons/si';
import { ArrowUpRight, Mail } from 'lucide-react';
import Magnetic from './Magnetic';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { navItems, site, socials } from '@/lib/site';

// Brand logos come from react-icons; Lucide no longer ships them
const SOCIAL_ICONS: Record<(typeof socials)[number]['id'], IconType> = {
    linkedin: FaLinkedin,
    github: FaGithub,
    tryhackme: SiTryhackme,
    hackthebox: SiHackthebox,
    instagram: FaInstagram,
    facebook: FaFacebook,
};

const Contact = () => (
    <>
        <section id="contact" className="section md:!pb-28">
            <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
                <div>
                    <SectionHeading
                        eyebrow="Contact"
                        title="Let's"
                        accent="talk."
                        sub="Internships, CTF collaborations, security work or a question about one of the projects. Email is the fastest way to reach me."
                        className="mb-8"
                    />
                    <Reveal>
                        <Magnetic>
                            <a href={`mailto:${site.email}`} className="btn btn-primary">
                                <Mail className="h-4 w-4" aria-hidden="true" /> {site.email}
                            </a>
                        </Magnetic>
                    </Reveal>
                </div>

                <div>
                    <Reveal>
                        <p className="mb-4 text-sm text-faint">Find me on</p>
                    </Reveal>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {socials.map(({ id, label, handle, href }, i) => {
                            const Icon = SOCIAL_ICONS[id];
                            return (
                                <li key={id}>
                                    <Reveal delay={(i % 2) * 0.08} className="h-full">
                                        <TiltCard tilt={4} className="!rounded-2xl">
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center gap-4 p-4"
                                            >
                                                <span className="icon-tile">
                                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block font-medium tracking-tight">{label}</span>
                                                    <span className="block truncate text-sm text-dim">{handle}</span>
                                                </span>
                                                <ArrowUpRight
                                                    className="h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        </TiltCard>
                                    </Reveal>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>

        <footer className="border-t border-line bg-ink/60 px-6 py-14 backdrop-blur-md md:px-8">
            <div className="wrap grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
                <div>
                    <p className="font-semibold tracking-tight">{site.name}</p>
                    <p className="mt-2 max-w-xs text-sm leading-relaxed text-faint">
                        {site.role}. BICT undergraduate at {site.university}.
                    </p>
                </div>
                <nav aria-label="Footer">
                    <p className="text-sm text-faint">Site</p>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <a href={`#${item.id}`} className="text-dim transition-colors hover:text-fg">
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div>
                    <p className="text-sm text-faint">Elsewhere</p>
                    <ul className="mt-4 space-y-2.5 text-sm">
                        {socials.map(({ id, label, href }) => (
                            <li key={id}>
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-dim transition-colors hover:text-fg"
                                >
                                    {label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="wrap mt-12 flex flex-col justify-between gap-2 border-t border-line pt-6 text-xs text-faint md:flex-row">
                <p>
                    © {new Date().getFullYear()} {site.fullName}. All rights reserved.
                </p>
                <p title="Some doors open if you type their name: ghost">View Source is not a crime.</p>
            </div>
        </footer>
    </>
);

export default Contact;
