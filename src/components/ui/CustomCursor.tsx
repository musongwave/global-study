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
