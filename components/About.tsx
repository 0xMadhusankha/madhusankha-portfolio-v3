import Image from 'next/image';
import { GraduationCap, MapPin, Shield, Target } from 'lucide-react';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { site } from '@/lib/site';

const facts = [
    { icon: Shield, term: 'Role', detail: site.role },
    { icon: GraduationCap, term: 'Education', detail: `BICT undergraduate, ${site.university}` },
    { icon: Target, term: 'Focus', detail: 'Defensive security, network security, CTF development, bug bounty' },
    { icon: MapPin, term: 'Based in', detail: 'Sri Lanka' },
];

const About = () => (
    <section id="about" className="section">
        <div className="wrap">
            <SectionHeading eyebrow="About" title="The person behind" accent="the handle." />

            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
                <Reveal className="mx-auto w-full max-w-sm lg:max-w-none">
                    <TiltCard tilt={5}>
                        <div data-ghost-tap>
                            <Image
                                src="/profile.png"
                                alt="Madhusankha Nayanajith"
                                width={1024}
                                height={1223}
                                sizes="(min-width: 1024px) 440px, 384px"
                                className="aspect-[4/5] w-full object-cover object-top"
                            />
                            <div className="absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-ink via-ink/70 to-transparent p-6 pt-20">
                                <p className="text-lg font-semibold tracking-tight">{site.name}</p>
                                <p className="mt-1 flex items-center gap-2 text-sm text-dim">
                                    <span className="badge-dot" />
                                    {site.handle} · Xghost
                                </p>
                            </div>
                        </div>
                    </TiltCard>
                </Reveal>

                <div>
                    <Reveal>
                        <p className="text-2xl font-medium leading-snug tracking-tight md:text-[1.75rem]">
                            I&apos;m Madhusankha, a security analyst focused on{' '}
                            <span className="text-gradient">defensive security</span>, networking and CTF
                            development.
                        </p>
                        <p className="lede mt-6">
                            I run a home SOC lab, write security tooling in C, design CTF challenges for other
                            people to break, and hunt for vulnerabilities on public disclosure programmes. I&apos;m
                            currently a BICT undergraduate at {site.university}.
                        </p>
                    </Reveal>

                    <dl className="mt-10 grid gap-4 sm:grid-cols-2">
                        {facts.map(({ icon: Icon, term, detail }, i) => (
                            <Reveal key={term} delay={(i % 2) * 0.08}>
                                <TiltCard className="p-5" tilt={4}>
                                    <div className="flex items-start gap-4">
                                        <span className="icon-tile shrink-0">
                                            <Icon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                        <div>
                                            <dt className="text-sm text-faint">{term}</dt>
                                            <dd className="mt-1 text-[0.9375rem] leading-snug">{detail}</dd>
                                        </div>
                                    </div>
                                </TiltCard>
                            </Reveal>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    </section>
);

export default About;
