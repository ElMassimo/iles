import type { Document, PageComponent } from 'iles'
import { computed } from 'vue'

export interface Post extends PageComponent {
  date: Date
  author: string
  title: string
  twitter: string
}

function byDate (a: Document<Post>, b: Document<Post>) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

export function getPosts () {
  const posts = useDocuments<Post>('~/pages/posts')
  return computed(() => posts.value.sort(byDate))
}
