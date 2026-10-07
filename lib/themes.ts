// Colour themes. Every colour on the site derives from a theme's nine values,
// so applying one restyles all of it. The site shows a different theme each
// weekday (WEEK below), unless Site Settings in the Sanity Studio says otherwise.
// This file has no browser or server dependencies, so the Studio can import it.

import type { CSSProperties } from 'react';

export type ThemeKind = 'duo' | 'trio' | 'classic';

export interface Theme {
    id: string;
    name: string;
    /** duo = two contrasting colours, trio = three, classic = one accent with a quiet companion. */
    kind: ThemeKind;
    /** Page background. */
    ink: string;
    /** Card background. */
    surface: string;
    /** Raised elements: image wells, nodes. */
    raised: string;
    /** Main text. */
    fg: string;
    /** Secondary text. */
    dim: string;
    /** Tertiary text and labels. */
    faint: string;
    /** Lead colour: links, highlights, the start of every gradient. */
    accent: string;
    /** Second colour: the other end of gradients, half of the globe. */
    secondary: string;
    /** Third colour: a real third hue in trios, a soft tint of the accent otherwise. */
    tertiary: string;
}

interface Recipe {
    id: string;
    name: string;
    kind: ThemeKind;
    /** Hue (0-360) and saturation (0-100) of the dark background. */
    base: [number, number];
    colors: [string, string] | [string, string, string];
}

function hslToHex(h: number, s: number, l: number) {
    const sat = s / 100;
    const light = l / 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = sat * Math.min(light, 1 - light);
    const channel = (n: number) => {
        const value = light - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return Math.round(value * 255)
            .toString(16)
            .padStart(2, '0');
    };
    return `#${channel(0)}${channel(8)}${channel(4)}`;
}

// Blend two hex colours; used to give two-colour themes a soft third tone
function mixHex(a: string, b: string, amount: number) {
    const part = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
    return `#${[0, 1, 2]
        .map((i) =>
            Math.round(part(a, i) + (part(b, i) - part(a, i)) * amount)
                .toString(16)
                .padStart(2, '0'),
        )
        .join('')}`;
}

function build({ id, name, kind, base: [hue, saturation], colors }: Recipe): Theme {
    return {
        id,
        name,
        kind,
        // The background carries the theme's hue; text is tinted the same way, far more lightly
        ink: hslToHex(hue, saturation, 7.5),
        surface: hslToHex(hue, saturation, 11),
        raised: hslToHex(hue, saturation, 16),
        fg: hslToHex(hue, Math.min(saturation, 30) * 0.5, 94),
        dim: hslToHex(hue, Math.min(saturation, 22) * 0.6, 70),
        faint: hslToHex(hue, Math.min(saturation, 18) * 0.6, 47),
        accent: colors[0],
        secondary: colors[1],
        tertiary: colors[2] ?? mixHex(colors[0], '#ffffff', 0.5),
    };
}

