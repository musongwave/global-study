import { LinkButton } from '../ui/Button'
import type { Category } from '../../types/post'

interface FooterProps {
  onCategorySelect: (cat: Category) => void
}

export function Footer({ onCategorySelect }: FooterProps) {
  return (
    <footer id="contact" className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-4">Global Study</div>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-6">
            Ваш надёжный партнёр в сфере международного образования.
          </p>
          <LinkButton
            href="https://t.me/globalstudyuzz"
            target="_blank"
            rel="noopener"
            variant="gold"
          >
            Написать в Telegram
          </LinkButton>
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Навигация</h4>
          <ul className="space-y-2 text-gray-500 dark:text-white/50 text-sm">
            <li>
              <button
                onClick={() => onCategorySelect('all')}
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Главная
              </button>
            </li>
            <li>
              <a href="#services" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Услуги
              </a>
            </li>
            <li>
              <a href="#universities" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Университеты
              </a>
            </li>
            <li>
              <button
                onClick={() => onCategorySelect('новости')}
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Новости
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-gray-900 dark:text-white font-semibold mb-4">Контакты</h4>
          <ul className="space-y-2 text-gray-500 dark:text-white/50 text-sm">
            <li>
              <a href="tel:+998880211122" className="inline-flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                +998 88 021 11 22
              </a>
            </li>
            <li>
              <a
                href="mailto:globalgo@gmail.com"
                className="inline-flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                globalgo@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://t.me/globalstudyuzz"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold flex-shrink-0">
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                @globalstudyuzz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 border-t border-gray-200 dark:border-white/10 pt-8 text-center text-gray-300 dark:text-white/30 text-sm">
        © {new Date().getFullYear()} Global Study. Все права защищены.
      </div>
    </footer>
  )
}
