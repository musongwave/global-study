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
              <a href="tel:+998880211122" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                📞 +998 88 021 11 22
              </a>
            </li>
            <li>
              <a
                href="mailto:globalgo@gmail.com"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                📧 globalgo@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://t.me/globalstudyuzz"
                target="_blank"
                rel="noopener"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                @globalstudyuzz
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 border-t border-gray-200 dark:border-white/10 pt-8 text-center text-gray-300 dark:text-white/30 text-sm">
        © 2025 Global Study. Все права защищены.
      </div>
    </footer>
  )
}
