# Hero «Созвездие знаний» + Liquid Glass — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить Vanta-глобус в Hero на композицию «фото библиотеки + canvas-частицы + стеклянные stat-плитки» и добавить сайту кастомный курсор и liquid-glass-hover (iOS 26) на кнопках и плитках.

**Architecture:** Три независимых движка: (1) `liquidGlass.ts` — один document-level делегированный слушатель, который анимирует любой элемент с классом `.liquid-glass` (tilt + specular через CSS custom properties); (2) `CustomCursor.tsx` — точка+кольцо на fixed-слое с одним rAF-циклом; (3) `HeroParticles.tsx` — canvas 2D с созвездием частиц. Секции подключаются добавлением CSS-класса, без пропсов и хуков.

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion + Vitest/Testing Library. Vanta и three удаляются.

**Spec:** `docs/superpowers/specs/2026-07-08-hero-liquid-glass-design.md`

## Global Constraints

- UI строго на русском языке.
- Все эффекты активны только при `(pointer: fine)` и выключены при `prefers-reduced-motion: reduce`.
- Цвет бренда: gold `#d4af37`, светлый акцент `#ffe9a8`, тёмный фон hero `#06070b`.
- Цифры плиток hero — реальные данные сайта (как в Stats/OG): `3000+ студентов поступили`, `30+ стран для обучения`, `100% помощь с грантами` (НЕ мокапные 500+/95%/15).
- Фото hero: `https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1800&q=80&auto=format`.
- Тесты: `bun run test` (vitest, jsdom). Сборка: `bun run build`.
- Коммиты после каждой задачи, сообщения на русском в стиле репо (`feat:`, `test:`, `chore:`).

---

### Task 1: Мок matchMedia в test-setup

jsdom не реализует `window.matchMedia`, а все новые модули его используют.

**Files:**
- Modify: `src/test-setup.ts`

**Interfaces:**
- Produces: `window.matchMedia(query)` в тестах возвращает `MediaQueryList`-совместимый объект с `matches: false` по умолчанию. Тесты переопределяют через `vi.stubGlobal` или `vi.spyOn(window, 'matchMedia')`.

- [ ] **Step 1: Добавить мок в test-setup**

Дописать в конец `src/test-setup.ts`:

```ts
// jsdom не реализует matchMedia — базовый мок (matches: false).
// Тесты, которым нужно matches: true, переопределяют через vi.spyOn.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
```

- [ ] **Step 2: Убедиться, что существующие тесты проходят**

Run: `bun run test`
Expected: все текущие тесты (Modal, usePosts) PASS.

- [ ] **Step 3: Commit**

```bash
git add src/test-setup.ts
git commit -m "test: мок matchMedia для jsdom"
```

---

### Task 2: Движок liquid glass (`src/lib/liquidGlass.ts`) + CSS

**Files:**
- Create: `src/lib/liquidGlass.ts`
- Create: `src/lib/liquidGlass.test.ts`
- Modify: `src/index.css` (стили `.liquid-glass`)

**Interfaces:**
- Produces: `initLiquidGlass(): () => void` — вешает document-слушатели, возвращает cleanup. Любой элемент с классом `liquid-glass` получает: класс `lg-active` при hover, CSS-переменные `--lg-rx`, `--lg-ry` (наклон, deg) и `--lg-px`, `--lg-py` (позиция блика, %). Ничего не делает при coarse pointer или reduced motion.

- [ ] **Step 1: Написать падающий тест**

`src/lib/liquidGlass.test.ts`:

