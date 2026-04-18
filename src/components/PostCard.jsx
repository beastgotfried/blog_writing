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

      <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-gray-500">
        <CalendarDays size={12} strokeWidth={1.6} />
        <span>{post.date}</span>
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