const recipes: Recipe[] = [
    /* ---- Two colours: complementary pairs, a warm against a cool ---- */
    { id: 'teal-coral', name: 'Teal & Coral', kind: 'duo', base: [190, 42], colors: ['#2ec4b6', '#ff6b6b'] },
    { id: 'blue-orange', name: 'Electric Blue & Orange', kind: 'duo', base: [222, 45], colors: ['#4f8cff', '#ff8a3d'] },
    { id: 'navy-gold', name: 'Navy & Gold', kind: 'duo', base: [226, 48], colors: ['#f2c14e', '#5b8cff'] },
    { id: 'emerald-gold', name: 'Emerald & Gold', kind: 'duo', base: [158, 40], colors: ['#34d399', '#fbbf24'] },
    { id: 'purple-gold', name: 'Royal Purple & Gold', kind: 'duo', base: [262, 38], colors: ['#a78bfa', '#fbbf24'] },
    { id: 'indigo-pink', name: 'Indigo & Pink', kind: 'duo', base: [240, 40], colors: ['#818cf8', '#f472b6'] },
    { id: 'cyan-rose', name: 'Cyan & Rose', kind: 'duo', base: [200, 44], colors: ['#22d3ee', '#fb7185'] },
    { id: 'sky-amber', name: 'Sky & Amber', kind: 'duo', base: [210, 42], colors: ['#38bdf8', '#f59e0b'] },
    { id: 'cobalt-coral', name: 'Cobalt & Coral', kind: 'duo', base: [224, 46], colors: ['#3b82f6', '#fb7185'] },
    { id: 'turquoise-sun', name: 'Turquoise & Sunflower', kind: 'duo', base: [180, 40], colors: ['#14b8a6', '#facc15'] },
    { id: 'violet-cyan', name: 'Violet & Cyan', kind: 'duo', base: [256, 40], colors: ['#8b5cf6', '#22d3ee'] },
    { id: 'mustard-blue', name: 'Mustard & Blue', kind: 'duo', base: [218, 40], colors: ['#eab308', '#60a5fa'] },
    { id: 'copper-teal', name: 'Copper & Teal', kind: 'duo', base: [188, 36], colors: ['#e09a6a', '#2dd4bf'] },
    { id: 'peach-teal', name: 'Peach & Teal', kind: 'duo', base: [184, 38], colors: ['#fdba74', '#14b8a6'] },
    { id: 'sage-terracotta', name: 'Sage & Terracotta', kind: 'duo', base: [150, 20], colors: ['#8fbf9f', '#e07a5f'] },
    { id: 'orange-teal', name: 'Orange & Teal', kind: 'duo', base: [196, 40], colors: ['#fb923c', '#2dd4bf'] },
    { id: 'aqua-lemon', name: 'Aqua & Lemon', kind: 'duo', base: [176, 42], colors: ['#2dd4bf', '#fde047'] },
    { id: 'rose-gold', name: 'Rose & Gold', kind: 'duo', base: [340, 30], colors: ['#fb7185', '#fcd34d'] },

    /* ---- Two colours: one hue against a neutral or a neighbour ---- */
    { id: 'blue-mint', name: 'Blue & Mint', kind: 'duo', base: [216, 44], colors: ['#3b82f6', '#5eead4'] },
    { id: 'crimson-silver', name: 'Crimson & Silver', kind: 'duo', base: [0, 14], colors: ['#ef4444', '#cbd5e1'] },
    { id: 'lime-slate', name: 'Lime & Slate', kind: 'duo', base: [215, 22], colors: ['#a3e635', '#94a3b8'] },
    { id: 'burgundy-champagne', name: 'Burgundy & Champagne', kind: 'duo', base: [345, 38], colors: ['#f43f5e', '#f5deb3'] },
    { id: 'forest-cream', name: 'Forest & Cream', kind: 'duo', base: [145, 36], colors: ['#22c55e', '#f5f0e1'] },
    { id: 'ice-violet', name: 'Ice & Violet', kind: 'duo', base: [250, 34], colors: ['#bae6fd', '#a78bfa'] },
    { id: 'magenta-indigo', name: 'Magenta & Indigo', kind: 'duo', base: [270, 40], colors: ['#e879f9', '#818cf8'] },
    { id: 'white-red', name: 'White & Signal Red', kind: 'duo', base: [220, 14], colors: ['#f8fafc', '#ef4444'] },
    { id: 'gold-ivory', name: 'Gold Leaf & Ivory', kind: 'duo', base: [40, 22], colors: ['#f2c14e', '#f8f4e6'] },
    { id: 'jade-ruby', name: 'Jade & Ruby', kind: 'duo', base: [160, 38], colors: ['#10b981', '#f43f5e'] },

    /* ---- Three colours: analogous runs, neighbours on the colour wheel ---- */
    { id: 'aurora', name: 'Aurora', kind: 'trio', base: [200, 44], colors: ['#34d399', '#22d3ee', '#a78bfa'] },
    { id: 'ocean-depth', name: 'Ocean Depth', kind: 'trio', base: [214, 48], colors: ['#3b82f6', '#06b6d4', '#2dd4bf'] },
    { id: 'twilight', name: 'Twilight', kind: 'trio', base: [258, 42], colors: ['#6366f1', '#a855f7', '#ec4899'] },
    { id: 'sunset', name: 'Sunset', kind: 'trio', base: [268, 36], colors: ['#f97316', '#ec4899', '#8b5cf6'] },
    { id: 'solar', name: 'Solar', kind: 'trio', base: [24, 34], colors: ['#fbbf24', '#fb923c', '#f43f5e'] },
    { id: 'volcano', name: 'Volcano', kind: 'trio', base: [10, 30], colors: ['#ef4444', '#f97316', '#fbbf24'] },
    { id: 'forest-trail', name: 'Forest Trail', kind: 'trio', base: [140, 36], colors: ['#22c55e', '#a3e635', '#facc15'] },
    { id: 'glacier', name: 'Glacier', kind: 'trio', base: [212, 40], colors: ['#e0f2fe', '#7dd3fc', '#818cf8'] },
    { id: 'nebula', name: 'Nebula', kind: 'trio', base: [250, 44], colors: ['#818cf8', '#e879f9', '#22d3ee'] },
    { id: 'orchid', name: 'Orchid', kind: 'trio', base: [280, 36], colors: ['#c084fc', '#f0abfc', '#5eead4'] },
    { id: 'deep-sea', name: 'Deep Sea', kind: 'trio', base: [220, 50], colors: ['#0ea5e9', '#6366f1', '#14b8a6'] },
    { id: 'lagoon', name: 'Lagoon', kind: 'trio', base: [186, 44], colors: ['#2dd4bf', '#38bdf8', '#fde047'] },
    { id: 'nordic', name: 'Nordic', kind: 'trio', base: [220, 22], colors: ['#88c0d0', '#81a1c1', '#a3be8c'] },
    { id: 'pastel-tech', name: 'Pastel Tech', kind: 'trio', base: [232, 32], colors: ['#93c5fd', '#c4b5fd', '#f9a8d4'] },

    /* ---- Three colours: triads and split complements, bolder contrast ---- */
    { id: 'tropical', name: 'Tropical', kind: 'trio', base: [186, 42], colors: ['#14b8a6', '#facc15', '#fb7185'] },
    { id: 'royal', name: 'Royal', kind: 'trio', base: [252, 42], colors: ['#8b5cf6', '#f2c14e', '#3b82f6'] },
    { id: 'signal', name: 'Signal', kind: 'trio', base: [210, 36], colors: ['#22c55e', '#38bdf8', '#eab308'] },
    { id: 'fire-ice', name: 'Fire & Ice', kind: 'trio', base: [214, 42], colors: ['#38bdf8', '#f8fafc', '#fb923c'] },
    { id: 'carbon', name: 'Carbon Fibre', kind: 'trio', base: [216, 16], colors: ['#38bdf8', '#f97316', '#94a3b8'] },
    { id: 'monaco', name: 'Monaco', kind: 'trio', base: [222, 44], colors: ['#3b82f6', '#ef4444', '#f8fafc'] },
    { id: 'peacock', name: 'Peacock', kind: 'trio', base: [196, 46], colors: ['#0ea5e9', '#10b981', '#8b5cf6'] },
    { id: 'sapphire-blush', name: 'Sapphire Blush', kind: 'trio', base: [222, 44], colors: ['#3b82f6', '#f472b6', '#fcd34d'] },
    { id: 'autumn', name: 'Autumn', kind: 'trio', base: [28, 30], colors: ['#f59e0b', '#ef4444', '#a3e635'] },
    { id: 'night-bloom', name: 'Night Bloom', kind: 'trio', base: [232, 30], colors: ['#bd93f9', '#ff79c6', '#8be9fd'] },
    { id: 'midnight-neon', name: 'Midnight Neon', kind: 'trio', base: [230, 44], colors: ['#22d3ee', '#a3e635', '#f472b6'] },
    { id: 'rose-garden', name: 'Rose Garden', kind: 'trio', base: [336, 28], colors: ['#fb7185', '#f9a8d4', '#86efac'] },
    { id: 'mint-mocha', name: 'Mint Mocha', kind: 'trio', base: [28, 24], colors: ['#6ee7b7', '#d6b38c', '#f5f0e1'] },
    { id: 'espresso', name: 'Espresso Trio', kind: 'trio', base: [26, 28], colors: ['#d6a56c', '#f5e6c8', '#8fbf9f'] },
    { id: 'ink-gold', name: 'Ink & Gold Leaf', kind: 'trio', base: [226, 30], colors: ['#f2c14e', '#f8fafc', '#9ca3af'] },
    { id: 'steel-ember', name: 'Steel & Ember', kind: 'trio', base: [214, 20], colors: ['#cbd5e1', '#f97316', '#38bdf8'] },

    /* ---- Classic: one accent with a quiet companion ---- */
    { id: 'midnight', name: 'Midnight Blue', kind: 'classic', base: [225, 48], colors: ['#7aa2f7', '#5eb5b0'] },
    { id: 'graphite', name: 'Graphite Platinum', kind: 'classic', base: [240, 4], colors: ['#d8d3c8', '#8b8d93'] },
    { id: 'charcoal-gold', name: 'Charcoal & Gold', kind: 'classic', base: [40, 12], colors: ['#d4af6a', '#a08f6c'] },
    { id: 'emerald', name: 'Emerald Slate', kind: 'classic', base: [165, 30], colors: ['#56c596', '#8fb8a8'] },
    { id: 'copper', name: 'Copper', kind: 'classic', base: [24, 26], colors: ['#d08c60', '#b3a37a'] },
    { id: 'burgundy', name: 'Burgundy', kind: 'classic', base: [345, 28], colors: ['#c9707f', '#c7a26b'] },
    { id: 'plum', name: 'Plum', kind: 'classic', base: [270, 30], colors: ['#a78bda', '#7fa5d8'] },
    { id: 'slate', name: 'Slate', kind: 'classic', base: [214, 20], colors: ['#8fa6c4', '#a8b3bf'] },
];

