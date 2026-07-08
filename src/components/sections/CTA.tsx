import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'
import { KineticGrid } from './KineticGrid'

export function CTA() {
  return (
    <section className="relative overflow-hidden py-28 bg-[#0b0a06] border-y border-white/10">
      <KineticGrid />
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase mb-3">
            Telegram-канал
          </p>
          <h2 className="font-syne text-4xl font-bold tracking-tight text-balance text-white mb-4">
            Не пропускай новые посты
          </h2>
          <p className="text-white/70 mb-8">
            Подпишись на Telegram-канал и получай актуальную информацию первым
          </p>
          <LinkButton
            href="https://t.me/globalstudyuzz"
            target="_blank"
            rel="noopener"
            variant="gold"
          >
            Открыть Telegram
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
