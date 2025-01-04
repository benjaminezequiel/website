export function parseFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) return { frontmatter: {}, content }

  const frontmatter = match[1].split('\n').reduce((acc, line) => {
    const [key, ...values] = line.split(':')
    if (key && values.length) {
      acc[key.trim()] = values
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '')
    }
    return acc
  }, {})

  return { frontmatter, content: match[2] }
}
