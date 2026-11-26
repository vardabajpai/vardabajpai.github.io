// Copies new Substack posts into src/content/essays/ as local files, so they are
// hosted on this site permanently (the RSS feed only keeps recent posts).
// Existing files are never overwritten, so edits you make here stick.
// Runs daily in GitHub Actions; run locally with: npm run import:substack
import { readFile, writeFile, access } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const base = (site.substack || '').replace(/\/$/, '');
if (!base) { console.log('No Substack URL set; skipping.'); process.exit(0); }

async function getFeed() {
  if (process.env.FEED_FILE) return readFile(process.env.FEED_FILE, 'utf8');
  // Substack's CDN rejects requests that don't look like a normal browser/feed reader.
  const res = await fetch(`${base}/feed`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PortfolioFeedReader/1.0; +https://vardabajpai.github.io)',
      Accept: 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
    },
  });
  const text = await res.text();
  console.log(`feed: HTTP ${res.status}, ${text.length} bytes`);
  if (!res.ok || !text.includes('<rss')) {
    console.error('Did not get an RSS feed. First 200 chars:', text.slice(0, 200));
    process.exit(1);
  }
  return text;
}
const xml = await getFeed();
let items = new XMLParser().parse(xml)?.rss?.channel?.item ?? [];
if (!Array.isArray(items)) items = [items];
console.log(`feed has ${items.length} item(s)`);

const yaml = (v) => JSON.stringify(String(v ?? ''));
const clean = (html) => String(html ?? '').replace(/<script[\s\S]*?<\/script>/gi, '');

let added = 0;
for (const i of items) {
  const url = String(i.link);
  const slug = url.split('/p/')[1]?.split(/[?#/]/)[0];
  if (!slug) continue;
  const file = `src/content/essays/${slug}.md`;
  try { await access(file); continue; } catch {}
  const date = new Date(i.pubDate).toISOString().slice(0, 10);
  const summary = String(i.description ?? '').replace(/<[^>]+>/g, '').trim();
  const body = clean(i['content:encoded'] ?? i.description);
  await writeFile(file, `---
title: ${yaml(i.title)}
date: ${date}
summary: ${yaml(summary)}
category: writing
source_url: ${yaml(url)}
draft: false
---

${body}
`);
  added++;
  console.log('imported', slug);
}
console.log(`done: ${added} new post(s)`);
