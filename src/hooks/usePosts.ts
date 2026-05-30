import { useMemo } from 'react'
import postsData from '../../data/posts.json'
import type { Post, Category } from '../types/post'

const posts = postsData as Post[]

export function usePosts(category: Category, query: string): Post[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(post => {
      const matchCat = category === 'all' || post.category === category
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [category, query])
}

export function usePostCounts(query: string): Record<string, number> {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    const counts: Record<string, number> = { all: 0 }
    posts.forEach(post => {
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      if (matchSearch) {
        counts.all = (counts.all || 0) + 1
        counts[post.category] = (counts[post.category] || 0) + 1
      }
    })
    return counts
  }, [query])
}