```ts
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

  it('выставляет CSS-переменные наклона и блика при mousemove', () => {
    mockMatchMedia(true, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    tile.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150, clientY: 25 }))
    // px = 150/200 = 0.75 → ry = (0.75-0.5)*16 = 4deg; py = 25/100 = 0.25 → rx = (0.25-0.5)*-14 = 3.5deg
    expect(tile.style.getPropertyValue('--lg-ry')).toBe('4.00deg')
    expect(tile.style.getPropertyValue('--lg-rx')).toBe('3.50deg')
    expect(tile.style.getPropertyValue('--lg-px')).toBe('75.0%')
    expect(tile.style.getPropertyValue('--lg-py')).toBe('25.0%')
  })

  it('снимает lg-active и переменные при mouseout наружу', () => {
    mockMatchMedia(true, false)
    cleanup = initLiquidGlass()
    tile.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    tile.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, relatedTarget: document.body }))
    expect(tile.classList.contains('lg-active')).toBe(false)
    expect(tile.style.getPropertyValue('--lg-rx')).toBe('')
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
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

Run: `bun run test src/lib/liquidGlass.test.ts`
Expected: FAIL — `Cannot find module './liquidGlass'` (или аналог).

- [ ] **Step 3: Реализация**

`src/lib/liquidGlass.ts`:

```ts
const TILT_X_MAX = 14 // deg
const TILT_Y_MAX = 16 // deg

/**
 * Делегированный liquid-glass-эффект (iOS 26): наклон за курсором +
 * specular-блик для любого элемента с классом `liquid-glass`.
 * Возвращает cleanup. No-op на тач-устройствах и при reduced motion.
 */
