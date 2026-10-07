import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Background from "@/components/Background";
import EasterEggs from "@/components/EasterEggs";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteSettings } from "@/lib/sanity";
import { site } from "@/lib/site";
import { resolveTheme } from "@/lib/themes";
import "../globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const viewport: Viewport = {
    themeColor: "#0a0f1e",
};

export const metadata: Metadata = {
    metadataBase: new URL(site.url),
    title: {
        default: "Madhusankha Nayanajith | Security Analyst & CTF Developer",
        template: "%s | Madhusankha Nayanajith",
    },
    description:
        "Portfolio of H. Madhusankha Nayanajith - Security Analyst specializing in Defensive Security, Networking, and CTF Development. BICT Undergraduate at SEUSL.",
    keywords: [
        "Madhusankha Nayanajith",
        "0xMadhusankha",
        "Security Analyst Sri Lanka",
        "Defensive Security",
        "Network Security",
        "CTF Developer",
        "Bug Bounty",
        "SOC Operations",
        "Blue Team",
        "Digital Forensics",
        "Trincomalee",
        "Cyber Security Researcher",
        "Cyber Security Analyst",
        "Cyber Security",
        "Cyber Security Student",
        "Threat Intelligence",
    ],
    authors: [{ name: site.fullName, url: site.url }],
    creator: site.fullName,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: site.url,
        title: "Madhusankha Nayanajith | Security Analyst & CTF Developer",
        description:
            "Defensive Security Specialist & Network Enthusiast. Creator of custom CTF challenges and security tools.",
        siteName: "0xMadhusankha Portfolio",
        images: [{ url: "/profile.png", width: 1024, height: 1223, alt: "Madhusankha Nayanajith - Security Analyst" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Madhusankha Nayanajith | Security Analyst (0xMadhusankha)",
        description:
            "Defensive Security, Networking & CTF Development. Building secure infrastructure and breaking logical flaws.",
        images: ["/profile.png"],
        creator: "@itzmadhusankha",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: [site.handle, "Xghost", "Madhusankha"],
    url: site.url,
    image: `${site.url}/profile.png`,
    jobTitle: site.role,
    worksFor: { "@type": "Organization", name: "Freelance / Open Source" },
    alumniOf: {
        "@type": "CollegeOrUniversity",
        name: site.university,
        sameAs: "https://www.seu.ac.lk/",
    },
    knowsAbout: [
        "Defensive Security",
        "Network Security",
        "CTF Development",
        "Bug Bounty",
        "SOC Operations",
        "Digital Forensics",
        "Security Tooling",
        "Linux Administration",
        "Threat Intelligence",
        "Cyber Security",
    ],
    sameAs: Object.values(site.links),
};

export default async function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // The day's colour theme, or the fixed one chosen in the Studio's Site Settings
    const theme = resolveTheme(await getSiteSettings(), site.timeZone);

    return (
        // The inline script below may change the theme variables before React
        // hydrates, so the style attribute is allowed to differ.
        <html lang="en" className={inter.variable} style={theme.style} suppressHydrationWarning>
            <body className="antialiased">
                {theme.script && <script dangerouslySetInnerHTML={{ __html: theme.script }} />}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <Background />
                <SmoothScroll />
                <EasterEggs />
                {children}
                <Analytics />
            </body>
        </html>
    );
}
