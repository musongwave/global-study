import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-100 via-white to-gray-100 dark:from-zinc-900 dark:via-black dark:to-zinc-900 border-y border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Не пропускай новые посты
          </h2>
          <p className="text-gray-500 dark:text-white/60 mb-8">
            Подпишись на Telegram-канал и получай актуальную информацию первым
          </p>
          <LinkButton
            href="https://t.me/Globalstudyy"
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
