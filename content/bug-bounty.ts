// Bug bounty journey: the fallback list. Entries are normally managed in the
// Sanity Studio ("Bug bounty entry"); this list is shown only while the Studio
// has none.

export interface BountyEntry {
    /** When the report was recognised or resolved, as "YYYY-MM" or "YYYY-MM-DD". */
    date?: string | null;
    /** Organisation or programme, e.g. "NASA". */
    program: string;
    /** What happened, e.g. "Letter of Recognition" or "Stored XSS in account settings". */
    title: string;
    /** One or two sentences. Keep undisclosed details out. */
    summary: string;
    /** Kind of entry, shown above the name. Defaults to "Recognition"; use "Bounty", "CVE", "Finding" and so on. */
    label?: string | null;
    /** Short labels such as "Hall of Fame", "P3" or "Bounty". */
    badges?: string[];
    /** Public proof: hall of fame page, disclosed report or write-up. */
    url?: string | null;
}

export const bountyEntries: BountyEntry[] = [
    {
        program: 'NASA',
        title: 'Letter of Recognition and Hall of Fame',
        summary:
            'Recognised through NASA’s Vulnerability Disclosure Program for a responsibly reported security vulnerability.',
        badges: ['Letter of Recognition', 'Hall of Fame'],
    },
];
