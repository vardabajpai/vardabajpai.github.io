import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One schema shared by every section. Add fields here as the site grows.
// Blank fields from the CMS ('' or null) are treated as "not set".
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const optText = z.preprocess(blank, z.string().optional());

const entry = z.object({
  title: z.string(),
  date: z.coerce.date(),
  summary: optText,
  tags: z.preprocess(blank, z.array(z.string()).default([])),
  image: optText, // e.g. '/images/friday-cover.jpg'
  link: optText,  // external link (GitHub, publication, video)
  role: optText,  // useful for Experience entries
  draft: z.preprocess(blank, z.boolean().default(false)), // true = hidden
});

// Files starting with "_" (like _template.md) are ignored.
const make = (folder: string) =>
  defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: `./src/content/${folder}` }),
    schema: entry,
  });

export const collections = {
  projects: make('projects'),
  essays: make('essays'),
  experience: make('experience'),
  sketchbook: make('sketchbook'),
  misc: make('misc'),
};
