import { motion } from 'framer-motion'

const SERVICES = [
  {
    icon: '🎓',
    title: 'Подбор университета',
    desc: 'Анализируем ваш профиль и находим идеальные варианты в США, Канаде, Европе и Азии.',
  },
  {
    icon: '💰',
    title: 'Помощь со стипендиями',
    desc: 'Помогаем получить гранты и стипендии, покрывающие до 100% стоимости обучения.',
  },
  {
    icon: '✈️',
    title: 'Визовая поддержка',
    desc: 'Полное сопровождение в подготовке документов и прохождении интервью в посольстве.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Наши услуги
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/40 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-4xl mb-6">{s.icon}</div>
              <h3 className="font-syne text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
