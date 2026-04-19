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
    const value = line.slice(divider + 1).trim()
    attributes[key] = value
  }

  if (typeof attributes.tags === 'string') {
    attributes.tags = attributes.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return { attributes, body }
}

export function loadPosts() {
  const files = import.meta.glob('../content/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  })

  const posts = Object.entries(files).map(([path, raw]) => {
    const slug = path.split('/').pop().replace('.md', '')
    const { attributes, body } = parseFrontmatter(raw)

    return {
      slug,
      title: attributes.title ?? slug.replace(/-/g, ' '),
      date: attributes.date ?? 'unknown',
      excerpt: attributes.excerpt ?? body.slice(0, 140),
      tags: Array.isArray(attributes.tags) ? attributes.tags : [],
      repoUrl: attributes.repoUrl ?? '',
      content: body,
    }
  })

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}
