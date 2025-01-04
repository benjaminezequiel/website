import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import container from 'markdown-it-container'

const slugify = (s) => {
  const text = s.replace(/<[^>]*>/g, '')
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const createMarkdownRenderer = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })

  md.use(markdownItAnchor, {
    level: 1,
    permalink: markdownItAnchor.permalink.ariaHidden({
      placement: 'before',
    }),
    slugify,
  })

  return md
}
