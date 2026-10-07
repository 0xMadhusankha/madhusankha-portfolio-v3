'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Counter from './Counter';
import Magnetic from './Magnetic';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { heroProgress } from '@/lib/hero-progress';

// three.js is only needed for the globe, so it loads after the text is on screen
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const ROLES = ['SOC Analyst', 'Penetration Tester', 'CTF Developer', 'Bug Bounty Hunter', 'Security Researcher'];

interface HeroProps {
    counts: { certificates: number; projects: number };
}

const Hero = ({ counts }: HeroProps) => {
    const root = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            // Entrance: the name rises letter by letter, then the rest follows
            const title = SplitText.create('[data-hero-title]', { type: 'lines,words,chars', mask: 'lines' });
            gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.15 })
                .from(title.chars, { yPercent: 115, duration: 1.1, stagger: 0.028 })
                .from('[data-intro]', { autoAlpha: 0, y: 26, duration: 0.9, stagger: 0.09 }, '-=0.75');

            // Rotating role line
            const roles = gsap.utils.toArray<HTMLElement>('[data-role]');
            gsap.set(roles.slice(1), { yPercent: 110 });
            const rotation = gsap.timeline({ repeat: -1, defaults: { duration: 0.7, ease: 'power3.inOut' } });
            roles.forEach((role, i) => {
                const next = roles[(i + 1) % roles.length];
                rotation.to(role, { yPercent: -110 }, '+=1.7').fromTo(next, { yPercent: 110 }, { yPercent: 0 }, '<');
            });

            // Scroll story: positions below are fractions of the hero's scroll length
            gsap.timeline({
                defaults: { ease: 'none', duration: 0.1 },
                scrollTrigger: {
                    trigger: root.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    onUpdate: (self) => (heroProgress.value = self.progress),
                },
            })
                .to('[data-stage="0"]', { autoAlpha: 0, y: -50 }, 0.14)
                .fromTo('[data-stage="1"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0 }, 0.3)
                .to('[data-stage="1"]', { autoAlpha: 0, y: -50 }, 0.52)
                .fromTo('[data-stage="2"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0 }, 0.7)
                .to({}, { duration: 0.2 }, 0.8);
        },
        { scope: root },
    );

    return (
        <section id="home" ref={root} className="hero">
            <div className="hero-sticky">
                <HeroScene />

                <div className="hero-stage" data-stage="0">
                    <div className="wrap w-full">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <p className="badge" data-intro>
                                <span className="badge-dot" />
                                Recognised by NASA · Hall of Fame
                            </p>
                            <h1
                                className="headline mt-5 text-[clamp(2.75rem,min(7vw,11.5vh),5.25rem)]"
                                data-hero-title
                                aria-label="Madhusankha Nayanajith"
                            >
                                Madhusankha
                                <br />
                                Nayanajith
                            </h1>
                            <p className="mt-4 text-xl font-medium tracking-tight md:text-2xl" data-intro>
                                <span className="role-rotator">
                                    {ROLES.map((role) => (
                                        <span key={role} className="text-gradient" data-role>
                                            {role}
                                        </span>
                                    ))}
                                </span>
                            </p>
                            <p className="lede mx-auto mt-4 max-w-lg lg:mx-0" data-intro>
                                I build secure infrastructure and break logical flaws, from SOC operations to CTF
                                design and bug bounty.
                            </p>
                            <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start" data-intro>
                                <Magnetic>
                                    <a href="#projects" className="btn btn-primary">
                                        View my work <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                </Magnetic>
                                <Magnetic>
                                    <a href="#contact" className="btn btn-secondary">
                                        Get in touch
                                    </a>
                                </Magnetic>
                            </div>
                            <dl
                                className="mx-auto mt-8 flex w-fit justify-center gap-10 border-t border-line pt-5 lg:mx-0 lg:justify-start"
                                data-intro
                            >
                                <div>
                                    <dd className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        <Counter value={counts.certificates} />
                                    </dd>
                                    <dt className="mt-1 text-sm text-faint">Certifications</dt>
                                </div>
                                <div>
                                    <dd className="text-3xl font-semibold tracking-tight md:text-4xl">
                                        <Counter value={counts.projects} />
                                    </dd>
                                    <dt className="mt-1 text-sm text-faint">Projects</dt>
                                </div>
                                <div>
                                    <dd className="text-gradient text-3xl font-semibold tracking-tight md:text-4xl">
                                        NASA
                                    </dd>
                                    <dt className="mt-1 text-sm text-faint">Letter of Recognition</dt>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <span className="scroll-cue !hidden lg:!flex" data-intro>
                        Scroll
                    </span>
                </div>

                <div className="hero-stage" data-stage="1">
                    <div className="wrap w-full">
                        <div className="mx-auto max-w-xl lg:ml-auto lg:mr-0">
                            <p className="eyebrow">Approach</p>
                            <h2 className="headline mt-5 text-[clamp(2.25rem,5vw,4.25rem)]">
                                Defensive by training.
                                <br />
                                <span className="text-gradient">Offensive by curiosity.</span>
                            </h2>
                            <p className="lede mt-6">
                                SOC operations and threat hunting on one side. CTF design, penetration testing and bug
                                bounty on the other.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="hero-stage !justify-start !text-center lg:!pt-28" data-stage="2">
                    <div className="mx-auto max-w-3xl">
                        <p className="eyebrow">Recognition</p>
                        <h2 className="headline mt-5 text-[clamp(2.5rem,7vw,5.5rem)]">
                            Recognised by <span className="text-shine">NASA.</span>
                        </h2>
                        <p className="lede mx-auto mt-6 max-w-xl">
                            Letter of Recognition and Hall of Fame for responsible vulnerability disclosure.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <a href="#bug-bounty" className="btn btn-primary">
                                Bug bounty journey <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                            <a href="#projects" className="btn btn-secondary">
                                View projects
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