export function initLiquidGlass(): () => void {
  if (
    !window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {}
  }

  let raf = 0
  let active: HTMLElement | null = null

  const reset = (el: HTMLElement) => {
    el.classList.remove('lg-active')
    for (const prop of ['--lg-rx', '--lg-ry', '--lg-px', '--lg-py']) {
      el.style.removeProperty(prop)
    }
  }

  const onOver = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.('.liquid-glass') as HTMLElement | null
    if (!el || el === active) return
    if (active) reset(active)
    active = el
    el.classList.add('lg-active')
  }

  const onOut = (e: MouseEvent) => {
    if (!active) return
    const to = e.relatedTarget as Element | null
    if (!to || !active.contains(to)) {
      reset(active)
      active = null
    }
  }

  const onMove = (e: MouseEvent) => {
    if (!active || raf) return
    const el = active
    const { clientX, clientY } = e
    raf = requestAnimationFrame(() => {
      raf = 0
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      const px = (clientX - r.left) / r.width
      const py = (clientY - r.top) / r.height
      el.style.setProperty('--lg-rx', `${((py - 0.5) * -TILT_X_MAX).toFixed(2)}deg`)
      el.style.setProperty('--lg-ry', `${((px - 0.5) * TILT_Y_MAX).toFixed(2)}deg`)
      el.style.setProperty('--lg-px', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--lg-py', `${(py * 100).toFixed(1)}%`)
    })
  }

  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  document.addEventListener('mousemove', onMove)

  return () => {
    cancelAnimationFrame(raf)
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
    document.removeEventListener('mousemove', onMove)
    if (active) reset(active)
    active = null
  }
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

Run: `bun run test src/lib/liquidGlass.test.ts`
Expected: 5 PASS.

- [ ] **Step 5: CSS для `.liquid-glass`**

Дописать в конец `src/index.css`:

```css
/* ---------- Liquid glass (iOS 26): наклон + бегущий блик ---------- */
.liquid-glass {
  --lg-rx: 0deg;
  --lg-ry: 0deg;
  --lg-px: 50%;
  --lg-py: 50%;
  position: relative;
  will-change: transform;
  transition: transform 0.6s cubic-bezier(0.2, 1.4, 0.4, 1), box-shadow 0.4s ease, border-color 0.4s ease;
}
.liquid-glass.lg-active {
  transform: perspective(900px) rotateX(var(--lg-rx)) rotateY(var(--lg-ry)) scale(1.05);
  transition: transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease;
  box-shadow:
    0 30px 60px -18px rgba(0, 0, 0, 0.35),
    0 0 40px -6px rgba(212, 175, 55, 0.28);
}
.liquid-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    240px circle at var(--lg-px) var(--lg-py),
    rgba(255, 255, 255, 0.28),
    rgba(255, 255, 255, 0.05) 45%,
    transparent 70%
  );
  mix-blend-mode: screen;
  opacity: 0;
  transition: opacity 0.35s ease;
}
.liquid-glass.lg-active::after {
  opacity: 1;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/liquidGlass.ts src/lib/liquidGlass.test.ts src/index.css
git commit -m "feat: движок liquid-glass (tilt + specular) с делегированием"
```

---

### Task 3: Кастомный курсор (`CustomCursor.tsx`)

**Files:**
- Create: `src/components/ui/CustomCursor.tsx`
- Create: `src/components/ui/CustomCursor.test.tsx`
- Modify: `src/index.css` (стили курсора)

**Interfaces:**
- Produces: компонент `<CustomCursor />` без пропсов. Рендерит `div.cursor-dot` и `div.cursor-ring` (fixed, z-50), добавляет `custom-cursor` на `<html>`. Рендерит `null` при coarse pointer / reduced motion. Кольцо получает класс `expanded` над `a, button, [role="button"], .liquid-glass`.

- [ ] **Step 1: Написать падающий тест**

`src/components/ui/CustomCursor.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `bun run test src/components/ui/CustomCursor.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

`src/components/ui/CustomCursor.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a, button, [role="button"], .liquid-glass'

/** Кастомный курсор: золотая точка + пружинящее кольцо с пульсом. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(
      window.matchMedia('(pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    )
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor')

    let cx = -100
    let cy = -100
    let rx = -100
    let ry = -100
    let visible = false
    let raf = 0

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      if (!visible) {
        rx = cx
        ry = cy
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onOver = (e: MouseEvent) => {
      const hit = (e.target as Element | null)?.closest?.(INTERACTIVE)
      ring.classList.toggle('expanded', !!hit)
    }

    const loop = () => {
      rx += (cx - rx) * 0.16
      ry += (cy - ry) * 0.16
      dot.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`
      const half = ring.classList.contains('expanded') ? 32 : 19
      ring.style.transform = `translate(${rx - half}px, ${ry - half}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
```

- [ ] **Step 4: Запустить тест — PASS**

Run: `bun run test src/components/ui/CustomCursor.test.tsx`
Expected: 4 PASS.

- [ ] **Step 5: CSS курсора**

Дописать в конец `src/index.css`:

```css
/* ---------- Кастомный курсор ---------- */
html.custom-cursor,
html.custom-cursor * {
  cursor: none !important;
}
/* В полях ввода оставляем системный текстовый курсор */
html.custom-cursor input,
html.custom-cursor textarea,
html.custom-cursor select {
  cursor: auto !important;
}
.cursor-dot,
.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
}
.cursor-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffe9a8;
  box-shadow:
    0 0 10px 2px rgba(212, 175, 55, 0.9),
    0 0 24px 6px rgba(212, 175, 55, 0.4);
}
.cursor-ring {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(212, 175, 55, 0.65);
  background: rgba(212, 175, 55, 0.05);
  transition:
    width 0.3s cubic-bezier(0.2, 1.4, 0.4, 1),
    height 0.3s cubic-bezier(0.2, 1.4, 0.4, 1),
    border-color 0.3s,
    background 0.3s;
}
.cursor-ring.expanded {
  width: 64px;
  height: 64px;
  border-color: rgba(255, 233, 168, 0.9);
  background: rgba(212, 175, 55, 0.1);
}
.cursor-ring::after {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid rgba(212, 175, 55, 0.25);
  animation: cursor-pulse 2s ease-out infinite;
}
@keyframes cursor-pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/CustomCursor.tsx src/components/ui/CustomCursor.test.tsx src/index.css
git commit -m "feat: кастомный курсор — точка и пружинящее кольцо"
```

---

### Task 4: Частицы hero (`HeroParticles.tsx`)

**Files:**
- Create: `src/components/sections/HeroParticles.tsx`
- Create: `src/components/sections/HeroParticles.test.tsx`

**Interfaces:**
- Produces: `<HeroParticles />` без пропсов — `<canvas className="absolute inset-0 w-full h-full" aria-hidden>`. Слушает mousemove на `canvas.parentElement`. При reduced motion рисует один статичный кадр; при null-контексте (jsdom) молча ничего не делает.

- [ ] **Step 1: Написать падающий тест**

`src/components/sections/HeroParticles.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `bun run test src/components/sections/HeroParticles.test.tsx`
Expected: FAIL — модуль не найден.

- [ ] **Step 3: Реализация**

`src/components/sections/HeroParticles.tsx`:

```tsx
import { useEffect, useRef } from 'react'

const GOLD = '212,175,55'
const TAU = Math.PI * 2
const COUNT = 85

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
}

