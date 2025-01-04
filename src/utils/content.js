import { createMarkdownRenderer } from './markdown.config'
import { parseFrontMatter } from './frontmatter'

const md = createMarkdownRenderer()

export async function getContent(folder) {
  try {
    const files = import.meta.glob('/src/content/**/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    })

    const contentFiles = Object.entries(files).filter(([path]) =>
      path.includes(`/src/content/${folder}/`),
    )

    if (contentFiles.length === 0) {
      console.warn(`No markdown files found in ${folder}`)
      return []
    }

    const content = contentFiles.map(([path, content]) => {
      const { frontmatter, content: markdown } = parseFrontMatter(content)
      const slug = path.split('/').pop().replace('.md', '')

      return {
        ...frontmatter,
        content: md.render(markdown),
        slug,
        path,
      }
    })

    return content.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date)
      }
      return 0
    })
  } catch (error) {
    console.error('Error loading markdown content:', error)
    return []
  }
}

export async function getContentBySlug(folder, slug) {
  const allContent = await getContent(folder)
  return allContent.find((item) => item.slug === slug)
}
