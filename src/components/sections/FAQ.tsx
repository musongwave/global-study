import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'Сколько стоят ваши услуги?',
    a: 'Первичная консультация бесплатна. Стоимость полного сопровождения зависит от программы и страны — уточните в Telegram после консультации.',
  },
  {
    q: 'Какие сроки поступления?',
    a: 'В среднем от 2 до 6 месяцев с момента первого обращения до получения оффера. Рекомендуем начинать за 6–12 месяцев до желаемой даты начала учёбы.',
  },
  {
    q: 'Помогаете ли с оформлением визы?',
    a: 'Да. Мы помогаем собрать пакет документов, консультируем по типам виз и сопровождаем на всех этапах визового процесса.',
  },
  {
    q: 'Какой уровень языка нужен для поступления?',
    a: 'Зависит от страны и программы. Для большинства программ на английском нужен IELTS 6.0–6.5 или TOEFL 80+. Для программ на немецком/польском/чешском — соответствующие сертификаты. Поможем подготовиться.',
  },
  {
    q: 'Вы гарантируете поступление?',
    a: 'Гарантировать решение университета не может никто. Но мы максимизируем шансы: подбираем подходящие программы, готовим сильное досье и подаём сразу в несколько вузов.',
  },
  {
    q: 'В какие страны вы помогаете поступить?',
    a: 'Германия, Польша, Чехия, Венгрия, Литва, Нидерланды, Великобритания, Канада и другие страны. Полный список — на консультации.',
  },
  {
    q: 'Какие документы нужны для подачи?',
    a: 'Базовый пакет: диплом/аттестат с переводом, языковой сертификат, мотивационное письмо, рекомендательные письма (1–2), резюме. Конкретный список зависит от программы.',
  },
  {
    q: 'Что входит в полное сопровождение?',
    a: 'Выбор университетов и программ, подготовка мотивационного письма и резюме, сбор и проверка документов, подача заявок, коммуникация с университетом, помощь с визой и переездом.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Частые вопросы
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Если не нашли ответ — напишите нам в Telegram
        </motion.p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span>{faq.q}</span>
                <svg
                  aria-hidden="true"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`flex-shrink-0 ml-4 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    id={`faq-answer-${i}`}
                    role="region"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
