import { useEffect, useRef } from 'react'

const COLS = 40
const DAMPING = 0.978
const RETURN_FORCE = 0.003
const SPRING_K = 0.12
const IMPULSE_EVERY = 2.4 // секунд между волнами от краёв

interface Flash {
  x: number
  y: number
  life: number
  ring: number
}

/** Цвет линии по натяжению: тёмное золото → золото бренда → бело-золотой накал. */
function tensionColor(tension: number) {
  const t = Math.min(Math.max(tension, 0), 1)
  let r: number, g: number, b: number, a: number
  if (t < 0.1) {
    const f = t / 0.1
    r = 64 + f * 20
    g = 50 + f * 16
    b = 14 + f * 6
    a = 0.28 + f * 0.1
  } else if (t < 0.3) {
    const f = (t - 0.1) / 0.2
    r = 84 + f * 90
    g = 66 + f * 70
    b = 20 + f * 22
    a = 0.38 + f * 0.2
  } else if (t < 0.55) {
    const f = (t - 0.3) / 0.25
    r = 174 + f * 38
    g = 136 + f * 39
    b = 42 + f * 13
    a = 0.58 + f * 0.2
  } else if (t < 0.8) {
    const f = (t - 0.55) / 0.25
    r = 212 + f * 43
    g = 175 + f * 58
    b = 55 + f * 75
    a = 0.78 + f * 0.12
  } else {
    const f = (t - 0.8) / 0.2
    r = 255
    g = 233 + f * 12
    b = 130 + f * 90
    a = 0.9 + f * 0.1
  }
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b), a }
}

/**
 * Кинетическая сетка: пружинная физика узлов, волны-импульсы от краёв,
 * клик/драг по секции запускает волну от курсора. Золотая неоновая палитра.
 * Пауза вне вьюпорта; при reduced motion — один статичный кадр.
 */