/** Золотые частицы-«созвездие»: дрейф, линии между соседями, притяжение к курсору. */
export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const parent = canvas.parentElement

    let dpr = 1
    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
    }
    fit()

    const ps: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.00006,
      vy: (Math.random() - 0.5) * 0.00006,
    }))

    let mx = 0.3
    let my = 0.5

    const draw = (t: number) => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const glow = ctx.createRadialGradient(mx * w, my * h, 0, mx * w, my * h, h * 0.6)
      glow.addColorStop(0, `rgba(${GOLD},0.07)`)
      glow.addColorStop(1, `rgba(${GOLD},0)`)
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, w, h)

      ctx.lineWidth = 0.7 * dpr
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const a = ps[i]
          const b = ps[j]
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h)
          const lim = h * 0.22
          if (d < lim) {
            ctx.strokeStyle = `rgba(${GOLD},${0.15 * (1 - d / lim)})`
            ctx.beginPath()
            ctx.moveTo(a.x * w, a.y * h)
            ctx.lineTo(b.x * w, b.y * h)
            ctx.stroke()
          }
        }
      }
      for (const p of ps) {
        const tw = 0.5 + 0.5 * Math.sin(t * 0.0025 + p.x * 20)
        ctx.fillStyle = `rgba(${GOLD},${0.35 + 0.55 * tw * p.z})`
        ctx.beginPath()
        ctx.arc(p.x * w, p.y * h, (0.8 + p.z * 1.6) * dpr, 0, TAU)
        ctx.fill()
      }
    }

    if (reduced) {
      // Один статичный кадр без анимации и слушателей
      draw(0)
      const onResize = () => {
        fit()
        draw(0)
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    const step = () => {
      for (const p of ps) {
        const dx = mx - p.x
        const dy = my - p.y
        const d = Math.hypot(dx, dy) + 0.001
        const pull = Math.min(0.000012 / (d * d), 0.00008)
        p.vx += dx * pull
        p.vy += dy * pull
        p.vx *= 0.998
        p.vy *= 0.998
        p.x += p.vx * 16
        p.y += p.vy * 16
        if (p.x < 0 || p.x > 1) p.vx *= -1
        if (p.y < 0 || p.y > 1) p.vy *= -1
      }
    }

    let raf = 0
    const loop = (t: number) => {
      step()
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      mx = (e.clientX - r.left) / r.width
      my = (e.clientY - r.top) / r.height
    }
    const onResize = () => fit()

    parent?.addEventListener('mousemove', onMouse)
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      parent?.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
```

- [ ] **Step 4: Запустить тест — PASS**

Run: `bun run test src/components/sections/HeroParticles.test.tsx`
Expected: PASS (jsdom getContext('2d') → null, компонент молча выходит).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HeroParticles.tsx src/components/sections/HeroParticles.test.tsx
git commit -m "feat: canvas-частицы «созвездие» для hero"
```

---

### Task 5: Кнопки — spring-hover, золотой глянец, вариант glass

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/index.css` (класс `.btn-spring`)

**Interfaces:**
- Consumes: ничего нового.
- Produces: `Button`/`LinkButton` получают новый вариант `'glass'` (стеклянная кнопка для тёмного hero). Тип `Variant = 'gold' | 'outline-gold' | 'light' | 'outline-light' | 'glass'`. Все кнопки имеют пружинный hover-scale.

- [ ] **Step 1: CSS**

Дописать в конец `src/index.css`:

```css
/* ---------- Пружинный отклик кнопок ---------- */
.btn-spring {
  transition:
    transform 0.3s cubic-bezier(0.2, 1.4, 0.4, 1),
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.3s;
}
@media (pointer: fine) {
  .btn-spring:hover {
    transform: scale(1.06);
  }
}
```

- [ ] **Step 2: Обновить Button.tsx**

Заменить содержимое `src/components/ui/Button.tsx`:

```tsx
import { cn } from '../../lib/cn'

type Variant = 'gold' | 'outline-gold' | 'light' | 'outline-light' | 'glass'

const base =
  'inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm btn-spring cursor-pointer'

const variants: Record<Variant, string> = {
  gold: 'bg-gradient-to-b from-[#e8c65a] to-[#c9a22e] text-black shadow-[inset_0_1px_0_rgba(255,255,255,.5),0_8px_24px_-8px_rgba(212,175,55,.6)] hover:from-[#f0d06a] hover:to-[#d4af37]',
  'outline-gold': 'border border-gold text-gold hover:bg-gold hover:text-black',
  light:
    'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-100',
  'outline-light':
    'border border-gray-300 dark:border-white/80 text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black',
  glass:
    'border border-white/30 text-white bg-white/5 backdrop-blur-md hover:bg-white/15',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
}

export function Button({ variant = 'gold', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />
}

export function LinkButton({ variant = 'gold', className, ...props }: LinkButtonProps) {
  return <a className={cn(base, variants[variant], className)} {...props} />
}
```

(Было: `transition-all duration-200` в `base` — заменено на `btn-spring`; вариант `gold` был плоским `bg-gold hover:bg-gold-dark`.)

- [ ] **Step 3: Проверить типы и тесты**

Run: `bun run test && bunx tsc -b --noEmit 2>&1 | head -5`
Expected: тесты PASS, tsc без ошибок.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Button.tsx src/index.css
git commit -m "feat: пружинный hover кнопок, золотой глянец, вариант glass"
```

---

### Task 6: Переписать Hero + подключить курсор и движок в App

**Files:**
- Modify: `src/components/sections/Hero.tsx` (полная замена)
- Create: `src/components/sections/Hero.test.tsx`
- Modify: `src/App.tsx` (`<Hero />` без пропса, mount CustomCursor + initLiquidGlass)
- Modify: `src/index.css` (стили `.glass-tile`, `.hero-float`)
- Modify: `index.html` (preload фото)
- Delete: `src/types/vanta.d.ts`
- Modify: `package.json` (удалить vanta, three, @types/three)

**Interfaces:**
- Consumes: `HeroParticles` (Task 4), `LinkButton` c вариантами `gold`/`glass` (Task 5), классы `liquid-glass` (Task 2).
- Produces: `export function Hero()` — БЕЗ пропса `isDark` (hero всегда тёмный). `App.tsx` рендерит `<Hero />`, `<CustomCursor />` и вызывает `initLiquidGlass()` в `useEffect`.

- [ ] **Step 1: Написать падающий тест**

`src/components/sections/Hero.test.tsx`:

```tsx
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import { Hero } from './Hero'

describe('Hero', () => {
  afterEach(cleanup)

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
```

- [ ] **Step 2: Запустить — убедиться, что падает**

Run: `bun run test src/components/sections/Hero.test.tsx`
Expected: FAIL — Hero требует `isDark`, нет плиток/текстов.

- [ ] **Step 3: Переписать Hero.tsx**

Полная замена `src/components/sections/Hero.tsx`:

```tsx
import { LinkButton } from '../ui/Button'
import { HeroParticles } from './HeroParticles'

const HERO_PHOTO =
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1800&q=80&auto=format'

const HERO_STATS = [
  { num: '3000+', label: 'студентов поступили' },
  { num: '30+', label: 'стран для обучения' },
  { num: '100%', label: 'помощь с грантами' },
] as const

export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-[#06070b]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_PHOTO})` }}
        role="img"
        aria-label="Читальный зал университетской библиотеки"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(6,7,11,.94) 0%, rgba(6,7,11,.78) 40%, rgba(6,7,11,.30) 100%)',
        }}
      />
      <HeroParticles />
      <div className="relative z-10 container mx-auto px-6 py-32 pt-40 grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-12 lg:gap-8 items-center">
        <div>
          <p className="text-gold font-syne text-sm font-semibold tracking-widest uppercase mb-4">
            Агентство международного образования
          </p>
          <h1 className="font-syne text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
            Обучение за рубежом
            <br />
            <span className="text-white/55">с гарантированной поддержкой</span>
          </h1>
          <p className="text-lg max-w-xl mb-10 leading-relaxed text-white/70">
            Ваш путь в топовые университеты мира. Гранты, визовое сопровождение и поддержка на
            каждом этапе.
          </p>
          <div className="flex flex-wrap gap-4">
            <LinkButton href="#contact" variant="gold">
              Начать путь
            </LinkButton>
            <LinkButton href="#universities" variant="glass">
              Университеты
            </LinkButton>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:gap-6 max-w-md lg:max-w-none mx-auto lg:mx-0 w-full [perspective:900px]">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`hero-float ${i === 1 ? 'lg:ml-[9%]' : ''} ${i === 2 ? 'lg:-ml-[4%]' : ''}`}
              style={{ animationDelay: `${-2 * i}s` }}
            >
              <div className="liquid-glass glass-tile">
                <div className="font-syne text-4xl md:text-5xl font-extrabold leading-none bg-gradient-to-b from-[#ffe9a8] to-gold bg-clip-text text-transparent [filter:drop-shadow(0_2px_8px_rgba(212,175,55,.35))]">
                  {s.num}
                </div>
                <div className="text-white/85 text-sm font-medium mt-2">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: CSS плиток**

