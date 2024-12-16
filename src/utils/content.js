import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})

// Add callout types
const callouts = {
  NOTE: {
    icon: 'ℹ️',
    className: 'callout-note',
  },
  TIP: {
    icon: '💡',
    className: 'callout-tip',
  },
  WARNING: {
    icon: '⚠️',
    className: 'callout-warning',
  },
  DANGER: {
    icon: '🚫',
    className: 'callout-danger',
  },
  INFO: {
    icon: '📝',
    className: 'callout-info',
  },
}

// Add container support for each callout type
Object.keys(callouts).forEach((name) => {
  md.use(container, name.toLowerCase(), {
    render: (tokens, idx) => {
      const token = tokens[idx]
      const info = token.info.trim().toLowerCase()
      const title = tokens[idx].info.trim().match(/\[(.*?)\]/)?.[1] || ''

      if (token.nesting === 1) {
        // Opening tag
        return `<div class="callout ${callouts[name].className}">
                  <div class="callout-header">
                    <span class="callout-icon">${callouts[name].icon}</span>
                    <span class="callout-title">${title || name}</span>
                  </div>
                  <div class="callout-content">\n`
      } else {
        // Closing tag
        return '</div></div>\n'
      }
    },
  })
})

function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) return { frontmatter: {}, content }

  const frontmatterStr = match[1]
  const markdownContent = match[2]

  const frontmatter = frontmatterStr.split('\n').reduce((acc, line) => {
    const [key, ...values] = line.split(':')
    if (key && values.length) {
      // Clean up the value by removing quotes and extra spaces
      const value = values
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '')
      acc[key.trim()] = value
    }
    return acc
  }, {})

  return { frontmatter, content: markdownContent }
}

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
