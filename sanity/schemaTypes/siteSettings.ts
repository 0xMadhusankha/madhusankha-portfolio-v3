import { defineField, defineType } from 'sanity';
import { DAYS, themeOptions, WEEK } from '../../lib/themes';

// The themes in the default weekly rotation come first in every dropdown
const weekly = Object.values(WEEK);
const options = [
    ...themeOptions.filter((option) => weekly.includes(option.value)),
    ...themeOptions.filter((option) => !weekly.includes(option.value)),
];

const capitalise = (word: string) => word[0].toUpperCase() + word.slice(1);

export default defineType({
    name: 'siteSettings',
    title: 'Site settings',
    type: 'document',
    fields: [
        defineField({
            name: 'themeMode',
            title: 'Colour theme',
            type: 'string',
            description: 'Changes can take about a minute to appear on the site.',
            options: {
                layout: 'radio',
                list: [
                    { title: 'Automatic: a different theme each day of the week', value: 'auto' },
                    { title: 'Manual: one fixed theme', value: 'manual' },
                ],
            },
            initialValue: 'auto',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'manualTheme',
            title: 'Fixed theme',
            type: 'string',
            description: 'Shown every day while the mode above is Manual.',
            options: { list: options },
            hidden: ({ parent }) => parent?.themeMode !== 'manual',
            validation: (Rule) =>
                Rule.custom((value, context) =>
                    (context.parent as { themeMode?: string })?.themeMode === 'manual' && !value
                        ? 'Choose a theme, or switch the mode back to Automatic'
                        : true,
                ),
        }),
        defineField({
            name: 'schedule',
            title: 'Weekly schedule',
            type: 'object',
            description: 'Which theme each weekday shows in Automatic mode. Days are counted in Sri Lanka time.',
            hidden: ({ parent }) => parent?.themeMode === 'manual',
            options: { columns: 2 },
            // Week starts on Monday in the form
            fields: [...DAYS.slice(1), DAYS[0]].map((day) =>
                defineField({
                    name: day,
                    title: capitalise(day),
                    type: 'string',
                    options: { list: options },
                    initialValue: WEEK[day],
                }),
            ),
        }),
    ],
    preview: {
        prepare: () => ({ title: 'Site settings' }),
    },
});
