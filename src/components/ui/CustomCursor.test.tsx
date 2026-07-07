import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { CustomCursor } from './CustomCursor'

function mockMatchMedia(finePointer: boolean, reducedMotion: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('pointer') ? finePointer : reducedMotion,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}

describe('CustomCursor', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    document.documentElement.classList.remove('custom-cursor')
  })

  it('рендерит точку и кольцо при fine pointer', () => {
    mockMatchMedia(true, false)
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('.cursor-dot')).not.toBeNull()
    expect(container.querySelector('.cursor-ring')).not.toBeNull()
    expect(document.documentElement.classList.contains('custom-cursor')).toBe(true)
  })

  it('не рендерится на тач-устройствах', () => {
    mockMatchMedia(false, false)
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('.cursor-dot')).toBeNull()
    expect(document.documentElement.classList.contains('custom-cursor')).toBe(false)
  })

  it('не рендерится при reduced motion', () => {
    mockMatchMedia(true, true)
    const { container } = render(<CustomCursor />)
    expect(container.querySelector('.cursor-dot')).toBeNull()
  })

  it('снимает класс с <html> при размонтировании', () => {
    mockMatchMedia(true, false)
    const { unmount } = render(<CustomCursor />)
    unmount()
    expect(document.documentElement.classList.contains('custom-cursor')).toBe(false)
  })
})
