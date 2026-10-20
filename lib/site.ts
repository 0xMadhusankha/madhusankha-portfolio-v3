export const site = {
    url: 'https://madhusankha.com',
    name: 'Madhusankha Nayanajith',
    fullName: 'H. Madhusankha Nayanajith',
    handle: '0xMadhusankha',
    role: 'Security Analyst & CTF Developer',
    email: 'hello@madhusankha.com',
    university: 'South Eastern University of Sri Lanka',
    /** The weekday that picks the day's colour theme is counted in this zone. */
    timeZone: 'Asia/Colombo',
    links: {
        linkedin: 'https://www.linkedin.com/in/itzmadhusankha/',
        github: 'https://github.com/0xMadhusankha',
        facebook: 'https://www.facebook.com/itzmadhusankha',
        instagram: 'https://www.instagram.com/itzmadhusankha',
        tryhackme: 'https://tryhackme.com/p/Xgh0sT',
        hackthebox: 'https://profile.hackthebox.com/profile/019d61f4-ae2f-73e2-9ae0-41c7ec2ab265',
    },
} as const;

export const navItems = [
    { id: 'about', label: 'About' },
    { id: 'bug-bounty', label: 'Bug bounty' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certificates', label: 'Certificates' },
] as const;

export const socials = [
    { id: 'linkedin', label: 'LinkedIn', handle: 'itzmadhusankha', href: site.links.linkedin },
    { id: 'github', label: 'GitHub', handle: '0xMadhusankha', href: site.links.github },
    { id: 'tryhackme', label: 'TryHackMe', handle: 'Xgh0sT', href: site.links.tryhackme },
    { id: 'hackthebox', label: 'HackTheBox', handle: 'View profile', href: site.links.hackthebox },
    { id: 'instagram', label: 'Instagram', handle: '@itzmadhusankha', href: site.links.instagram },
    { id: 'facebook', label: 'Facebook', handle: 'itzmadhusankha', href: site.links.facebook },
] as const;