export const themes: Theme[] = recipes.map(build);

export const themeOptions = themes.map(({ id, name }) => ({ title: name, value: id }));

export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
export type Day = (typeof DAYS)[number];

/** The theme shown on each weekday unless the Studio overrides it. */
export const WEEK: Record<Day, string> = {
    monday: 'deep-sea',
    tuesday: 'rose-garden',
    wednesday: 'ocean-depth',
    thursday: 'violet-cyan',
    friday: 'twilight',
    saturday: 'navy-gold',
    sunday: 'sapphire-blush',
};

const COLOR_KEYS = ['ink', 'surface', 'raised', 'fg', 'dim', 'faint', 'accent', 'secondary', 'tertiary'] as const;

const themeById = (id: string | null | undefined) => themes.find((theme) => theme.id === id);

/** What the Studio's Site Settings document holds. Every field may be missing. */
export interface ThemeSettings {
    themeMode?: 'auto' | 'manual' | null;
    manualTheme?: string | null;
    schedule?: Partial<Record<Day, string | null>> | null;
}

/** Index into DAYS for today's weekday in the given time zone. */
// The option is written as `timeZone: zone`, not shorthand: Next's production
// minifier inlines this function and leaves a shorthand `timeZone` pointing at
// a variable it has renamed, which crashes the build.
function todayIndex(zone: string) {
    const short = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: zone }).format(new Date());
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(short);
}

