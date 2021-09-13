import { h, DefineComponent, FunctionalComponent } from 'vue'

interface Post extends Record<string, any> {
  title: string
  href: string
  date: Date | number
  content: DefineComponent
}

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

function isArray<T> (val: any): val is T[] {
  return Array.isArray(val)
}

const ExcerptOnly: FunctionalComponent = (_props, { slots }) => {
  const mdxDoc = slots.default?.()?.[0]
  if (!mdxDoc) return null

  const mdElements = mdxDoc.children
  if (!isArray(mdElements)) return mdElements

  const excerptIndex = mdElements.findIndex(el => (el as any).type === 'hr')
  return excerptIndex ? mdElements.slice(0, excerptIndex) : mdElements
}

function withExcerpt (post: Post) {
  const excerpt: FunctionalComponent = (props, ctx) =>
    h(post.default || post, { components: { wrapper: ExcerptOnly } })
  return { ...post, excerpt }
}

export function usePosts () {
  const posts = Object.values(import.meta.globEager('../pages/posts/**/*.{md,mdx}')) as Post[]
  return posts.sort(byDate).map(withExcerpt)
}
