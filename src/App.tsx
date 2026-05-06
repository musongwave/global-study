import { useState, useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { MobileMenu } from './components/layout/MobileMenu'
import { Hero } from './components/sections/Hero'
import { Stats } from './components/sections/Stats'
import { Services } from './components/sections/Services'
import { Destinations } from './components/sections/Destinations'
import { Universities } from './components/sections/Universities'
import { Posts } from './components/sections/Posts'
import { SuccessStories } from './components/sections/SuccessStories'
import { CTA } from './components/sections/CTA'
import { Modal } from './components/ui/Modal'
import { LinkButton } from './components/ui/Button'
import type { Post, Category } from './types/post'
import type { University } from './types/university'

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [selectedUni, setSelectedUni] = useState<University | null>(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const handleCategorySelect = (cat: Category) => {
    setActiveCategory(cat)
    setSearchQuery('')
    setMobileMenuOpen(false)
    document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header
        onMenuToggle={() => setMobileMenuOpen(o => !o)}
        menuOpen={mobileMenuOpen}
        onCategorySelect={handleCategorySelect}
        isDark={isDark}
        onThemeToggle={() => setIsDark(d => !d)}
      />
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onCategorySelect={handleCategorySelect}
      />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Destinations />
        <Universities onSelectUni={setSelectedUni} />
        <Posts
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchQuery}
          onSelectPost={setSelectedPost}
        />
        <SuccessStories />
        <CTA />
      </main>
      <Footer onCategorySelect={handleCategorySelect} />

      <Modal isOpen={selectedUni !== null} onClose={() => setSelectedUni(null)}>
        {selectedUni && (
          <div>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedUni.flag} {selectedUni.name}
            </h2>
            <p className="text-gold text-sm mb-4">{selectedUni.country}</p>
            <p className="text-gray-500 dark:text-white/70 mb-3">{selectedUni.description}</p>
            <p className="text-gray-500 dark:text-white/70">
              <strong className="text-gray-900 dark:text-white">Финансирование: </strong>
              {selectedUni.funding}
            </p>
            <div className="mt-6 text-center">
              <LinkButton
                href="https://t.me/Globalstudyy"
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
              >
                Получить консультацию
              </LinkButton>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={selectedPost !== null} onClose={() => setSelectedPost(null)}>
        {selectedPost && (
          <div>
            <p className="text-gold text-xs mb-3">
              {new Date(selectedPost.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' · '}
              {selectedPost.category}
            </p>
            <h2 className="font-syne text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedPost.title}
            </h2>
            <div className="text-gray-500 dark:text-white/70 space-y-3 max-h-80 overflow-y-auto pr-2">
              {selectedPost.text
                .split('\n')
                .filter(l => l.trim())
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
            <div className="mt-6">
              <LinkButton
                href={selectedPost.tg_link}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-gold"
              >
                Читать в Telegram
              </LinkButton>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
