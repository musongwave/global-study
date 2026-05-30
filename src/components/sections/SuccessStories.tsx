import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

const STORIES = [
  {
    name: 'Алия М.',
    location: 'Казахстан',
    university: 'TU Berlin, Германия',
    quote: 'Global Study помогли мне с мотивационным письмом и языковыми требованиями. Получила оффер за 3 месяца!',
    initials: 'АМ',
    color: 'bg-blue-500',
  },
  {
    name: 'Дмитрий К.',
    location: 'Украина',
    university: 'University of Warsaw, Польша',
    quote: 'Команда сопровождала меня на каждом шагу — от выбора программы до получения студенческой визы.',
    initials: 'ДК',
    color: 'bg-emerald-500',
  },
  {
    name: 'Нилуфар Р.',
    location: 'Узбекистан',
    university: 'Charles University, Чехия',
    quote: 'Даже не верила, что смогу поступить на грант. Global Study показали, что это реально.',
    initials: 'НР',
    color: 'bg-gold',
  },
  {
    name: 'Сергей Л.',
    location: 'Беларусь',
    university: 'Corvinus University, Венгрия',
    quote: 'Грамотная помощь с документами и подготовка к интервью — всё прошло идеально.',
    initials: 'СЛ',
    color: 'bg-purple-500',
  },
  {
    name: 'Мадина Т.',
    location: 'Кыргызстан',
    university: 'Masaryk University, Чехия',
    quote: 'Получила Erasmus+ стипендию. Без Global Study я бы не знала с чего начать.',
    initials: 'МТ',
    color: 'bg-rose-500',
  },
  {
    name: 'Арман Б.',
    location: 'Казахстан',
    university: 'Vilnius University, Литва',
    quote: 'Всё организовано чётко: сроки, документы, визовый центр. Никакого стресса.',
    initials: 'АБ',
    color: 'bg-amber-500',
  },
]

export function SuccessStories() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Истории успеха
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Более 3 000 студентов из СНГ уже учатся в топовых университетах мира
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {s.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 dark:text-white/40">{s.location} → {s.university}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">«{s.quote}»</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <LinkButton href="https://t.me/Globalstudyy" target="_blank" rel="noopener noreferrer" variant="gold">
            Начать свой путь
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
