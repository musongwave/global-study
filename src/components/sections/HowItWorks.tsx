import { motion } from 'framer-motion'

function IconChat() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function IconClipboard() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function IconTarget() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function IconCheckCircle() {
  return (
    <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

const STEPS = [
  { Icon: IconChat, title: 'Бесплатная консультация', desc: 'Обсуждаем цели, бюджет и предпочтения. Подбираем страны и программы под ваш профиль.' },
  { Icon: IconClipboard, title: 'Подготовка документов', desc: 'Помогаем собрать портфолио, написать мотивационное письмо и перевести документы.' },
  { Icon: IconTarget, title: 'Подача заявок', desc: 'Отправляем заявки в выбранные университеты и отслеживаем статус каждой.' },
  { Icon: IconCheckCircle, title: 'Зачисление и въезд', desc: 'Поздравляем с оффером, помогаем с визой и подготовкой к переезду.' },
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
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4 relative z-10">
                <step.Icon />
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
