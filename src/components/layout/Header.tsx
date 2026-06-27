import { useEffect, useState } from 'react'
import { LinkButton } from '../ui/Button'
import type { Category } from '../../types/post'

interface HeaderProps {
  onMenuToggle: () => void
  menuOpen: boolean
  onCategorySelect: (cat: Category) => void
  isDark: boolean
  onThemeToggle: () => void
}

export function Header({ onMenuToggle, menuOpen, onCategorySelect, isDark, onThemeToggle }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const sections = ['hero', 'services', 'universities', 'posts']
    const observers: IntersectionObserver[] = []

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  const navCls = (id: string) =>
    `transition-colors ${
      activeSection === id
        ? 'text-gold'
        : 'text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
    }`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur shadow-sm dark:shadow-none' : ''
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-syne text-xl font-bold text-gray-900 dark:text-white">
          Global Study
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <button
            onClick={() => onCategorySelect('all')}
            className={navCls('hero')}
          >
            Главная
          </button>
          <a href="#services" className={navCls('services')}>
            Услуги
          </a>
          <a href="#universities" className={navCls('universities')}>
            Университеты
          </a>
          <button
            onClick={() => onCategorySelect('новости')}
            className={navCls('posts')}
          >
            Новости
          </button>
          <a href="#contact" className="text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors">
            Контакты
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-full text-gray-400 hover:text-gold dark:text-white/60 dark:hover:text-gold transition-colors"
            aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
          >
            {isDark ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>
          <LinkButton
            href="https://t.me/globalstudyuzz"
            target="_blank"
            rel="noopener"
            variant="gold"
            className="hidden md:inline-flex text-xs px-4 py-2"
          >
            Подписаться
          </LinkButton>
          <button
            onClick={onMenuToggle}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
