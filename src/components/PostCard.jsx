import { CalendarDays, Hash } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="gradient-border relative block w-full overflow-hidden rounded-[10px] border border-white/10 bg-black/35 p-4 text-left transition hover:border-white/25 hover:bg-white/5"
    >
      <p className="mb-2 text-sm text-zinc-100">{post.title}</p>
      <p className="mb-3 text-xs leading-6 text-gray-400">{post.excerpt}</p>

      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-gray-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={12} strokeWidth={1.6} />
          <span>{post.date}</span>
        </div>

        {post.repoUrl ? (
          <a
            href={post.repoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open reference repository"
            title="Open reference repository"
            className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/15 bg-white/5 text-white/75 transition hover:border-white/35 hover:bg-white/10 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-[13px] w-[13px]"
              fill="currentColor"
            >
              <path d="M12 2C6.477 2 2 6.615 2 12.308c0 4.555 2.865 8.417 6.839 9.773.5.097.682-.224.682-.5 0-.246-.01-1.004-.015-1.82-2.782.624-3.369-1.216-3.369-1.216-.455-1.194-1.11-1.512-1.11-1.512-.908-.64.069-.627.069-.627 1.004.073 1.532 1.052 1.532 1.052.893 1.573 2.342 1.118 2.91.855.091-.662.35-1.118.636-1.375-2.22-.261-4.556-1.145-4.556-5.095 0-1.126.38-2.046 1.003-2.766-.101-.262-.435-1.315.098-2.74 0 0 .817-.268 2.675 1.056A9.14 9.14 0 0 1 12 6.934c.83.004 1.665.114 2.446.335 1.857-1.324 2.673-1.056 2.673-1.056.535 1.425.2 2.478.1 2.74.624.72 1.003 1.64 1.003 2.766 0 3.96-2.34 4.83-4.566 5.086.36.32.68.955.68 1.926 0 1.392-.013 2.514-.013 2.856 0 .278.18.601.688.499C19.14 20.72 22 16.86 22 12.308 22 6.615 17.523 2 12 2Z" />
            </svg>
          </a>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-400"
          >
            <Hash size={10} strokeWidth={1.7} />
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
