import { defineField, defineType } from 'sanity';

// An entry in the bug bounty journey: a recognition, bounty, CVE or finding
export default defineType({
    name: 'recognition',
    title: 'Bug bounty entry',
    type: 'document',
    fields: [
        defineField({
            name: 'program',
            title: 'Organisation or programme',
            type: 'string',
            description: 'For example "NASA". Names longer than five letters show as initials on the plaque.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'title',
            title: 'What happened',
            type: 'string',
            description: 'For example "Letter of Recognition and Hall of Fame".',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'text',
            rows: 3,
            description: 'One or two sentences. Keep undisclosed details out.',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'label',
            title: 'Kind',
            type: 'string',
            options: { list: ['Recognition', 'Bounty', 'CVE', 'Finding'] },
            initialValue: 'Recognition',
        }),
        defineField({
            name: 'badges',
            title: 'Badges',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
            description: 'Short labels such as "Hall of Fame" or "P3".',
        }),
        defineField({
            name: 'date',
            title: 'Date',
            type: 'date',
            description: 'When it was recognised or resolved. Only the month and year are shown.',
        }),
        defineField({
            name: 'url',
            title: 'Proof link',
            type: 'url',
            description: 'Hall of fame page, disclosed report or write-up.',
        }),
    ],
    orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
    preview: {
        select: { title: 'program', subtitle: 'title' },
    },
});
