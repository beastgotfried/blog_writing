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

  const parseValue = (value) => {
    const trimmed = value.trim()

    if (/^true$/i.test(trimmed)) return true
    if (/^false$/i.test(trimmed)) return false

    return trimmed
  }

  for (const line of header.split('\n')) {
    const divider = line.indexOf(':')
    if (divider === -1) continue

    const key = line.slice(0, divider).trim()
    const value = line.slice(divider + 1)
    attributes[key] = parseValue(value)
  }

  if (typeof attributes.tags === 'string') {
    attributes.tags = attributes.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return { attributes, body }
}

const WORDS_PER_MINUTE = 200

// Deliberately simple: total whitespace-separated tokens / WPM. Prose and code
// are counted the same — readers want a ballpark ("4 min read"), not precision.
function estimateReadingTime(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

// First Markdown image in the body, used as the per-post social-share (OG) card.
function firstImage(body) {
  const match = body.match(/!\[[^\]]*\]\(\s*([^)\s]+)/)
  return match ? match[1] : ''
}

export function loadPosts() {
  const files = import.meta.glob('../content/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  })

  // Undated / unparseable dates become -Infinity so they sort to the bottom
  // instead of returning NaN and leaving the comparator order undefined.
  const toTime = (value) => {
    const time = new Date(value).getTime()
    return Number.isNaN(time) ? -Infinity : time
  }

  return Object.entries(files)
    .map(([path, raw]) => {
      const slug = path.split('/').pop().replace('.md', '')
      const { attributes, body } = parseFrontmatter(raw)

      return {
        slug,
        title: attributes.title ?? slug.replace(/-/g, ' '),
        date: attributes.date ?? 'unknown',
        excerpt: attributes.excerpt ?? body.slice(0, 140),
        tags: Array.isArray(attributes.tags) ? attributes.tags : [],
        isNew: attributes.new === true,
        draft: attributes.draft === true,
        repoUrl: attributes.repoUrl ?? '',
        coverImage: firstImage(body),
        readingTime: estimateReadingTime(body),
        content: body,
      }
    })
    // `draft: true` posts are visible while developing (npm run dev) but never
    // shipped to production.
    .filter((post) => import.meta.env.DEV || !post.draft)
    .sort((a, b) => toTime(b.date) - toTime(a.date))
}

// Unique, alphabetised tag list across all posts — powers the homepage filter.
export function getAllTags(posts) {
  const tags = new Set()
  for (const post of posts) {
    for (const tag of post.tags) tags.add(tag)
  }
  return [...tags].sort((a, b) => a.localeCompare(b))
}
