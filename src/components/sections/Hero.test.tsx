import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('рендерит заголовок, кнопки и три стеклянные плитки статистики', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Обучение за рубежом')
    expect(screen.getByRole('link', { name: 'Начать путь' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Университеты' })).toBeInTheDocument()
    expect(screen.getByText('3000+')).toBeInTheDocument()
    expect(screen.getByText('30+')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(document.querySelectorAll('.glass-tile')).toHaveLength(3)
  })
})
