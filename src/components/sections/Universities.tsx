import { useRef } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '../ui/SectionHeading'
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
    <section id="universities" className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <SectionHeading kicker="Партнёры" title="Наши университеты" align="left" />
          <div className="flex gap-2">
            <button
              onClick={() => scroll('prev')}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Назад"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scroll('next')}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Вперёд"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
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
              className="liquid-glass flex-shrink-0 w-48 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-left hover:border-gold/40 snap-start"
            >
              <div className="text-3xl mb-3">{uni.flag}</div>
              <div className="text-gray-900 dark:text-white font-semibold text-sm leading-tight mb-1">{uni.name}</div>
              <div className="text-gold text-xs">{uni.country}</div>
              <div className="text-gray-400 dark:text-white/40 text-xs mt-2">Нажмите для деталей</div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-gray-400 dark:text-white/40 text-sm mt-6">
          И ещё более 100 топовых университетов с возможностью получить грант до 100%.
        </p>
      </div>
    </section>
  )
}
