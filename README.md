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
metadata, so browser tabs and JS-capable scrapers get the right preview. For
plain-HTML crawlers (X, Discord, iMessage…), `npm run build` also runs
`scripts/prerender-meta.js`, which bakes one static HTML file per route
(`dist/blogs/` + `dist/blogs/<slug>/`) with the right tags — Vercel serves
those files directly, so every link unfurls with its own card. Keep the slug
and frontmatter parsing in that script in sync with `src/lib/posts.js`.

Post URLs look like `/blogs/<slug>` (the old `/blogs/blog/<slug>` shape
redirects to the new one).
