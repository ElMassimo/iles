const blogFilesPath = 'https://api.github.com/repos/vuejs/blog/git/trees/master?recursive=1'
const { performance } = import.meta.env.SSR ? require('perf_hooks') : window
const fetch = import.meta.env.SSR ? require('node-fetch') : window.fetch

interface GitFile {
  path: string
  url: string
}

export async function fetchPosts () {
  const startTime = performance.now()
  try {
    console.info('fetching posts...')
    const files: GitFile[] = (await fetch(blogFilesPath).then(r => r.json())).tree
    const postFiles = files.filter(file => file.path.startsWith('posts/'))
    return await Promise.all(postFiles.map(fetchPost))
  } finally {
    console.info(`  done in ${timeSince(startTime)}\n`)
  }
}

async function fetchPost (file: GitFile) {
  const slug = file.path.replace(/^posts\/(.*)\.md$/, '$1').replace('.', '-')
  const { content: base64 } = await fetch(file.url).then(r => r.json())
  const [, rawMatter, excerpt, content] = decodeBase64(base64).split('---\n', 4)
  const matter = Object.fromEntries(
    rawMatter.split('\n').map((line: string) => line.split(':', 2).map(s => s.trim().replace(/(^['"])(.*)\1/, '$2'))),
  )
  return {
    ...matter,
    slug,
    href: `/posts/${slug}`,
    date: matter.date && new Date(matter.date),
    excerpt: excerpt.replace(/(^\n+)|(\n+$)/, ''),
    content: content.replace(/(^\n+)|(\n+$)/, ''),
  }
}

function decodeBase64 (val: string) {
  return import.meta.env.SSR ? Buffer.from(val, 'base64').toString() : atob(val)
}

function timeSince (start: number): string {
  const diff = performance.now() - start
  return diff < 750 ? `${Math.round(diff)}ms` : `${(diff / 1000).toFixed(1)}s`
}
