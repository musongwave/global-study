import { motion } from 'framer-motion'

const STEPS = [
  { icon: '💬', title: 'Бесплатная консультация', desc: 'Обсуждаем цели, бюджет и предпочтения. Подбираем страны и программы под ваш профиль.' },
  { icon: '📋', title: 'Подготовка документов', desc: 'Помогаем собрать портфолио, написать мотивационное письмо и перевести документы.' },
  { icon: '🎯', title: 'Подача заявок', desc: 'Отправляем заявки в выбранные университеты и отслеживаем статус каждой.' },
  { icon: '🎉', title: 'Зачисление и въезд', desc: 'Поздравляем с оффером, помогаем с визой и подготовкой к переезду.' },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Как мы работаем
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Четыре шага от первого разговора до зачисления
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gold/20" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-3xl mb-4 relative z-10">
                {step.icon}
              </div>
              <span className="text-xs text-gold font-semibold mb-2">Шаг {i + 1}</span>
              <h3 className="font-syne font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
