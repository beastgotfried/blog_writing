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
      <section className="rounded-[10px] border border-white/25 bg-gradient-to-br from-zinc-900/90 via-zinc-900/80 to-black p-5 backdrop-blur-sm md:flex md:flex-col md:p-7">
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
            Hey, my name is Ankush. I am an absolute geek who is ready to learn everything.
            I write about what I learn in tech for anyone who wants to build along. <br /><br />
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

      <section className="rounded-[10px] border border-white/25 bg-gradient-to-br from-zinc-900/85 via-zinc-900/80 to-black backdrop-blur-sm md:flex md:min-h-0 md:flex-col">
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
