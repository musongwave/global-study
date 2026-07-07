import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

interface SectionHeadingProps {
  kicker: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center'
  return (
    <motion.div
      className={cn(centered && 'text-center', className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase mb-3">{kicker}</p>
      <h2 className="font-syne text-4xl font-bold tracking-tight text-balance text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-gray-500 dark:text-white/60 mt-4', centered && 'max-w-xl mx-auto')}>
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
