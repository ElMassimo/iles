import { Component } from 'vue'

interface Post extends Record<string, any> {
  title: string
  href: string
  date: Date | number
  content: Component
}

function byDate (a: Post, b: Post) {
  return Number(new Date(b.date)) - Number(new Date(a.date))
}

export function usePosts ({ excerpt = false }: { excerpt?: boolean } = {}) {
  const posts = Object.values(import.meta.globEager('../pages/posts/**/*.{md,mdx}')) as Post[]
  return posts.sort(byDate)
}
