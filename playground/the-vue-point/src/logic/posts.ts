import type { VNode } from 'vue'
import type { PageComponent } from 'iles'
import { computedInPage } from 'iles'
import { Fragment } from 'vue'

export interface Post extends PageComponent {
  title: string
  href: string
  date: Date
  author: string
  twitter: string
  excerpt: () => VNode[]
  render: () => VNode
}

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

function excerptFor (post: Post) {
  const mdxDoc = post.render()
  if (!mdxDoc) return []

  const nodes = mdxDoc.type === Fragment ? mdxDoc.children as VNode[] : [mdxDoc]

  const excerptIndex = nodes.findIndex(el => el.type === 'hr')

  return excerptIndex > - 1 ? nodes.slice(0, excerptIndex) : nodes
}

export function getPosts () {
  return computedInPage(() => {
    // @ts-ignore
    const posts = Object.values(import.meta.globEagerDefault('../pages/posts/**/*.{md,mdx}')) as Post[]
    posts.forEach(post => { post.excerpt = () => excerptFor(post) })
    return posts.sort(byDate)
  })
}
