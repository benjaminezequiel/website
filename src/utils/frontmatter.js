export function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) return { frontmatter: {}, content }

  const frontmatter = match[1].split('\n').reduce((acc, line) => {
    const [key, ...values] = line.split(':')
    if (key && values.length) {
      const value = values.join(':').trim()

      if (value.startsWith('[') && value.endsWith(']')) {
        acc[key.trim()] = value
          .slice(1, -1)
          .split(',')
          .map((item) => item.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean)
      } else {
        acc[key.trim()] = value.replace(/^["']|["']$/g, '')
      }
    }
    return acc
  }, {})

  return { frontmatter, content: match[2] }
}
