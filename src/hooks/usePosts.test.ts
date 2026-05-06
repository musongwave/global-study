import { renderHook } from '@testing-library/react'
import { usePosts } from './usePosts'

describe('usePosts', () => {
  it('возвращает все посты при category=all и пустом query', () => {
    const { result } = renderHook(() => usePosts('all', ''))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('фильтрует по категории', () => {
    const { result } = renderHook(() => usePosts('новости', ''))
    result.current.forEach(post => {
      expect(post.category).toBe('новости')
    })
  })

  it('фильтрует по поисковому запросу в title', () => {
    const { result: allResult } = renderHook(() => usePosts('all', ''))
    const firstPost = allResult.current[0]
    const firstWord = firstPost.title.split(' ')[0].toLowerCase()
    const { result } = renderHook(() => usePosts('all', firstWord))
    expect(result.current.some(p => p.id === firstPost.id)).toBe(true)
  })

  it('возвращает пустой массив при несовпадающем запросе', () => {
    const { result } = renderHook(() => usePosts('all', 'xyznonexistent999'))
    expect(result.current).toHaveLength(0)
  })
})
