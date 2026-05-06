import { useEffect, useState } from 'react'
import { LinkButton } from '../ui/Button'
import type { Category } from '../../types/post'

interface HeaderProps {
  onMenuToggle: () => void
  menuOpen: boolean
  onCategorySelect: (cat: Category) => void
}

export function Header({ onMenuToggle, menuOpen, onCategorySelect }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : ''
      }`}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-syne text-xl font-bold text-white">
          Global Study
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          <button
            onClick={() => onCategorySelect('all')}
            className="hover:text-white transition-colors"
          >
            Главная
          </button>
          <a href="#services" className="hover:text-white transition-colors">
            Услуги
          </a>
          <a href="#universities" className="hover:text-white transition-colors">
            Университеты
          </a>
          <button
            onClick={() => onCategorySelect('новости')}
            className="hover:text-white transition-colors"
          >
            Новости
          </button>
          <a href="#contact" className="hover:text-white transition-colors">
            Контакты
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <LinkButton
            href="https://t.me/Globalstudyy"
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
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  )
}
