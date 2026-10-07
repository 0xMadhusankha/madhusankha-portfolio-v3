'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import { navItems } from '@/lib/site';

const EASE = [0.22, 1, 0.36, 1] as const;

const Navbar = () => {
    const header = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [active, setActive] = useState('');
    const [open, setOpen] = useState(false);

    useGSAP(
        () => {
            // Reading progress along the bottom edge of the bar
            gsap.to('.nav-progress', {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
            });
        },
        { scope: header },
    );

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        // A section is "active" while it crosses the middle of the viewport
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id);
                }
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        for (const id of ['home', ...navItems.map((item) => item.id), 'contact']) {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        }

        return () => {
            window.removeEventListener('scroll', onScroll);
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <header ref={header} className={`nav ${scrolled || open ? 'is-solid' : ''} ${open ? 'is-open' : ''}`}>
            <div className="wrap flex h-14 items-center justify-between px-6 md:px-8">
                <a
                    href="#home"
                    className="flex items-center gap-2.5 text-[0.9375rem] font-semibold tracking-tight"
                    onClick={() => setOpen(false)}
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-accent" fill="none" aria-hidden="true">
                        <path
                            d="M12 3a7 7 0 0 0-7 7v10.5l2.33-1.9 2.34 1.9L12 18.6l2.33 1.9 2.34-1.9L19 20.5V10a7 7 0 0 0-7-7Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                        />
                        <circle cx="9.5" cy="10.5" r="1.1" fill="currentColor" />
                        <circle cx="14.5" cy="10.5" r="1.1" fill="currentColor" />
                    </svg>
                    Madhusankha
                </a>

                <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="nav-link py-2"
                            aria-current={active === item.id ? 'true' : undefined}
                        >
                            {item.label}
                            {active === item.id && (
                                <motion.span
                                    layoutId="nav-active"
                                    className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-accent via-secondary to-tertiary"
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                />
                            )}
                        </a>
                    ))}
                </nav>

                <a href="#contact" className="btn btn-primary hidden !px-4 !py-1.5 !text-sm md:inline-flex">
                    Contact
                </a>

                <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center md:hidden"
                    aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={open}
                    aria-controls="mobile-nav"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.nav
                        id="mobile-nav"
                        aria-label="Mobile"
                        className="overflow-hidden border-t border-line md:hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                    >
                        <ul className="px-6 pb-6 pt-2">
                            {[...navItems, { id: 'contact', label: 'Contact' }].map((item, i) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, ease: EASE, delay: 0.05 + i * 0.04 }}
                                >
                                    <a
                                        href={`#${item.id}`}
                                        className={`block border-b border-line py-4 text-2xl font-semibold tracking-tight ${
                                            active === item.id ? 'text-fg' : 'text-dim'
                                        }`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>

            <span className="nav-progress" aria-hidden="true" />
        </header>
    );
};

export default Navbar;
