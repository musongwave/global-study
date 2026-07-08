import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initLiquidGlass } from './liquidGlass'

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

describe('initLiquidGlass', () => {
  let cleanup: (() => void) | null = null
  let tile: HTMLDivElement

  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    tile = document.createElement('div')
    tile.className = 'liquid-glass'
    // jsdom: getBoundingClientRect всегда нули — задаём руками
    tile.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect
    document.body.appendChild(tile)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = null
    tile.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('добавляет lg-active при mouseover на плитку', () => {
    mockMatchMedia(true, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(tile.classList.contains('lg-active')).toBe(true)
  })

  it('выставляет наклон в transform и переменные блика при mousemove', () => {
    mockMatchMedia(true, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    tile.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150, clientY: 25 }))
    // px = 150/200 = 0.75 → ry = (0.75-0.5)*16 = 4deg; py = 25/100 = 0.25 → rx = (0.25-0.5)*-14 = 3.5deg
    expect(tile.style.transform).toBe(
      'perspective(900px) rotateX(3.50deg) rotateY(4.00deg) scale(1.05)',
    )
    expect(tile.style.getPropertyValue('--lg-px')).toBe('75.0%')
    expect(tile.style.getPropertyValue('--lg-py')).toBe('25.0%')
  })

  it('снимает lg-active, transform и переменные при mouseout наружу', () => {
    mockMatchMedia(true, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    tile.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }))
    expect(tile.classList.contains('lg-active')).toBe(false)
    expect(tile.style.transform).toBe('')
    expect(tile.style.getPropertyValue('--lg-px')).toBe('')
  })

  it('не активируется при reduced motion', () => {
    mockMatchMedia(true, true)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(tile.classList.contains('lg-active')).toBe(false)
  })

  it('не активируется при coarse pointer', () => {
    mockMatchMedia(false, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    expect(tile.classList.contains('lg-active')).toBe(false)
  })
})
