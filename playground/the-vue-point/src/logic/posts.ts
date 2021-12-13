import type { PageComponent } from 'iles'
import { computedInPage } from 'iles'

export interface Post extends PageComponent {
  title: string
  href: string
  excerpt: string
  date: Date
  author: string
  twitter: string
}

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

export function getPosts () {
  return computedInPage(() => {
    // @ts-ignore
    const posts = Object.values(import.meta.globEagerDefault('../pages/posts/**/*.{md,mdx}')) as Post[]
    return posts.sort(byDate)
  })
}
