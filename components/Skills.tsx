import { Cloud, Code, Crosshair, Globe, Layers, Shield, type LucideIcon } from 'lucide-react';
import Marquee from './Marquee';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import type { Skill } from '@/lib/sanity';

const CATEGORIES: Record<string, { label: string; icon: LucideIcon }> = {
    'blue-team': { label: 'Blue team', icon: Shield },
    'red-team': { label: 'Red team', icon: Crosshair },
    programming: { label: 'Programming', icon: Code },
    cloud: { label: 'Cloud and infrastructure', icon: Cloud },
    'web-dev': { label: 'Web development', icon: Globe },
    other: { label: 'Other', icon: Layers },
};

// Skills arrive sorted strongest first, so the order carries the emphasis and
// the self-rated percentages stay out of sight.
const Skills = ({ skills }: { skills: Skill[] }) => {
    const groups = Object.entries(CATEGORIES)
        .map(([id, meta]) => ({ id, ...meta, skills: skills.filter((s) => s.category === id) }))
        .filter((group) => group.skills.length > 0);

    return (
        <section id="skills" className="section">
            <div className="wrap">
                <SectionHeading eyebrow="Skills" title="Where the" accent="time goes." />

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {groups.map(({ id, label, icon: Icon, skills: items }, i) => (
                        <Reveal key={id} delay={(i % 3) * 0.1} className="h-full">
                            <TiltCard className="p-6" tilt={5}>
                                <div className="flex items-center gap-4">
                                    <span className="icon-tile">
                                        <Icon className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <h3 className="text-lg font-semibold tracking-tight">{label}</h3>
                                </div>
                                <ul className="mt-6 flex flex-wrap gap-2">
                                    {items.map((skill) => (
                                        <li key={skill._id} className="tag !text-fg">
                                            {skill.name}
                                        </li>
                                    ))}
                                </ul>
                            </TiltCard>
                        </Reveal>
                    ))}
                </div>
            </div>

            <Marquee
                items={skills.map((skill) => skill.name)}
                reverse
                duration={55}
                className="mt-16 text-3xl font-semibold tracking-tight text-fg/15 md:text-5xl"
            />
        </section>
    );
};

export default Skills;
