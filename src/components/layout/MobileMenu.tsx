import { motion, AnimatePresence } from 'framer-motion'
import type { Category } from '../../types/post'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (cat: Category) => void
}

export function MobileMenu({ isOpen, onClose, onCategorySelect }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-white dark:bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col items-center gap-8 text-2xl font-syne font-bold text-gray-900 dark:text-white">
            <button
              onClick={() => onCategorySelect('all')}
              className="hover:text-gold transition-colors"
            >
              главная
            </button>
            <a
              href="#services"
              onClick={onClose}
              className="hover:text-gold transition-colors"
            >
              услуги
            </a>
            <a
              href="#universities"
              onClick={onClose}
              className="hover:text-gold transition-colors"
            >
              университеты
            </a>
            <button
              onClick={() => onCategorySelect('новости')}
              className="hover:text-gold transition-colors"
            >
              новости
            </button>
            <a
              href="#contact"
              onClick={onClose}
              className="hover:text-gold transition-colors"
            >
              контакты
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
