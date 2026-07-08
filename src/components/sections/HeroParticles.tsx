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
      if (!w || !h) return
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
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    // Пауза, когда hero вне вьюпорта — не жжём CPU при чтении нижних секций
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
        : null
    if (io) io.observe(canvas)
    else start()

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
      stop()
      io?.disconnect()
      parent?.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}