Дописать в конец `src/index.css`:

```css
/* ---------- Стеклянные плитки hero ---------- */
.glass-tile {
  border-radius: 26px;
  padding: 1.75rem 2.25rem;
  background:
    radial-gradient(120px 60px at 12% 100%, rgba(120, 200, 255, 0.12), transparent 70%),
    radial-gradient(140px 70px at 95% 10%, rgba(255, 170, 120, 0.1), transparent 70%),
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.16) 0%,
      rgba(255, 255, 255, 0.05) 45%,
      rgba(255, 255, 255, 0.12) 100%
    );
  backdrop-filter: blur(14px) saturate(1.3);
  -webkit-backdrop-filter: blur(14px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.28);
  box-shadow:
    0 20px 40px -16px rgba(0, 0, 0, 0.55),
    inset 0 1px 1px rgba(255, 255, 255, 0.45),
    inset 0 -8px 20px -8px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.glass-tile::before {
  content: '';
  position: absolute;
  left: 6%;
  right: 40%;
  top: 8%;
  height: 30%;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0));
  filter: blur(6px);
  pointer-events: none;
}
.hero-float {
  animation: hero-floaty 6s ease-in-out infinite;
}
@keyframes hero-floaty {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
```

(Парение — на обёртке `.hero-float`, tilt — на вложенной `.liquid-glass`: transform-ы не конфликтуют.)