/** The theme's colours as CSS variables, for the style attribute of <html>. */
const cssVariables = (theme: Theme) =>
    Object.fromEntries(COLOR_KEYS.map((key) => [`--color-${key}`, theme[key]])) as CSSProperties;

/**
 * Works out which theme to show from the Studio settings.
 * - `style` colours the server-rendered page.
 * - `script` (automatic mode only) re-checks the weekday in the browser before
 *   first paint, so a cached page never shows yesterday's theme.
 */
export function resolveTheme(settings: ThemeSettings | null, timeZone: string) {
    const week = DAYS.map((day) => themeById(settings?.schedule?.[day]) ?? themeById(WEEK[day]) ?? themes[0]);
    const manual = settings?.themeMode === 'manual' ? themeById(settings.manualTheme) : undefined;
    if (manual) return { style: cssVariables(manual), script: null };

    const script = `(function(){try{var week=${JSON.stringify(
        week.map((theme) => COLOR_KEYS.map((key) => theme[key])),
    )},keys=${JSON.stringify(COLOR_KEYS)},day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'${timeZone}'}).format(new Date()));if(day>-1)keys.forEach(function(key,i){document.documentElement.style.setProperty('--color-'+key,week[day][i])})}catch(e){}})()`;
    return { style: cssVariables(week[todayIndex(timeZone)] ?? week[0]), script };
}
