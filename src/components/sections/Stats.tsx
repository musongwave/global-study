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
      className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/40 transition-colors cursor-default"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="font-syne text-4xl font-bold text-gold whitespace-nowrap">
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div className="text-white/60 text-sm mt-2">{label}</div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="py-16 bg-zinc-950">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <StatCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}