- [ ] **Step 5: Обновить App.tsx**

В `src/App.tsx`:

1. Добавить импорты:

```tsx
import { CustomCursor } from './components/ui/CustomCursor'
import { initLiquidGlass } from './lib/liquidGlass'
```

2. Добавить эффект рядом с существующим `useEffect` темы:

```tsx
useEffect(() => initLiquidGlass(), [])
```

3. Заменить `<Hero isDark={isDark} />` на `<Hero />`.

4. Добавить `<CustomCursor />` последним элементом фрагмента (после `<ScrollToTop />`):

```tsx
      <ScrollToTop />
      <CustomCursor />
```

- [ ] **Step 6: Preload фото в index.html**

В `index.html` после строки `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` добавить:

```html
    <link rel="preload" as="image" href="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1800&q=80&auto=format" fetchpriority="high">
```

- [ ] **Step 7: Удалить vanta и three**

```bash
rm src/types/vanta.d.ts
bun remove vanta three @types/three
grep -rn "vanta\|from 'three'" src/ --include="*.ts*"
```

Expected: grep ничего не находит.

- [ ] **Step 8: Тесты и сборка**

Run: `bun run test && bun run build`
Expected: все тесты PASS (включая Hero.test.tsx), сборка успешна.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: hero «Созвездие знаний» — фото, частицы, стеклянные плитки; удалён vanta"
```

---

### Task 7: Liquid glass на плитках секций

**Files:**
- Modify: `src/components/sections/Stats.tsx`
- Modify: `src/components/sections/Services.tsx`
- Modify: `src/components/sections/Universities.tsx`
- Modify: `src/components/sections/Posts.tsx`
- Modify: `src/components/sections/SuccessStories.tsx`
- Modify: `src/components/sections/Destinations.tsx`

**Interfaces:**
- Consumes: класс `liquid-glass` (движок из Task 2, инициализирован в App из Task 6).
- Produces: карточки всех перечисленных секций реагируют tilt+бликом. Framer-motion `whileHover` убирается там, где он конфликтует с transform движка.

- [ ] **Step 1: Stats.tsx — StatCounter**

В `src/components/sections/Stats.tsx` заменить:

```tsx
    <motion.div
      ref={ref}
      className="text-center p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40 transition-colors cursor-default"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
