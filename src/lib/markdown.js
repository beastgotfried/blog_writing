import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js/lib/common'
import DOMPurify from 'dompurify'

// A single configured Marked instance. Fenced code blocks are syntax-highlighted
// with highlight.js; we use the "common" bundle (~37 popular languages) instead
// of the full build to keep the JS payload smaller.
const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

// marked does NOT sanitize its output, and we render it via dangerouslySetInnerHTML.
// DOMPurify strips any script/event-handler/unsafe markup before it reaches the DOM,
// so author typos (or future user-supplied content) can't turn into an XSS hole.
export function renderMarkdown(content) {
  const html = marked.parse(content ?? '')
  return DOMPurify.sanitize(html)
}
