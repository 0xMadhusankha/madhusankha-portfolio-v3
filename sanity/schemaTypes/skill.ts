import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'skill',
    title: 'Skill',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Skill Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Red Team', value: 'red-team' },
                    { title: 'Blue Team', value: 'blue-team' },
                    { title: 'Web Development', value: 'web-dev' },
                    { title: 'Cloud & Infrastructure', value: 'cloud' },
                    { title: 'Programming', value: 'programming' },
                    { title: 'Other', value: 'other' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'proficiency',
            title: 'Proficiency (%)',
            type: 'number',
            validation: (Rule) => Rule.required().min(0).max(100),
            description: 'Rate your proficiency from 0-100',
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'category',
        },
        prepare({ title, subtitle }) {
            return {
                title,
                subtitle: `${subtitle}`,
            };
        },
    },
});
