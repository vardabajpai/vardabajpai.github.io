// ==========================================================
// SITE CONTENT — your name, bio, links, and sections.
// Edit here; every page updates automatically.
// ==========================================================

import data from './site.json';


// Edit site.json (or "Site settings" in Pages CMS) — not this block.
export const site = {
  name: data.name,
  bio: data.bio,
  location: data.location,
  coordinates: data.coordinates,
  headshot: data.headshot || null,
  links: {
    email: `mailto:${data.email}`,
    linkedin: data.linkedin,
    resume: data.resume || '#',
  },
  substack: (data.substack || '').replace(/\/$/, ''), // e.g. https://name.substack.com
  substackName: data.substackName || 'Substack',
  year: new Date().getFullYear(),
};

// Order here = order on the home page and in the nav.
// Intro lines: edit the "★ Page description" entry in each section (src/content/<slug>/page-description.md).
// The intro below is only a fallback if that entry is missing.
// `slug` must match a folder in src/content/ and a collection in src/content.config.ts.
export const sections = [
  { num: '01', slug: 'projects',   title: 'Projects',          intro: "Things I've built, designed, and shipped." },
  { num: '02', slug: 'essays',     title: 'Essays + Research', intro: "Writing on technology, ethics, and policy." },
  { num: '03', slug: 'experience', title: 'Experience',        intro: "Where I've worked and what I've led." },
  { num: '04', slug: 'sketchbook', title: 'Sketchbook',        intro: "Drawings, studies, and unfinished ideas." },
  { num: '05', slug: 'misc',       title: 'Miscellaneous',     intro: "Everything that doesn't fit anywhere else." },
] as const;

export type Section = (typeof sections)[number];
export type SectionSlug = Section['slug'];
