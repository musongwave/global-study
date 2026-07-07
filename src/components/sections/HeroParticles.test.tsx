import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { HeroParticles } from './HeroParticles'

describe('HeroParticles', () => {
  afterEach(cleanup)

  it('рендерит canvas и не падает без 2d-контекста (jsdom)', () => {
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
