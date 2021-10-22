import { computed, watch } from 'vue'
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

async function fetchPost (file: GitFile) {
  const slug = file.path.replace(/^posts\/(.*)\.md$/, '$1')
  const { content: base64 } = await fetch(file.url).then(r => r.json())
  const [rawMatter, excerpt, content] = atob(base64).split('---\n', 3)
  const matter = Object.fromEntries(
    rawMatter.split('\n').map((line: string) => line.split(':', 2).map(s => s.trim().replace(/(^['"])(.*)\1/, '$2'))),
  )
  return {
    ...matter,
    href: `/posts/${slug}`,
    date: matter.date && new Date(matter.date),
    excerpt: excerpt.replace(/(^\n+)|(\n+$)/, ''),
    content: content.replace(/(^\n+)|(\n+$)/, ''),
  } as any as Post
}

export function usePosts () {
  const cache = useStorage('posts', null, undefined, { serializer: StorageSerializers.object })
  let promise

  watch(cache, () => {
    if (Number(cache.value?.cachedAt || 0) < Number(new Date()) - 120000)
      promise = fetchPosts().then(data => cache.value = { posts: data, cachedAt: Number(new Date()) })
  }, { immediate: true })

  return {
    posts: computed(() => (cache.value?.posts || []) as Post[]),
    clear () { cache.value = null },
    promise,
  }
}
