import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { HeroParticles } from './HeroParticles'

describe('HeroParticles', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('рендерит canvas и не падает без 2d-контекста (jsdom)', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    const { container } = render(
      <div>
        <HeroParticles />
      </div>,
    )
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeNull()
    expect(canvas!.getAttribute('aria-hidden')).toBe('true')
  })
})
