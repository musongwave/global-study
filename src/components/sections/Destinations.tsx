import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function Destinations() {
  return (
    <section id="destinations" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-white mb-6">
            Топовые направления
          </h2>
          <p className="text-white/60 mb-4 leading-relaxed">
            Открываем двери в лучшие учебные заведения мира. США, Канада, Италия, Германия, Южная
            Корея, Польша, Венгрия, Япония.
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">
            Каждая страна предлагает уникальные карьерные возможности и программы финансирования для
            иностранных студентов.
          </p>
          <LinkButton href="#contact" variant="gold">
            Получить консультацию
          </LinkButton>
        </motion.div>
        <motion.img
          src="assets/university_campus_1777027031669.png"
          alt="Кампус университета"
          className="rounded-2xl object-cover w-full h-80"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  )
}
