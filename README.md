# Jasmine Bajpai — Portfolio

Static site built with [Astro](https://astro.build), hosted free on GitHub Pages.

## Where to change things

| I want to change…                     | Edit this file                       |
|---------------------------------------|--------------------------------------|
| Colors, fonts, sizes, spacing         | `src/styles/tokens.css`              |
| Name, bio, location, links, headshot  | `src/data/site.ts`                   |
| Section names/order/intro lines       | `src/data/site.ts` (`sections`)      |
| Home page layout                      | `src/pages/index.astro`              |
| Section list pages (all 5)            | `src/pages/[section]/index.astro`    |
| Individual project/essay pages        | `src/pages/[section]/[slug].astro`   |
| Fonts loaded from Google              | `src/layouts/Base.astro`             |

## Adding content

1. Go to the right folder in `src/content/` (`projects`, `essays`, `experience`, `sketchbook`, `misc`).
2. Copy `_template.md`, rename it (e.g. `friday.md` — the filename becomes the URL: `/projects/friday/`).
3. Fill in the top block and write the body in Markdown. Set `draft: true` to hide it.
4. Images go in `public/images/` and are referenced as `/images/whatever.jpg`.

Commit and push — the site rebuilds and redeploys automatically (~1–2 min).

Adding a brand-new section: add it to `sections` in `src/data/site.ts`, add a matching collection in `src/content.config.ts`, and create the folder in `src/content/`.

## Running locally (optional)

Needs [Node.js](https://nodejs.org) 20+.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
```

## First-time deploy (GitHub Pages)

1. Create a GitHub repo named **`YOUR-USERNAME.github.io`** (this exact name means no URL path config is needed).
2. In `astro.config.mjs`, set `site` to `https://YOUR-USERNAME.github.io`.
3. Push this folder to the repo's `main` branch.
4. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. The workflow in `.github/workflows/deploy.yml` builds and publishes on every push.

## Custom domain (when you buy one)

1. Buy the domain (Cloudflare Registrar, Porkbun, or Namecheap are cheap and fine).
2. Add a file `public/CNAME` containing just your domain, e.g. `jasminebajpai.com`.
3. In `astro.config.mjs`, set `site` to `https://jasminebajpai.com`.
4. At your registrar's DNS settings add:
   - Four **A** records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record for `www` → `YOUR-USERNAME.github.io`
5. Repo → Settings → Pages → Custom domain: enter the domain, then tick **Enforce HTTPS** once it's available.
6. Recommended: verify the domain under your GitHub account settings → Pages, to prevent takeovers.

## Easy editing: Pages CMS (no code)

`.pages.yml` sets up a free visual editor at **https://app.pagescms.org**.

1. Push the repo to GitHub first.
2. Go to app.pagescms.org → sign in with GitHub → install the app on this repo → open it.
3. You'll see **Site settings** plus one tab per section. Click **Add an entry**, fill in the fields, drag in images, hit **Save**.
4. Each save is a commit → the site redeploys automatically in ~1–2 min.

Uploaded images and files land in `public/images/`.
