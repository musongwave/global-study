import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'

interface StatItem {
  value: number
  suffix: string
  label: string
}

const STATS: StatItem[] = [
  { value: 5, suffix: '+', label: 'лет опыта' },
  { value: 3000, suffix: '+', label: 'студентов' },
  { value: 30, suffix: '+', label: 'стран мира' },
  { value: 100, suffix: '%', label: 'помощь с грантами' },
]

function StatCounter({ value, suffix, label }: StatItem) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView || !numRef.current) return
    const node = numRef.current

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = value.toLocaleString('ru-RU')
      return
    }

    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString('ru-RU')
      },
    })
    return () => controls.stop()
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      className="liquid-glass text-center p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40 cursor-default"
    >
      <div className="font-syne text-4xl md:text-5xl font-extrabold tracking-tight tabular-nums whitespace-nowrap bg-gradient-to-b from-[#c9a22e] to-[#8a6d1f] dark:from-[#ffe9a8] dark:to-gold bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]">
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div className="text-gray-500 dark:text-white/60 text-sm mt-2">{label}</div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <StatCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}
