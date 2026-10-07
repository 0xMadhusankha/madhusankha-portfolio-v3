import type { ImageLoader } from 'next/image';
import type { BountyEntry } from '@/content/bug-bounty';
import type { ThemeSettings } from '@/lib/themes';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yqgqc16k';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const QUERY_URL = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}`;

export interface Project {
    _id: string;
    title: string;
    description: string;
    category: 'builds' | 'breaks' | 'defends' | 'CTF';
    image: string | null;
    technologies: string[];
    githubUrl: string | null;
    liveUrl: string | null;
    featured: boolean;
}

export interface Certificate {
    _id: string;
    title: string;
    issuer: string;
    category: string;
    issueDate: string;
    image: string | null;
    verificationType: 'credly' | 'pdf' | 'portal';
    verificationUrl: string | null;
    pdfUrl: string | null;
}

export interface Skill {
    _id: string;
    name: string;
    category: string;
    proficiency: number;
}

// Lets next/image ask Sanity's CDN for the exact width it needs
export const sanityLoader: ImageLoader = ({ src, width, quality }) =>
    `${src}?w=${width}&q=${quality || 75}&auto=format&fit=max`;

// In development every request asks Sanity again, so an edit in the Studio
// shows on the next refresh. In production pages are rebuilt at most once a
// minute, so a published change appears within about a minute.
const FETCH_OPTIONS: RequestInit =
    process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : { next: { revalidate: 60 } };

async function query<T>(groq: string): Promise<T> {
    const res = await fetch(`${QUERY_URL}?query=${encodeURIComponent(groq)}`, FETCH_OPTIONS);
    if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`);
    const json = await res.json();
    return json.result as T;
}

export function getProjects() {
    return query<Project[]>(`*[_type == "project"] | order(featured desc, _createdAt desc) {
        _id, title, description, category, "image": image.asset->url,
        "technologies": coalesce(technologies, []), githubUrl, liveUrl, "featured": coalesce(featured, false)
    }`);
}

export function getCertificates() {
    return query<Certificate[]>(`*[_type == "certificate"] | order(issueDate desc) {
        _id, title, issuer, category, issueDate, "image": image.asset->url,
        verificationType, verificationUrl, "pdfUrl": pdfFile.asset->url
    }`);
}

export function getRecognitions() {
    return query<BountyEntry[]>(`*[_type == "recognition"] | order(date desc) {
        program, title, summary, date, url,
        "label": coalesce(label, "Recognition"), "badges": coalesce(badges, [])
    }`);
}

export function getSiteSettings() {
    return query<ThemeSettings | null>(`*[_type == "siteSettings"][0] { themeMode, manualTheme, schedule }`);
}

export function getSkills() {
    return query<Skill[]>(`*[_type == "skill"] | order(proficiency desc) { _id, name, category, proficiency }`);
}
