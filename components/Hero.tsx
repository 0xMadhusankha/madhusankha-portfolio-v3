'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Counter from './Counter';
import Magnetic from './Magnetic';
import { gsap, useGSAP } from '@/lib/gsap';
import { heroProgress } from '@/lib/hero-progress';

// three.js is only needed for the globe, so it loads after the text is on screen
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

const ROLES = ['SOC Analyst', 'Penetration Tester', 'CTF Developer', 'Bug Bounty Hunter', 'Security Researcher'];

// The name, one array entry per line; each letter rises on its own
const NAME = ['Madhusankha', 'Nayanajith'];

interface HeroProps {
    counts: { certificates: number; projects: number };
}

const Hero = ({ counts }: HeroProps) => {
    const root = useRef<HTMLElement>(null);
    const [sceneReady, setSceneReady] = useState(false);

    // The globe starts once the browser is idle, so loading three.js and
    // compiling its shaders never competes with the page starting up.
    useEffect(() => {
        const start = () => setSceneReady(true);
        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(start, { timeout: 1500 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(start, 400);
        return () => clearTimeout(id);
    }, []);

    useGSAP(
        () => {
            // The entrance itself is CSS (see .char-rise and .intro in globals.css):
            // it starts with the first paint and keeps running smoothly even
            // while JavaScript is busy.

            // Rotating role line. CSS already parks every role but the first below the line.
            const roles = gsap.utils.toArray<HTMLElement>('[data-role]');
            gsap.set(roles.slice(1), { y: 0, yPercent: 110 });
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
                {sceneReady && <HeroScene />}

                <div className="hero-stage" data-stage="0">
                    <div className="wrap w-full">
                        <div className="mx-auto max-w-2xl lg:mx-0">
                            <p className="badge intro [--i:0]">
                                <span className="badge-dot" />
                                Recognised by NASA · Hall of Fame
                            </p>
                            <h1
                                className="headline mt-5 text-[clamp(2.75rem,min(7vw,11.5vh),5.25rem)]"
                                aria-label={NAME.join(' ')}
                            >
                                {NAME.map((word, line) => (
                                    <span key={word} className="line-mask" aria-hidden="true">
                                        {[...word].map((char, i) => (
                                            <span
                                                key={i}
                                                className="char-rise"
                                                style={{ '--i': line * NAME[0].length + i } as CSSProperties}
                                            >
                                                {char}
                                            </span>
                                        ))}
                                    </span>
                                ))}
                            </h1>
                            <p className="intro mt-4 text-xl font-medium tracking-tight [--i:1] md:text-2xl">
                                <span className="role-rotator">
                                    {ROLES.map((role) => (
                                        <span key={role} className="text-gradient" data-role>
                                            {role}
                                        </span>
                                    ))}
                                </span>
                            </p>
                            <p className="lede intro mx-auto mt-4 max-w-lg [--i:2] lg:mx-0">
                                I build secure infrastructure and break logical flaws, from SOC operations to CTF
                                design and bug bounty.
                            </p>
                            <div className="intro mt-7 flex flex-wrap justify-center gap-3 [--i:3] lg:justify-start">
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
                                className="intro mx-auto mt-8 flex w-fit justify-center gap-10 border-t border-line pt-5 [--i:4] lg:mx-0 lg:justify-start"
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
                    <span className="scroll-cue intro !hidden [--i:5] lg:!flex">
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
