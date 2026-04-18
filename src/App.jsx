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
    <div className="relative min-h-screen bg-black px-4 py-5 text-gray-200 md:px-8 md:py-8">
      <Starfield />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <Routes>
          <Route path="/" element={<HomePage posts={posts} />} />
          <Route path="/blog/:slug" element={<BlogPostPage posts={posts} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <section className="mt-6 border border-white/10 bg-black/40 px-4 py-4 backdrop-blur-sm md:px-5">
          <h3 className="mb-3 mt-0 text-xs uppercase tracking-[0.16em] text-gray-400">
            connect
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.linkedin.com/in/ankush-wadehra-bb64b0258/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/35 hover:text-zinc-100"
            >
              <LinkIcon size={14} strokeWidth={1.7} />
              LinkedIn
            </a>
            <a
              href="https://github.com/beastgotfried"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/35 hover:text-zinc-100"
            >
              <FolderGit2 size={14} strokeWidth={1.7} />
              GitHub
            </a>
            <a
              href="https://x.com/wank_ush"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs uppercase tracking-[0.12em] text-gray-300 transition hover:border-white/35 hover:text-zinc-100"
            >
              <Bird size={14} strokeWidth={1.7} />
              Twitter
            </a>
          </div>
        </section>

        <footer className="mt-6 border border-white/10 px-4 py-3 text-xs text-gray-500 md:mt-8 md:px-5">
          Built with coffee and credits and memories about someone
        </footer>
      </div>
    </div>
  )
}

function HomePage({ posts }) {
  return (
    <>
      <header className="mb-8 border border-white/10 bg-black/40 px-5 py-4 backdrop-blur-sm md:mb-10 md:px-7 md:py-5">
        <div className="mb-3 flex items-center gap-2 text-gray-400">
          <MoonStar size={16} strokeWidth={1.5} />
          <span className="text-xs tracking-[0.2em]">Beasted</span>
        </div>
        <h1 className="m-0 text-3xl font-medium text-zinc-100 md:text-5xl">
          Documenting my learnings in tech
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-gray-400 md:text-base">
          Join me in my journey, traversing through tech
        </p>
      </header>

      <main className="space-y-5">
        <section className="border border-white/10 bg-black/45 backdrop-blur-sm">
          <div className="border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-gray-500 md:px-7">
            Who am i??
          </div>
          <div className="px-5 py-5 md:px-7 md:py-6">
            <p className="max-w-4xl text-sm leading-7 text-gray-300 md:text-base">
              Hey, my name is Ankush. I am an absolute geek who is ready to learn everything. I dont have anyone to write to anymore :( so i resorted to writing something about what i learnt for the world to read and hopefully comment what they think <br /><br />

              Thinking about comments.. hmm... we could probably get that thing added here as well lets see how well i can dive my hands into postgres and backend in the future. For now you can send anything you would want me to add or subtract from the blogs that you felt wrong by personally messing or texting me on my linkedin or twitter
              
            </p>
          </div>
        </section>

        <section className="border border-white/10 bg-black/45 backdrop-blur-sm">
          <div className="border-b border-white/10 px-5 pt-4 md:px-7">
            <div className="flex items-end gap-3">
              <span className="inline-flex items-center gap-2 rounded-t-md border border-white/20 border-b-black bg-black px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-100">
                <BookOpenText size={14} strokeWidth={1.5} />
                Blogs
              </span>
              <span className="pb-2 text-[11px] uppercase tracking-[0.14em] text-gray-500">
                {posts.length} posts
              </span>
            </div>
          </div>

          <div className="p-5 md:p-7">
            <div className="mb-5 text-xs uppercase tracking-[0.16em] text-gray-500">
              Recent blog posts
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function BlogPostPage({ posts }) {
  const { slug } = useParams()
  const post = posts.find((item) => item.slug === slug)

  if (!post) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="border border-white/10 bg-black/45 p-5 backdrop-blur-sm md:p-7">
      <div className="mb-5">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-gray-400 hover:text-zinc-200"
        >
          <ArrowLeft size={14} strokeWidth={1.7} />
          back to home
        </Link>
      </div>

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
  )
}

export default App
