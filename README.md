this is where i write my blogs revolving anything around tech

-fueled by coffee and credits

## writing posts

Drop a Markdown file in `src/content/`. Supported frontmatter keys:

- `title`, `date` (YYYY-MM-DD), `excerpt`, `tags` (comma-separated)
- `repoUrl` — shows a GitHub link on the card and post
- `new: true` — adds a NEW badge
- `draft: true` — visible with `npm run dev`, hidden from the production build

Reading time ("4 min read") and the social-share image (the first image in the
post) are derived automatically.

## social previews / SEO

Per-post `<title>` and Open Graph tags are set at runtime via React 19 document
metadata, so browser tabs and JS-capable scrapers get the right preview. Plain
HTML crawlers that don't run JS fall back to the site-level defaults in
`index.html`. For true per-post cards on *every* crawler, add a prerender step
(e.g. `vite-plugin-prerender` or a small SSG pass) — a future improvement.
