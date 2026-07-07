import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, fireEvent } from '@testing-library/react'
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

  it('кольцо расширяется над интерактивным элементом и сжимается вне его', () => {
    mockMatchMedia(true, false)
    const { container } = render(<CustomCursor />)
    const ring = container.querySelector('.cursor-ring') as HTMLElement

    const button = document.createElement('button')
    document.body.appendChild(button)
    try {
      fireEvent.mouseOver(button, { bubbles: true })
      expect(ring.classList.contains('expanded')).toBe(true)

      fireEvent.mouseOver(document.body, { bubbles: true })
      expect(ring.classList.contains('expanded')).toBe(false)
    } finally {
      button.remove()
    }
  })

  it('точка и кольцо появляются при движении мыши и скрываются при уходе с экрана', () => {
    mockMatchMedia(true, false)
    const { container } = render(<CustomCursor />)
    const dot = container.querySelector('.cursor-dot') as HTMLElement
    const ring = container.querySelector('.cursor-ring') as HTMLElement

    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    expect(dot.style.opacity).toBe('1')
    expect(ring.style.opacity).toBe('1')

    fireEvent.mouseLeave(document.documentElement)
    expect(dot.style.opacity).toBe('0')
    expect(ring.style.opacity).toBe('0')
  })
})
