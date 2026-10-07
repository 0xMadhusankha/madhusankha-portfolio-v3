import { defineField, defineType } from 'sanity';

export default defineType({
    name: 'certificate',
    title: 'Certificate',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Certificate Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'issuer',
            title: 'Issuer',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Cisco', value: 'cisco' },
                    { title: 'AWS', value: 'aws' },
                    { title: 'Red Team', value: 'red-team' },
                    { title: 'Blue Team', value: 'blue-team' },
                    { title: 'Other', value: 'other' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'issueDate',
            title: 'Issue Date',
            type: 'date',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'image',
            title: 'Certificate Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'verificationType',
            title: 'Verification Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Credly Badge', value: 'credly' },
                    { title: 'PDF Document', value: 'pdf' },
                    { title: 'External Portal', value: 'portal' },
                ],
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'verificationUrl',
            title: 'Verification URL',
            type: 'url',
            hidden: ({ parent }) => parent?.verificationType === 'pdf',
            validation: (Rule) =>
                Rule.custom((value, context) => {
                    const type = (context.parent as any)?.verificationType;
                    if ((type === 'credly' || type === 'portal') && !value) {
                        return 'Verification URL is required for this type';
                    }
                    return true;
                }),
        }),
        defineField({
            name: 'pdfFile',
            title: 'PDF Certificate',
            type: 'file',
            options: {
                accept: '.pdf',
            },
            hidden: ({ parent }) => parent?.verificationType !== 'pdf',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'issuer',
            media: 'image',
        },
    },
});
