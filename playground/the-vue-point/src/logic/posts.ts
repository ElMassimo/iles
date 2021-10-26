import { useStorage, StorageSerializers } from '@vueuse/core'

const blogFilesPath = 'https://api.github.com/repos/vuejs/blog/git/trees/master?recursive=1'

interface GitFile {
  path: string
  url: string
}

export interface Post extends Record<string, any> {
  title: string
  href: string
  date: Date
  excerpt: string
  content: string
}

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

export async function fetchPostFiles () {
  const files: GitFile[] = (await fetch(blogFilesPath).then(r => r.json())).tree
  return files.filter(file => file.path.startsWith('posts/'))
}

async function fetchPosts () {
  const posts = await fetchPostFiles()
  return (await Promise.all(posts.map(fetchPost))).sort(byDate)
}

function decodeBase64 (val: string) {
  return import.meta.env.SSR ? Buffer.from(val, 'base64').toString() : atob(val)
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
  } as any as Post
}

let serverCache: any = {}

export async function getPosts () {
  const cache = import.meta.env.SSR
    ? (serverCache.posts ||= {})
    : useStorage('posts', null, undefined, { serializer: StorageSerializers.object })

  if (Number(cache.value?.cachedAt || 0) < Number(new Date()) - 120000) {
    const posts = await fetchPosts()
    cache.value = { posts, cachedAt: Number(new Date()) }
  }

  return (cache.value?.posts || []) as Post[]
}

export function useClearPosts () {
  const cache = useStorage('posts', null, undefined)
  return () => { cache.value = null }
}
