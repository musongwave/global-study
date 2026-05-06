import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function SuccessStories() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.img
          src={`${import.meta.env.BASE_URL}assets/student_success_1777027045477.png`}
          alt="Истории успеха студентов"
          className="rounded-2xl object-cover w-full h-80 order-last md:order-first"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-white mb-6">Истории успеха</h2>
          <p className="text-white/60 mb-4 leading-relaxed">
            Более 3 000 наших студентов уже учатся в престижных университетах мира, строят
            международную карьеру и расширяют свои горизонты.
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">
            Присоединяйтесь к сообществу Global Study и сделайте первый шаг к своему успешному
            будущему.
          </p>
          <LinkButton href="#contact" variant="gold">
            Начать путь
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
