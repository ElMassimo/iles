import { withCache } from '~/logic/cache'
import { fetchPosts } from '~/logic/github'

export interface Post extends Record<string, any> {
  title: string
  href: string
  date: Date
  excerpt: string
  content: string
}

const cacheKey = 'posts'

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

export async function getPosts () {
  return await withCache<Post[]>(cacheKey, async () => {
    const posts = await fetchPosts()
    console.log(...posts)
    return posts.sort(byDate)
  })
}
