import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// There is exactly one Site Settings document, so it is opened directly
// rather than listed, and cannot be created or deleted from the Studio.
const SINGLETONS = ['siteSettings'];

export default defineConfig({
    name: 'default',
    title: 'Madhusankha Portfolio',

    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yqgqc16k',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

    basePath: '/studio',

    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title('Content')
                    .items([
                        S.listItem()
                            .title('Site settings')
                            .id('siteSettings')
                            .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
                        S.divider(),
                        ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
                    ]),
        }),
        visionTool(),
    ],

    schema: {
        types: schemaTypes,
        templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
    },

    document: {
        actions: (actions, { schemaType }) =>
            SINGLETONS.includes(schemaType)
                ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
                : actions,
    },
});
