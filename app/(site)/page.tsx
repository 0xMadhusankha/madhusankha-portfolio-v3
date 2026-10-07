import About from "@/components/About";
import BugBounty from "@/components/BugBounty";
import Certificates from "@/components/Certificates";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Navbar from "@/components/Navbar";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import { bountyEntries } from "@/content/bug-bounty";
import { getCertificates, getProjects, getRecognitions, getSkills } from "@/lib/sanity";

export default async function Home() {
    const [projects, certificates, skills, recognitions] = await Promise.all([
        getProjects(),
        getCertificates(),
        getSkills(),
        getRecognitions(),
    ]);
    const issuers = [...new Set(certificates.map((cert) => cert.issuer))];

    return (
        <>
            <Navbar />
            <main>
                <Hero counts={{ certificates: certificates.length, projects: projects.length }} />

                <section className="border-y border-line bg-ink/40 py-8 backdrop-blur-sm" aria-label="Certified by">
                    <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.2em] text-faint">
                        Certified and trained by
                    </p>
                    <Marquee items={issuers} className="text-xl font-semibold tracking-tight text-dim md:text-2xl" />
                </section>

                <About />
                {/* Recognitions come from the Studio; the file is the fallback until some are added there */}
                <BugBounty entries={recognitions.length > 0 ? recognitions : bountyEntries} />
                <Projects projects={projects} />
                <Skills skills={skills} />
                <Certificates certificates={certificates} />
                <Contact />
            </main>
        </>
    );
}
