// ==========================================================
// SITE CONTENT — your name, bio, links, and sections.
// Edit here; every page updates automatically.
// ==========================================================

import data from './site.json';
import projectsPage from './pages/projects.json';
import essaysPage from './pages/essays.json';
import experiencePage from './pages/experience.json';
import sketchbookPage from './pages/sketchbook.json';
import miscPage from './pages/misc.json';


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
  year: new Date().getFullYear(),
};

// Order here = order on the home page and in the nav.
// Intro lines are edited in src/data/pages/<slug>.json (Pages CMS → "<Section> · page text").
// `slug` must match a folder in src/content/ and a collection in src/content.config.ts.
export const sections = [
  { num: '01', slug: 'projects',   title: 'Projects',          intro: projectsPage.intro },
  { num: '02', slug: 'essays',     title: 'Essays + Research', intro: essaysPage.intro },
  { num: '03', slug: 'experience', title: 'Experience',        intro: experiencePage.intro },
  { num: '04', slug: 'sketchbook', title: 'Sketchbook',        intro: sketchbookPage.intro },
  { num: '05', slug: 'misc',       title: 'Miscellaneous',     intro: miscPage.intro },
] as const;

export type Section = (typeof sections)[number];
export type SectionSlug = Section['slug'];
