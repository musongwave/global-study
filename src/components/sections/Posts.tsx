import { motion, AnimatePresence } from 'framer-motion'
import { usePosts } from '../../hooks/usePosts'
import { Pill } from '../ui/Pill'
import { LinkButton } from '../ui/Button'
import type { Category, Post } from '../../types/post'

const CATEGORIES: { label: string; value: Category }[] = [
  { label: 'Все', value: 'all' },
  { label: 'Новости', value: 'новости' },
  { label: 'Образование', value: 'образование' },
  { label: 'Возможности', value: 'возможности' },
  { label: 'Ресурсы', value: 'ресурсы' },
]

const BADGE_COLORS: Record<string, string> = {
  новости: 'bg-blue-500/20 text-blue-300',
  образование: 'bg-green-500/20 text-green-300',
  возможности: 'bg-gold/20 text-gold',
  ресурсы: 'bg-purple-500/20 text-purple-300',
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
  const posts = usePosts(activeCategory, searchQuery)

  return (
    <section id="posts" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Актуальные предложения и новости
        </motion.h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Pill
                key={cat.value}
                active={activeCategory === cat.value}
                onClick={() => onCategoryChange(cat.value)}
              >
                {cat.label}
              </Pill>
            ))}
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Поиск по постам..."
            aria-label="Поиск по постам"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-gold/40"
          />
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-white/40 py-16">
            Ничего не найдено. Попробуй другой запрос.
          </p>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence mode="popLayout">
              {posts.map(post => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-gold/30 transition-all"
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        BADGE_COLORS[post.category] ?? 'bg-white/10 text-white'
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <time className="text-white/40 text-xs">
                      {new Date(post.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                    <h3 className="font-syne font-bold text-white mt-1 mb-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-4 line-clamp-2">{post.preview}</p>
                    <button
                      onClick={() => onSelectPost(post)}
                      className="text-gold text-sm font-medium border border-gold/40 px-4 py-1.5 rounded-full hover:bg-gold hover:text-black transition-all"
                    >
                      Подробно
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <div className="text-center mt-12">
          <LinkButton
            href="https://t.me/Globalstudyy"
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
