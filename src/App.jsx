import { ArrowLeft, Bird, BookOpenText, FolderGit2, Link as LinkIcon, MoonStar } from 'lucide-react'
import { useMemo } from 'react'
import { marked } from 'marked'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { loadPosts } from './lib/posts'
import { PostCard } from './components/PostCard'
import { Starfield } from './components/Starfield'

function App() {
  const posts = useMemo(() => loadPosts(), [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 py-4 text-gray-200 md:px-8 md:py-6">
      <Starfield />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Routes>
          <Route path="/" element={<HomePage posts={posts} />} />
          <Route path="/blog/:slug" element={<BlogPostPage posts={posts} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <footer className="mt-3 rounded-[10px] border border-white/10 bg-black/30 px-4 py-2 text-xs text-gray-500 md:px-5">
          Built with coffee, credits and memories about someone
        </footer>
      </div>
    </div>
  )
}

function HomePage({ posts }) {
  const recentPosts = posts.slice(0, 5)

  return (
    <main className="grid gap-4 md:h-[calc(100vh-7.2rem)] md:grid-cols-[1.08fr_0.92fr] md:gap-5">
      <section className="rounded-[10px] border border-white/25 bg-linear-to-br from-zinc-900/90 via-zinc-900/80 to-black p-5 backdrop-blur-sm md:flex md:flex-col md:p-7">
        <header className="mb-5 border-b border-white/20 pb-4">
          <div className="mb-3 flex items-center gap-2 text-white/80">
            <MoonStar size={16} strokeWidth={1.5} />
            <span className="text-xs tracking-[0.2em]">BEASTED</span>
          </div>
          <h1 className="m-0 text-3xl font-medium text-zinc-100 md:text-5xl">
            Documenting My Journey In Tech
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Notes, experiments, and lessons as I keep building and learning in public.
          </p>
        </header>

        <div className="rounded-[10px] border border-white/15 bg-black/35 p-4 md:p-5">
          <h2 className="mb-3 mt-0 text-xs uppercase tracking-[0.16em] text-white/70">About Me</h2>
          <p className="text-sm leading-7 text-zinc-300">
            Hey, my name is Ankush and I am a 1st Year B.Tech Student. I am writing here because i dont have anyone to write to anymore and its fun to document things as you learn them <br /><br />
          </p>
          <p className="mt-3 text-xs leading-7 text-zinc-400">
            You can always reach out with suggestions, corrections, or ideas for future posts.
          </p>
        </div>

        <div className="mt-4 rounded-[10px] border border-white/15 bg-black/30 p-4 md:mt-auto md:p-5">
          <h3 className="mb-3 mt-0 text-xs uppercase tracking-[0.16em] text-white/70">Connect</h3>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/ankush-wadehra-bb64b0258/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/25 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/90 transition hover:border-white/50"
            >
              <LinkIcon size={14} strokeWidth={1.7} />
              LinkedIn
            </a>
            <a
              href="https://github.com/beastgotfried"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/25 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/90 transition hover:border-white/50"
            >
              <FolderGit2 size={14} strokeWidth={1.7} />
              GitHub
            </a>
            <a
              href="https://x.com/wank_ush"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-[10px] border border-white/25 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-white/90 transition hover:border-white/50"
            >
              <Bird size={14} strokeWidth={1.7} />
              Twitter
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-white/25 bg-linear-to-br from-zinc-900/85 via-zinc-900/80 to-black backdrop-blur-sm md:flex md:min-h-0 md:flex-col">
        <div className="border-b border-white/20 px-5 pt-4 md:px-7">
          <div className="flex items-end justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-t-[10px] border border-white/30 border-b-black bg-black px-3 py-2 text-xs uppercase tracking-[0.16em] text-white">
              <BookOpenText size={14} strokeWidth={1.5} />
              Recent Blog Posts
            </span>
            <span className="pb-2 text-[11px] uppercase tracking-[0.14em] text-white/70">
              {posts.length} total
            </span>
          </div>
        </div>

        <div className="p-5 md:min-h-0 md:flex-1 md:overflow-y-auto md:p-7">
          <div className="mb-4 text-xs uppercase tracking-[0.16em] text-white/70">
            latest entries
          </div>

          <div className="grid gap-3">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function BlogPostPage({ posts }) {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <div className="fixed left-6 top-5 z-50 md:left-10 md:top-7">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-[10px] border border-white/20 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.14em] text-gray-300 backdrop-blur-sm transition hover:border-white/40 hover:text-zinc-100"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          
        </Link>
      </div>

      {post.repoUrl ? (
        <a
          href={post.repoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open reference repository"
          title="Open reference repository"
          className="fixed right-6 top-5 z-50 inline-flex items-center gap-2 rounded-[10px] border border-white/20 bg-black/70 px-3 py-2 text-xs uppercase tracking-[0.14em] text-gray-300 backdrop-blur-sm transition hover:border-white/40 hover:text-zinc-100 md:right-10 md:top-7"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-[13px] w-[13px]"
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.615 2 12.308c0 4.555 2.865 8.417 6.839 9.773.5.097.682-.224.682-.5 0-.246-.01-1.004-.015-1.82-2.782.624-3.369-1.216-3.369-1.216-.455-1.194-1.11-1.512-1.11-1.512-.908-.64.069-.627.069-.627 1.004.073 1.532 1.052 1.532 1.052.893 1.573 2.342 1.118 2.91.855.091-.662.35-1.118.636-1.375-2.22-.261-4.556-1.145-4.556-5.095 0-1.126.38-2.046 1.003-2.766-.101-.262-.435-1.315.098-2.74 0 0 .817-.268 2.675 1.056A9.14 9.14 0 0 1 12 6.934c.83.004 1.665.114 2.446.335 1.857-1.324 2.673-1.056 2.673-1.056.535 1.425.2 2.478.1 2.74.624.72 1.003 1.64 1.003 2.766 0 3.96-2.34 4.83-4.566 5.086.36.32.68.955.68 1.926 0 1.392-.013 2.514-.013 2.856 0 .278.18.601.688.499C19.14 20.72 22 16.86 22 12.308 22 6.615 17.523 2 12 2Z" />
          </svg>
          Repository
        </a>
      ) : null}

      <main className="rounded-[10px] border border-white/10 bg-black/45 p-5 pt-14 backdrop-blur-sm md:p-7 md:pt-16">

      <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-gray-500">
        <BookOpenText size={14} strokeWidth={1.5} />
        <span>{post.date}</span>
      </div>

      <h2 className="mb-4 mt-0 text-2xl font-medium text-zinc-100 md:text-3xl">
        {post.title}
      </h2>
      <div
        className="prose-note text-sm md:text-base"
        dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}
      />
      </main>
    </>
  )
}

export default App
