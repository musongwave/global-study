import { useRef } from 'react'
import { motion } from 'framer-motion'
import { universities } from '../../data/universities'
import type { University } from '../../types/university'

interface UniversitiesProps {
  onSelectUni: (uni: University) => void
}

export function Universities({ onSelectUni }: UniversitiesProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'prev' | 'next') => {
    carouselRef.current?.scrollBy({
      left: dir === 'next' ? 300 : -300,
      behavior: 'smooth',
    })
  }

  return (
    <section id="universities" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="font-syne text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Наши университеты
          </motion.h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('prev')}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Назад"
            >
              ←
            </button>
            <button
              onClick={() => scroll('next')}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Вперёд"
            >
              →
            </button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        >
          {universities.map(uni => (
            <motion.button
              key={uni.name}
              onClick={() => onSelectUni(uni)}
              className="flex-shrink-0 w-48 p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-gold/40 transition-all snap-start"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl mb-3">{uni.flag}</div>
              <div className="text-white font-semibold text-sm leading-tight mb-1">{uni.name}</div>
              <div className="text-gold text-xs">{uni.country}</div>
              <div className="text-white/40 text-xs mt-2">Нажмите для деталей</div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-white/40 text-sm mt-6">
          И ещё более 100 топовых университетов с возможностью получить грант до 100%.
        </p>
      </div>
    </section>
  )
}
