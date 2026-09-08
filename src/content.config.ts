import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    order: z.number(),
    takeaway: z.string(),
    service: z.string(),
    demo: z.string(),
    draft: z.boolean().default(false),
  }),
});
export const collections = { insights };
