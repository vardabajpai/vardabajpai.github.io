// Copies new Substack posts into src/content/essays/ as local files, so they are
// hosted on this site permanently (the RSS feed only keeps recent posts).
// Existing files are never overwritten, so edits you make here stick.
// Runs daily in GitHub Actions; run locally with: npm run import:substack
import { readFile, writeFile, access } from 'node:fs/promises';
import { XMLParser } from 'fast-xml-parser';

const site = JSON.parse(await readFile('src/data/site.json', 'utf8'));
const base = (site.substack || '').replace(/\/$/, '');
if (!base) { console.log('No Substack URL set; skipping.'); process.exit(0); }

const UA = 'Mozilla/5.0 (compatible; PortfolioFeedReader/1.0; +https://vardabajpai.github.io)';

// Returns a list of { title, link, pubDate, description, content }.
async function getItems() {
  if (process.env.FEED_FILE) return parseRss(await readFile(process.env.FEED_FILE, 'utf8'));

  // 1) Direct from Substack.
  try {
    const res = await fetch(`${base}/feed`, { headers: { 'User-Agent': UA, Accept: 'application/rss+xml, */*' } });
    const text = await res.text();
    console.log(`direct feed: HTTP ${res.status}, ${text.length} bytes`);
    if (res.ok && text.includes('<rss')) return parseRss(text);
  } catch (e) { console.log('direct feed failed:', e.message); }

  // 2) Substack often blocks cloud servers (like GitHub's), so fall back to a
  //    public feed-reading service that fetches it for us.
  const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(base + '/feed')}`, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  console.log(`rss2json: HTTP ${res.status}, status=${data.status}, ${data.items?.length ?? 0} item(s)`);
  if (data.status !== 'ok') { console.error('Could not read the feed:', data.message ?? ''); process.exit(1); }
  return data.items.map((i) => ({ title: i.title, link: i.link, pubDate: i.pubDate.replace(' ', 'T') + 'Z', description: i.description, content: i.content }));
}

function parseRss(xml) {
  let items = new XMLParser().parse(xml)?.rss?.channel?.item ?? [];
  if (!Array.isArray(items)) items = [items];
  return items.map((i) => ({ title: i.title, link: i.link, pubDate: i.pubDate, description: i.description, content: i['content:encoded'] }));
}

const items = await getItems();
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
  const body = clean(i.content || i.description);
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
