import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePosts, usePostCounts } from '../../hooks/usePosts'
import { Pill } from '../ui/Pill'
import { LinkButton } from '../ui/Button'
import { SectionHeading } from '../ui/SectionHeading'
import type { Category, Post } from '../../types/post'

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Новости', value: 'новости' },
  { label: 'Образование', value: 'образование' },
  { label: 'Возможности', value: 'возможности' },
  { label: 'Ресурсы', value: 'ресурсы' },
]

const BADGE_COLORS: Record<string, string> = {
  новости: 'bg-blue-950/60 text-blue-200',
  образование: 'bg-emerald-950/60 text-emerald-200',
  возможности: 'bg-[#3a2f10]/60 text-[#ffe9a8]',
  ресурсы: 'bg-purple-950/60 text-purple-200',
}

const CATEGORY_ICONS: Record<string, string> = {
  новости: '📰',
  образование: '🎓',
  возможности: '🌟',
  ресурсы: '📚',
}

interface PostsProps {
  activeCategory: Category
  searchQuery: string
  onCategoryChange: (cat: Category) => void
  onSearchChange: (q: string) => void
  onSelectPost: (post: Post) => void
}

export function Posts({
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onSelectPost,
}: PostsProps) {
  const [visibleCount, setVisibleCount] = useState(6)
  const posts = usePosts(activeCategory, searchQuery)
  const counts = usePostCounts(searchQuery)
  const visiblePosts = posts.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(6)
  }, [activeCategory, searchQuery])

  return (
    <section id="posts" className="py-24 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <SectionHeading
          kicker="Из Telegram-канала"
          title="Актуальные предложения и новости"
          className="mb-8"
        />

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Pill
                key={cat.value}
                active={activeCategory === cat.value}
                onClick={() => onCategoryChange(cat.value)}
              >
                {cat.label}
                {counts[cat.value] !== undefined && (
                  <span className="ml-1 opacity-60 text-xs">({counts[cat.value]})</span>
                )}
              </Pill>
            ))}
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Поиск по постам..."
            aria-label="Поиск по постам"
            className="flex-1 bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-2 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/40"
          />
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-white/40 py-16">
            Ничего не найдено. Попробуй другой запрос.
          </p>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence mode="popLayout">
              {visiblePosts.map(post => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="liquid-glass h-full flex flex-col rounded-2xl bg-black/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden hover:border-gold/30">
                    <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-900">
                      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="text-5xl opacity-20">{CATEGORY_ICONS[post.category] ?? '📖'}</span>
                      </div>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                      <span
                        className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          BADGE_COLORS[post.category] ?? 'bg-black/50 text-white'
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <time className="text-gray-400 dark:text-white/40 text-xs">
                        {new Date(post.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                      <h3 className="font-syne font-bold text-gray-900 dark:text-white mt-1 mb-2 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 dark:text-white/50 text-sm mb-4 line-clamp-2">{post.preview}</p>
                      <button
                        onClick={() => onSelectPost(post)}
                        className="mt-auto self-start text-gold text-sm font-medium border border-gold/40 px-4 py-1.5 rounded-full hover:bg-gold hover:text-black transition-all"
                      >
                        Подробно
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {visibleCount < posts.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount(n => n + 6)}
              className="px-6 py-2.5 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors"
            >
              Показать ещё ({posts.length - visibleCount})
            </button>
          </div>
        )}

        <div className="text-center mt-12">
          <LinkButton
            href="https://t.me/globalstudyuzz"
            target="_blank"
            rel="noopener"
            variant="gold"
          >
            Все новости в Telegram-канале
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
