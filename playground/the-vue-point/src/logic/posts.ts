import type { PageComponent } from 'iles'
import { computed } from 'vue'

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
  return computed(() => {
    const posts = useDocuments('~/pages/posts')
    return posts.sort(byDate)
  })
}
