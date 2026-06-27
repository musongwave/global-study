import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LinkButton } from '../ui/Button'

interface HeroProps {
  isDark: boolean
}

export function Hero({ isDark }: HeroProps) {
  const bgRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<{ destroy(): void } | null>(null)

  useEffect(() => {
    if (!bgRef.current) return
    let mounted = true

    effectRef.current?.destroy()
    effectRef.current = null

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    import('vanta/dist/vanta.globe.min').then(mod => {
      if (!mounted || !bgRef.current) return
      effectRef.current = mod.default({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xd4af37,
        color2: isDark ? 0x2a2a2a : 0xbbbbbb,
        size: 1.5,
        backgroundColor: isDark ? 0x0a0a0a : 0xf0f4f8,
      })
    })

    return () => {
      mounted = false
      effectRef.current?.destroy()
    }
  }, [isDark])

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0" />
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black/20 via-transparent to-black/60' : 'bg-gradient-to-b from-white/40 via-white/10 to-white/60'}`} />
      <div className="relative z-10 container mx-auto px-6 py-32 pt-40">
        <p className="text-gold font-syne text-sm font-semibold tracking-widest uppercase mb-4">
          Агентство международного образования
        </p>
        <h1 className={`font-syne text-5xl md:text-7xl font-bold leading-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Обучение за рубежом
          <br />
          с гарантированной
          <br />
          поддержкой
        </h1>
        <p className={`text-lg max-w-xl mb-10 leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
          Ваш путь в топовые университеты мира. Гранты, визовое сопровождение и поддержка на каждом
          этапе.
        </p>
        <div className="flex flex-wrap gap-4">
          <LinkButton href="#contact" variant={isDark ? 'light' : 'gold'}>
            Начать путь
          </LinkButton>
          <LinkButton href="#universities" variant={isDark ? 'outline-light' : 'outline-gold'}>
            Университеты
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
