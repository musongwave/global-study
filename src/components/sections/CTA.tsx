import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24 bg-gray-50 dark:bg-zinc-950 border-y border-gray-200 dark:border-white/10">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(640px 320px at 50% 0%, rgba(212,175,55,0.12), transparent 70%)',
        }}
      />
      <div className="container mx-auto px-6 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase mb-3">
            Telegram-канал
          </p>
          <h2 className="font-syne text-4xl font-bold tracking-tight text-balance text-gray-900 dark:text-white mb-4">
            Не пропускай новые посты
          </h2>
          <p className="text-gray-500 dark:text-white/60 mb-8">
            Подпишись на Telegram-канал и получай актуальную информацию первым
          </p>
          <LinkButton
            href="https://t.me/globalstudyuzz"
            target="_blank"
            rel="noopener"
            variant="light"
          >
            Открыть Telegram
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
