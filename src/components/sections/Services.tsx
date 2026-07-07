import { motion } from 'framer-motion'

function IconUniversity() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3L2 8l10 5 10-5-10-5z" />
      <path d="M2 8v8" />
      <path d="M22 8v8" />
      <path d="M6 10.6V18a6 6 0 0012 0v-7.4" />
    </svg>
  )
}

function IconScholarship() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconVisa() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h2" />
      <path d="M10 15h4" />
    </svg>
  )
}

const SERVICES = [
  {
    Icon: IconUniversity,
    title: 'Подбор университета',
    desc: 'Анализируем ваш профиль и находим идеальные варианты в США, Канаде, Европе и Азии.',
  },
  {
    Icon: IconScholarship,
    title: 'Помощь со стипендиями',
    desc: 'Помогаем получить гранты и стипендии, покрывающие до 100% стоимости обучения.',
  },
  {
    Icon: IconVisa,
    title: 'Визовая поддержка',
    desc: 'Полное сопровождение в подготовке документов и прохождении интервью в посольстве.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center"
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="liquid-glass h-full p-8 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm hover:border-gold/40">
                <div className="text-gold mb-6">
                  <s.Icon />
                </div>
                <h3 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-3">{s.title}</h3>
                <p className="text-gray-500 dark:text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
