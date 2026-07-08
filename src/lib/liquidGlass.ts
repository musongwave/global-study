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
    for (const prop of ['transform', '--lg-px', '--lg-py']) {
      el.style.removeProperty(prop)
    }
  }

  const onOver = (e: MouseEvent) => {
    const el = (e.target as Element | null)?.closest?.('.liquid-glass') as HTMLElement | null
    if (!el || el === active) return
    if (active) reset(active)
    active = el
    el.classList.add('lg-active')
    el.style.transform = 'perspective(900px) scale(1.05)'
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
      const rx = ((py - 0.5) * -TILT_X_MAX).toFixed(2)
      const ry = ((px - 0.5) * TILT_Y_MAX).toFixed(2)
      // transform напрямую — без пересчёта стилей поддерева через CSS-переменные;
      // переменные остаются только для позиции блика ::after
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.05)`
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