export function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const parent = canvas.parentElement

    let dpr = 1
    let W = 0
    let H = 0
    let ROWS = 12
    let nodeCount = 0
    let posX = new Float32Array(0)
    let posY = new Float32Array(0)
    let velX = new Float32Array(0)
    let velY = new Float32Array(0)
    let restX = new Float32Array(0)
    let restY = new Float32Array(0)
    let springs: number[] = []
    let spacingX = 0
    let spacingY = 0
    let marginX = 0
    let marginY = 0
    const flashes: Flash[] = []
    let screenFlash = 0

    const idx = (c: number, r: number) => r * COLS + c

    const buildGrid = () => {
      ROWS = Math.max(8, Math.round(COLS * (H / Math.max(W, 1))) + 1)
      nodeCount = COLS * ROWS
      posX = new Float32Array(nodeCount)
      posY = new Float32Array(nodeCount)
      velX = new Float32Array(nodeCount)
      velY = new Float32Array(nodeCount)
      restX = new Float32Array(nodeCount)
      restY = new Float32Array(nodeCount)

      marginX = W * 0.04
      marginY = H * 0.08
      spacingX = (W - marginX * 2) / (COLS - 1)
      spacingY = (H - marginY * 2) / (ROWS - 1)

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = idx(c, r)
          restX[i] = marginX + c * spacingX
          restY[i] = marginY + r * spacingY
          posX[i] = restX[i]
          posY[i] = restY[i]
        }
      }

      springs = []
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const i = idx(c, r)
          if (c < COLS - 1) springs.push(i, idx(c + 1, r), spacingX)
          if (r < ROWS - 1) springs.push(i, idx(c, r + 1), spacingY)
        }
      }
    }

    const fit = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = canvas.getBoundingClientRect()
      W = r.width
      H = r.height
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildGrid()
      ctx.fillStyle = '#0b0a06'
      ctx.fillRect(0, 0, W, H)
    }
    fit()
    if (!W || !H) return

    const injectAt = (mx: number, my: number) => {
      const strength = 18
      const radius = 4 * Math.max(spacingX, spacingY)
      for (let i = 0; i < nodeCount; i++) {
        const dx = restX[i] - mx
        const dy = restY[i] - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < radius && dist > 0.1) {
          let falloff = 1 - dist / radius
          falloff *= falloff
          velX[i] += (dx / dist) * strength * falloff
          velY[i] += (dy / dist) * strength * falloff
        }
      }
      flashes.push({ x: mx, y: my, life: 1, ring: 1 })
      screenFlash = 0.03
    }

    const injectEdgeImpulse = () => {
      const strength = 22 + Math.random() * 14
      const edge = Math.floor(Math.random() * 4)
      const regionSize = 4 + Math.floor(Math.random() * 6)
      let flashX = 0
      let flashY = 0

      if (edge === 0 || edge === 2) {
        const row = edge === 0 ? 0 : ROWS - 1
        const dir = edge === 0 ? 1 : -1
        const start = Math.floor(Math.random() * Math.max(1, COLS - regionSize))
        flashX = marginX + (start + regionSize * 0.5) * spacingX
        flashY = marginY + row * spacingY
        for (let c = start; c < start + regionSize && c < COLS; c++) {
          let falloff = 1 - Math.abs(c - start - regionSize * 0.5) / (regionSize * 0.5)
          falloff *= falloff
          velY[idx(c, row)] += dir * strength * falloff
        }
      } else {
        const col = edge === 1 ? COLS - 1 : 0
        const dir = edge === 1 ? -1 : 1
        const start = Math.floor(Math.random() * Math.max(1, ROWS - regionSize))
        flashX = marginX + col * spacingX
        flashY = marginY + (start + regionSize * 0.5) * spacingY
        for (let r = start; r < start + regionSize && r < ROWS; r++) {
          let falloff = 1 - Math.abs(r - start - regionSize * 0.5) / (regionSize * 0.5)
          falloff *= falloff
          velX[idx(col, r)] += dir * strength * falloff
        }
      }

      flashes.push({ x: flashX, y: flashY, life: 1, ring: 1 })
      screenFlash = 0.04
    }

    const simulate = () => {
      const springCount = springs.length / 3
      for (let s = 0; s < springCount; s++) {
        const s3 = s * 3
        const a = springs[s3]
        const b = springs[s3 + 1]
        const restLen = springs[s3 + 2]
        const dx = posX[b] - posX[a]
        const dy = posY[b] - posY[a]
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 0.001) continue
        const force = (SPRING_K * (dist - restLen)) / dist
        const fx = dx * force
        const fy = dy * force
        velX[a] += fx
        velY[a] += fy
        velX[b] -= fx
        velY[b] -= fy
      }
      for (let i = 0; i < nodeCount; i++) {
        velX[i] += (restX[i] - posX[i]) * RETURN_FORCE
        velY[i] += (restY[i] - posY[i]) * RETURN_FORCE
        velX[i] *= DAMPING
        velY[i] *= DAMPING
        posX[i] += velX[i]
        posY[i] += velY[i]
      }
    }

    const draw = (time: number, dt: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(11, 10, 6, 0.35)'
      ctx.fillRect(0, 0, W, H)

      if (screenFlash > 0.001) {
        ctx.fillStyle = `rgba(212, 175, 55, ${screenFlash.toFixed(4)})`
        ctx.fillRect(0, 0, W, H)
        screenFlash *= 0.88
      }

      const tensionScale = 1 / ((spacingX + spacingY) * 0.5 * 0.35)
      const breathe = 0.85 + 0.15 * Math.sin(time * 0.8)
      const springCount = springs.length / 3

      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      // Слой 1: широкое мягкое свечение линий
      for (let s = 0; s < springCount; s++) {
        const s3 = s * 3
        const a = springs[s3]
        const b = springs[s3 + 1]
        const dx = posX[b] - posX[a]
        const dy = posY[b] - posY[a]
        const dist = Math.sqrt(dx * dx + dy * dy)
        const tension = Math.abs(dist - springs[s3 + 2]) * tensionScale
        const glowAlpha = (0.04 + tension * 0.18) * breathe
        if (glowAlpha <= 0.005) continue
        const col = tensionColor(tension)
        ctx.beginPath()
        ctx.moveTo(posX[a], posY[a])
        ctx.lineTo(posX[b], posY[b])
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${glowAlpha.toFixed(4)})`
        ctx.lineWidth = 3.5 + tension * 8
        ctx.stroke()
      }

      // Слой 2: тонкое ядро линий
      for (let s = 0; s < springCount; s++) {
        const s3 = s * 3
        const a = springs[s3]
        const b = springs[s3 + 1]
        const dx = posX[b] - posX[a]
        const dy = posY[b] - posY[a]
        const dist = Math.sqrt(dx * dx + dy * dy)
        const tension = Math.abs(dist - springs[s3 + 2]) * tensionScale
        const col = tensionColor(tension)
        const coreAlpha = Math.min((0.12 + tension * 0.6) * breathe, 1)
        ctx.beginPath()
        ctx.moveTo(posX[a], posY[a])
        ctx.lineTo(posX[b], posY[b])
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${coreAlpha.toFixed(4)})`
        ctx.lineWidth = 0.6 + tension * 1.6
        ctx.stroke()
      }

      // Слой 3: узлы + вспышки на фронте волны
      for (let i = 0; i < nodeCount; i++) {
        const speed = Math.sqrt(velX[i] * velX[i] + velY[i] * velY[i])
        const brightness = Math.min(speed * 0.2, 1)
        if (brightness < 0.02) continue

        let nr: number, ng: number, nb: number
        if (brightness < 0.25) {
          const f = brightness / 0.25
          nr = 90 + f * 60
          ng = 70 + f * 50
          nb = 20 + f * 18
        } else if (brightness < 0.6) {
          const f = (brightness - 0.25) / 0.35
          nr = 150 + f * 90
          ng = 120 + f * 85
          nb = 38 + f * 52
        } else {
          const f = (brightness - 0.6) / 0.4
          nr = 240 + f * 15
          ng = 205 + f * 45
          nb = 90 + f * 140
        }

        if (speed > 3) {
          const bloom = Math.min((speed - 3) / 15, 1)
          ctx.beginPath()
          ctx.arc(posX[i], posY[i], 4 + bloom * 12, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${Math.round(212 + bloom * 43)},${Math.round(175 + bloom * 58)},${Math.round(55 + bloom * 75)},${(bloom * 0.35).toFixed(3)})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(posX[i], posY[i], 2 + bloom * 4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 240, 190, ${(bloom * 0.6).toFixed(3)})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(posX[i], posY[i], 0.8 + brightness * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${Math.round(nr)},${Math.round(ng)},${Math.round(nb)},${(0.12 + brightness * 0.75).toFixed(3)})`
        ctx.fill()
      }

      // Слой 4: вспышки импульсов с расходящимся кольцом
      for (let fi = flashes.length - 1; fi >= 0; fi--) {
        const flash = flashes[fi]
        flash.life -= dt * 2
        flash.ring -= dt * 1.8
        if (flash.life <= 0) {
          flashes.splice(fi, 1)
          continue
        }
        const fl = flash.life
        const radius = (1 - fl) * 100 + 20
        const alpha = fl * fl * 0.8
        const grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius)
        grad.addColorStop(0, `rgba(255, 233, 168, ${alpha.toFixed(3)})`)
        grad.addColorStop(0.2, `rgba(212, 175, 55, ${(alpha * 0.6).toFixed(3)})`)
        grad.addColorStop(0.5, `rgba(140, 110, 30, ${(alpha * 0.25).toFixed(3)})`)
        grad.addColorStop(1, 'rgba(90, 70, 15, 0)')
        ctx.beginPath()
        ctx.arc(flash.x, flash.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        if (flash.ring > 0) {
          ctx.beginPath()
          ctx.arc(flash.x, flash.y, 15 + (1 - flash.ring) * 120, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(230, 190, 80, ${(flash.ring * flash.ring * 0.5).toFixed(3)})`
          ctx.lineWidth = 2 * flash.ring
          ctx.stroke()
        }
      }

      ctx.globalCompositeOperation = 'source-over'

      // Виньетка
      const maxDim = Math.max(W, H)
      const vignette = ctx.createRadialGradient(W / 2, H / 2, maxDim * 0.25, W / 2, H / 2, maxDim * 0.72)
      vignette.addColorStop(0, 'rgba(11, 10, 6, 0)')
      vignette.addColorStop(1, 'rgba(11, 10, 6, 0.6)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, W, H)
    }

    if (reduced) {
      // Один статичный кадр: сетка в покое, без слушателей и физики
      draw(0, 0)
      const onResize = () => {
        fit()
        draw(0, 0)
      }
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }

    let raf = 0
    let lastTime = 0
    let timeSinceImpulse = IMPULSE_EVERY // первая волна сразу при появлении

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      const time = now * 0.001
      let dt = lastTime === 0 ? 0.016 : time - lastTime
      if (dt > 0.1) dt = 0.016
      lastTime = time

      timeSinceImpulse += dt
      if (timeSinceImpulse >= IMPULSE_EVERY) {
        injectEdgeImpulse()
        // джиттер, чтобы волны не были метрономом
        timeSinceImpulse = -Math.random() * IMPULSE_EVERY * 0.3
      }

      simulate()
      draw(time, dt)
    }

    const start = () => {
      if (raf) return
      lastTime = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    // Пауза, когда секция вне вьюпорта
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
        : null
    if (io) io.observe(canvas)
    else start()

    // Клик/драг по секции — волна от курсора (без preventDefault: скролл не ломаем)
    let dragging = false
    const toLocal = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      dragging = true
      const p = toLocal(e)
      injectAt(p.x, p.y)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      const p = toLocal(e)
      injectAt(p.x, p.y)
    }
    const onUp = () => {
      dragging = false
    }
    const onResize = () => fit()

    parent?.addEventListener('pointerdown', onDown)
    parent?.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      io?.disconnect()
      parent?.removeEventListener('pointerdown', onDown)
      parent?.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
