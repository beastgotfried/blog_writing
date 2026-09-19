// Post-build step: bake per-route <title> / Open Graph / Twitter meta tags
// into static HTML files.
//
// Why: the app is client-rendered, so link unfurlers (X, Discord, iMessage…)
// that don't run JS only ever saw the homepage fallback tags in index.html —
// every blog link unfurled as the "Work in Progress" card. This script reads
// src/content/*.md and writes:
//   dist/blogs/index.html          — blog listing card
//   dist/blogs/<slug>/index.html  — one card per post
// Vercel serves those static files for the matching paths (filesystem runs
// before the SPA rewrites); unknown slugs still fall through to the app,
// which redirects back to /blogs.
//
// Slug/frontmatter rules intentionally mirror src/lib/posts.js — keep them in
// sync if that file's parsing ever changes.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = join(root, 'dist')
const contentDir = join(root, 'src', 'content')

const SITE_URL = 'https://ankush.space'
const SITE_TAGLINE = 'Notes, experiments, and lessons as I keep building and learning in public.'
const FALLBACK_IMAGE = `${SITE_URL}/favicon.png`

function parseFrontmatter(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')

  if (!normalized.startsWith('---\n')) {
    return { attributes: {}, body: normalized }
  }

  const end = normalized.indexOf('\n---\n', 4)
  if (end === -1) {
    return { attributes: {}, body: normalized }
  }

  const header = normalized.slice(4, end)
  const body = normalized.slice(end + 5).trim()
  const attributes = {}

  for (const line of header.split('\n')) {
    const divider = line.indexOf(':')
    if (divider === -1) continue

    const key = line.slice(0, divider).trim()
    let value = line.slice(divider + 1).trim()
    if (/^true$/i.test(value)) value = true
    else if (/^false$/i.test(value)) value = false
    attributes[key] = value
  }

  return { attributes, body }
}

function slugify(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function firstImage(body) {
  const match = body.match(/!\[[^\]]*\]\(\s*([^)\s]+)/)
  return match ? match[1] : ''
}

function toAbsolute(url) {
  if (!url) return FALLBACK_IMAGE
  if (url.startsWith('http')) return url
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceMeta(html, attr, name, content) {
  const pattern = new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(" />)`)
  if (!pattern.test(html)) {
    throw new Error(`template is missing <meta ${attr}="${name}"> — update prerender-meta.js`)
  }
  return html.replace(pattern, `$1${content}$2`)
}

function withMeta(template, { title, description, url, image, card, type }) {
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'property', 'og:type', type)
  html = replaceMeta(html, 'property', 'og:title', title)
  html = replaceMeta(html, 'property', 'og:description', description)
  html = replaceMeta(html, 'property', 'og:image', image)
  html = replaceMeta(html, 'property', 'og:url', url)
  html = replaceMeta(html, 'name', 'twitter:card', card)
  html = replaceMeta(html, 'name', 'twitter:title', title)
  html = replaceMeta(html, 'name', 'twitter:description', description)
  html = replaceMeta(html, 'name', 'twitter:image', image)
  html = html.replace(
    /(<meta property="og:url" content="[^"]*" \/>)/,
    `$1\n    <link rel="canonical" href="${url}" />`,
  )
  return html
}

const template = readFileSync(join(distDir, 'index.html'), 'utf8')

const files = readdirSync(contentDir)
  .filter((file) => file.endsWith('.md'))
  .sort()

const usedSlugs = new Set()
const posts = []

for (const file of files) {
  const raw = readFileSync(join(contentDir, file), 'utf8')
  const { attributes, body } = parseFrontmatter(raw)
  if (attributes.draft === true) continue

  const sourceSlug = file.replace(/\.md$/, '')
  const title = attributes.title ?? sourceSlug.replace(/-/g, ' ')
  const rootSlug = slugify(attributes.slug ?? title ?? sourceSlug) || 'post'
  let slug = rootSlug
  let counter = 2
  while (usedSlugs.has(slug)) {
    slug = `${rootSlug}-${counter}`
    counter += 1
  }
  usedSlugs.add(slug)

  const excerpt = attributes.excerpt ?? body.slice(0, 140)
  posts.push({ slug, title, excerpt, coverImage: firstImage(body) })
}

const pages = [
  {
    dir: join(distDir, 'blogs'),
    meta: {
      title: 'Documenting My Journey In Tech',
      description: escapeHtml(SITE_TAGLINE),
      url: `${SITE_URL}/blogs`,
      image: FALLBACK_IMAGE,
      card: 'summary',
      type: 'website',
    },
  },
  ...posts.map((post) => ({
    dir: join(distDir, 'blogs', post.slug),
    meta: {
      title: escapeHtml(post.title),
      description: escapeHtml(post.excerpt),
      url: `${SITE_URL}/blogs/${post.slug}`,
      image: toAbsolute(post.coverImage),
      card: post.coverImage ? 'summary_large_image' : 'summary',
      type: 'article',
    },
  })),
]

for (const page of pages) {
  mkdirSync(page.dir, { recursive: true })
  writeFileSync(join(page.dir, 'index.html'), withMeta(template, page.meta))
  console.log(`prerendered ${page.meta.url}`)
}