```

на:

```tsx
    <motion.div
      ref={ref}
      className="liquid-glass text-center p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40 cursor-default"
    >
```

(Убраны `whileHover`/`transition` — иначе framer перезапишет transform движка; `transition-colors` убран — переходы даёт `.liquid-glass`.)

- [ ] **Step 2: Services.tsx — карточки услуг**

Заменить:

```tsx
              className="p-8 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
```

на:

```tsx
              className="liquid-glass p-8 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
```

- [ ] **Step 3: Universities.tsx — карточки карусели**

Заменить:

```tsx
              className="flex-shrink-0 w-48 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left hover:border-gold/40 transition-all snap-start"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
```

на:

```tsx
              className="liquid-glass flex-shrink-0 w-48 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left hover:border-gold/40 snap-start"
```

- [ ] **Step 4: Posts.tsx — карточки постов**

Заменить:

```tsx
                  className="rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden hover:border-gold/30 transition-all"
```

на:

```tsx
                  className="liquid-glass rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden hover:border-gold/30"
```

- [ ] **Step 5: SuccessStories.tsx — карточки историй**

Заменить:

```tsx
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 dark:border-white/5 hover:border-gold/20 dark:hover:border-gold/20 transition-colors"
```

на:

```tsx
              className="liquid-glass bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 dark:border-white/5 hover:border-gold/20 dark:hover:border-gold/20"
```

- [ ] **Step 6: Destinations.tsx — фото кампуса**

Заменить:

```tsx
          className="rounded-2xl object-cover w-full h-80"
```

на:

```tsx
          className="liquid-glass rounded-2xl object-cover w-full h-80"
```

- [ ] **Step 7: Тесты, типы, сборка**

Run: `bun run test && bun run build`
Expected: PASS, сборка успешна.

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/
git commit -m "feat: liquid-glass hover на плитках всех секций"
```

---

### Task 8: Финальная верификация в браузере

**Files:** нет изменений (проверка).

- [ ] **Step 1: Запустить dev-сервер и открыть сайт**

```bash
bun run dev &
open "http://localhost:5173/global-study/"
```

- [ ] **Step 2: Чек-лист ручной проверки**

- Hero: фото библиотеки + затемнение, частицы двигаются и тянутся к курсору.
- Плитки hero: 3000+/30+/100%, парят, при наведении — наклон + блик, пауза парения не требуется (парение на обёртке).
- Курсор: точка + кольцо по всему сайту, кольцо расширяется над кнопками/карточками, в поисковом поле Posts вводится текст.
- Кнопки: пружинный scale, золотая — с глянцем.
- Секции Stats/Services/Universities/Posts/SuccessStories/Destinations: tilt + блик на карточках.
- Переключить тему — hero остаётся тёмным, остальные секции переключаются.
- Сузить окно до мобильной ширины (responsive mode) — плитки в колонку под текстом.
- В DevTools включить эмуляцию `prefers-reduced-motion: reduce` и перезагрузить — курсор системный, tilt выключен, частицы статичны.

- [ ] **Step 3: Если всё ок — финальный коммит не нужен (всё закоммичено по задачам). Доложить пользователю.**
