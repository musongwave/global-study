# 9 улучшений Global Study — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать 9 улучшений сайта Global Study: UX-мелочи (счётчики, активное меню, кнопка «Наверх»), новые секции (HowItWorks, FAQ, переработка SuccessStories) и технические улучшения (lazy loading, OG-теги, PWA manifest).

**Architecture:** Каждое улучшение — изолированное изменение одного файла или нового компонента. Новые секции добавляются в `App.tsx`. Никаких новых зависимостей — только React state, Framer Motion (уже есть), IntersectionObserver (браузерный API).

**Tech Stack:** Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion

---

## Карта файлов

| Файл | Действие |
|------|----------|
| `src/components/ui/ScrollToTop.tsx` | создать |
| `src/components/sections/HowItWorks.tsx` | создать |
| `src/components/sections/FAQ.tsx` | создать |
| `src/components/sections/SuccessStories.tsx` | переработать |
| `src/components/sections/Posts.tsx` | добавить счётчики + lazy loading |
| `src/components/layout/Header.tsx` | добавить active nav |
| `src/App.tsx` | добавить новые секции + ScrollToTop |
| `index.html` | OG-теги + manifest link |
| `public/manifest.json` | создать |

---

## Task 1: ScrollToTop — кнопка «Наверх»

**Files:**
- Create: `src/components/ui/ScrollToTop.tsx`
- Modify: `src/App.tsx`

- [ ] **Создать компонент**

```tsx
// src/components/ui/ScrollToTop.tsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center shadow-lg hover:bg-gold/90 transition-colors"
          aria-label="Наверх"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Добавить в App.tsx** — импортировать `ScrollToTop` и разместить внутри фрагмента рядом с `<Footer>`:

```tsx
import { ScrollToTop } from './components/ui/ScrollToTop'

// внутри return <>...</>  после </Footer>:
<ScrollToTop />
```

- [ ] **Проверить** — `bun run dev`, прокрутить страницу вниз: кнопка появляется, клик возвращает наверх.

- [ ] **Коммит**

```bash
git add src/components/ui/ScrollToTop.tsx src/App.tsx
git commit -m "feat: кнопка «Наверх»"
```

---

## Task 2: Активный пункт меню при скролле

**Files:**
- Modify: `src/components/layout/Header.tsx`

Секции с id на странице: `hero` (добавить в Hero.tsx), `services`, `universities`, `posts`.

- [ ] **Добавить id="hero" в Hero.tsx**

В `src/components/sections/Hero.tsx` найти корневой `<section>` и добавить `id="hero"`:
```tsx
<section id="hero" className="...">
```

- [ ] **Добавить state активного пункта в Header.tsx**

В начало компонента `Header` добавить state и IntersectionObserver:

```tsx
const [activeSection, setActiveSection] = useState<string>('')

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
```

- [ ] **Применить стиль к nav-ссылкам**

Заменить className у каждой nav-ссылки, добавив условие активности. Вспомогательная функция:

```tsx
const navCls = (id: string) =>
  `transition-colors ${
    activeSection === id
      ? 'text-gold'
      : 'text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
  }`
```

Обновить ссылки:
```tsx
<button onClick={() => onCategorySelect('all')} className={navCls('hero')}>Главная</button>
<a href="#services" className={navCls('services')}>Услуги</a>
<a href="#universities" className={navCls('universities')}>Университеты</a>
<button onClick={() => onCategorySelect('новости')} className={navCls('posts')}>Новости</button>
<a href="#contact" className="text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors">Контакты</a>
```

- [ ] **Проверить** — при скролле до Services, Universities, Posts соответствующий пункт подсвечивается золотым.

- [ ] **Коммит**

```bash
git add src/components/layout/Header.tsx src/components/sections/Hero.tsx
git commit -m "feat: активный пункт меню при скролле"
```

---

## Task 3: Счётчики категорий в Posts

**Files:**
- Modify: `src/hooks/usePosts.ts`
- Modify: `src/components/sections/Posts.tsx`

- [ ] **Добавить хук usePostCount в usePosts.ts**

В конец файла `src/hooks/usePosts.ts` добавить:

```ts
export function usePostCounts(query: string): Record<string, number> {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    const counts: Record<string, number> = { all: 0 }
    posts.forEach(post => {
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      if (matchSearch) {
        counts.all = (counts.all || 0) + 1
        counts[post.category] = (counts[post.category] || 0) + 1
      }
    })
    return counts
  }, [query])
}
```

- [ ] **Использовать в Posts.tsx**

Импортировать `usePostCounts` и добавить вызов:

```tsx
import { usePosts, usePostCounts } from '../../hooks/usePosts'

// внутри компонента Posts:
const counts = usePostCounts(searchQuery)
```

Обновить рендер `Pill` чтобы показывал счётчик:

```tsx
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
```

- [ ] **Проверить** — у каждой категории отображается количество постов, при поиске цифры обновляются.

- [ ] **Коммит**

```bash
git add src/hooks/usePosts.ts src/components/sections/Posts.tsx
git commit -m "feat: счётчики категорий в фильтре постов"
```

---

## Task 4: Lazy loading постов

**Files:**
- Modify: `src/components/sections/Posts.tsx`

- [ ] **Добавить state visibleCount**

В компонент `Posts` добавить:

```tsx
const [visibleCount, setVisibleCount] = useState(6)
```

- [ ] **Сбрасывать при смене фильтра**

Добавить `useEffect`:

```tsx
useEffect(() => {
  setVisibleCount(6)
}, [activeCategory, searchQuery])
```

- [ ] **Slice посты и добавить кнопку «Показать ещё»**

Заменить `posts` на `posts.slice(0, visibleCount)` в grid, и добавить кнопку после grid:

```tsx
// в начале компонента:
const visiblePosts = posts.slice(0, visibleCount)

// рендер карточек — итерировать по visiblePosts вместо posts

// после закрытия grid:
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
```

- [ ] **Проверить** — при первом рендере видно 6 постов, кнопка «Показать ещё (N)» показывает остаток, клик добавляет 6, при смене категории сбрасывается до 6.

- [ ] **Коммит**

```bash
git add src/components/sections/Posts.tsx
git commit -m "feat: lazy loading постов по 6 штук"
```

---

## Task 5: Секция HowItWorks

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`
- Modify: `src/App.tsx`

- [ ] **Создать компонент**

```tsx
// src/components/sections/HowItWorks.tsx
import { motion } from 'framer-motion'

const STEPS = [
  { icon: '💬', title: 'Бесплатная консультация', desc: 'Обсуждаем цели, бюджет и предпочтения. Подбираем страны и программы под ваш профиль.' },
  { icon: '📋', title: 'Подготовка документов', desc: 'Помогаем собрать портфолио, написать мотивационное письмо и перевести документы.' },
  { icon: '🎯', title: 'Подача заявок', desc: 'Отправляем заявки в выбранные университеты и отслеживаем статус каждой.' },
  { icon: '🎉', title: 'Зачисление и въезд', desc: 'Поздравляем с оффером, помогаем с визой и подготовкой к переезду.' },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Как мы работаем
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Четыре шага от первого разговора до зачисления
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Линия между шагами — только десктоп */}
          <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gold/20" />

          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center text-3xl mb-4 relative z-10">
                {step.icon}
              </div>
              <span className="text-xs text-gold font-semibold mb-2">Шаг {i + 1}</span>
              <h3 className="font-syne font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Добавить в App.tsx** — после `<Services />`, перед `<Destinations />`:

```tsx
import { HowItWorks } from './components/sections/HowItWorks'

// в <main>:
<Services />
<HowItWorks />
<Destinations />
```

- [ ] **Проверить** — секция отображается между «Услуги» и «Направления», 4 шага с иконками, на мобиле вертикально.

- [ ] **Коммит**

```bash
git add src/components/sections/HowItWorks.tsx src/App.tsx
git commit -m "feat: секция «Как мы работаем»"
```

---

## Task 6: Переработка SuccessStories

**Files:**
- Modify: `src/components/sections/SuccessStories.tsx`

- [ ] **Заменить содержимое компонента**

```tsx
// src/components/sections/SuccessStories.tsx
import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

const STORIES = [
  {
    name: 'Алия М.',
    location: 'Казахстан',
    university: 'TU Berlin, Германия',
    quote: 'Global Study помогли мне с мотивационным письмом и языковыми требованиями. Получила оффер за 3 месяца!',
    initials: 'АМ',
    color: 'bg-blue-500',
  },
  {
    name: 'Дмитрий К.',
    location: 'Украина',
    university: 'University of Warsaw, Польша',
    quote: 'Команда сопровождала меня на каждом шагу — от выбора программы до получения студенческой визы.',
    initials: 'ДК',
    color: 'bg-emerald-500',
  },
  {
    name: 'Нилуфар Р.',
    location: 'Узбекистан',
    university: 'Charles University, Чехия',
    quote: 'Даже не верила, что смогу поступить на грант. Global Study показали, что это реально.',
    initials: 'НР',
    color: 'bg-gold',
  },
  {
    name: 'Сергей Л.',
    location: 'Беларусь',
    university: 'Corvinus University, Венгрия',
    quote: 'Грамотная помощь с документами и подготовка к интервью — всё прошло идеально.',
    initials: 'СЛ',
    color: 'bg-purple-500',
  },
  {
    name: 'Мадина Т.',
    location: 'Кыргызстан',
    university: 'Masaryk University, Чехия',
    quote: 'Получила Erasmus+ стипендию. Без Global Study я бы не знала с чего начать.',
    initials: 'МТ',
    color: 'bg-rose-500',
  },
  {
    name: 'Арман Б.',
    location: 'Казахстан',
    university: 'Vilnius University, Литва',
    quote: 'Всё организовано чётко: сроки, документы, визовый центр. Никакого стресса.',
    initials: 'АБ',
    color: 'bg-amber-500',
  },
]

export function SuccessStories() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Истории успеха
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-16 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Более 3 000 студентов из СНГ уже учатся в топовых университетах мира
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-6 flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {s.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 dark:text-white/40">{s.location} → {s.university}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">«{s.quote}»</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <LinkButton href="https://t.me/Globalstudyy" target="_blank" rel="noopener noreferrer" variant="gold">
            Начать свой путь
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Проверить** — 6 карточек в сетке 3×2, аватары с инициалами, цитаты, кнопка внизу.

- [ ] **Коммит**

```bash
git add src/components/sections/SuccessStories.tsx
git commit -m "feat: переработка SuccessStories — карточки с отзывами"
```

---

## Task 7: FAQ-секция

**Files:**
- Create: `src/components/sections/FAQ.tsx`
- Modify: `src/App.tsx`

- [ ] **Создать компонент**

```tsx
// src/components/sections/FAQ.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FAQS = [
  {
    q: 'Сколько стоят ваши услуги?',
    a: 'Первичная консультация бесплатна. Стоимость полного сопровождения зависит от программы и страны — уточните в Telegram после консультации.',
  },
  {
    q: 'Какие сроки поступления?',
    a: 'В среднем от 2 до 6 месяцев с момента первого обращения до получения оффера. Рекомендуем начинать за 6–12 месяцев до желаемой даты начала учёбы.',
  },
  {
    q: 'Помогаете ли с оформлением визы?',
    a: 'Да. Мы помогаем собрать пакет документов, консультируем по типам виз и сопровождаем на всех этапах визового процесса.',
  },
  {
    q: 'Какой уровень языка нужен для поступления?',
    a: 'Зависит от страны и программы. Для большинства программ на английском нужен IELTS 6.0–6.5 или TOEFL 80+. Для программ на немецком/польском/чешском — соответствующие сертификаты. Поможем подготовиться.',
  },
  {
    q: 'Вы гарантируете поступление?',
    a: 'Гарантировать решение университета не может никто. Но мы максимизируем шансы: подбираем подходящие программы, готовим сильное досье и подаём сразу в несколько вузов.',
  },
  {
    q: 'В какие страны вы помогаете поступить?',
    a: 'Германия, Польша, Чехия, Венгрия, Литва, Нидерланды, Великобритания, Канада и другие страны. Полный список — на консультации.',
  },
  {
    q: 'Какие документы нужны для подачи?',
    a: 'Базовый пакет: диплом/аттестат с переводом, языковой сертификат, мотивационное письмо, рекомендательные письма (1–2), резюме. Конкретный список зависит от программы.',
  },
  {
    q: 'Что входит в полное сопровождение?',
    a: 'Выбор университетов и программ, подготовка мотивационного письма и резюме, сбор и проверка документов, подача заявок, коммуникация с университетом, помощь с визой и переездом.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.h2
          className="font-syne text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Частые вопросы
        </motion.h2>
        <motion.p
          className="text-gray-500 dark:text-white/60 text-center mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Если не нашли ответ — напишите нам в Telegram
        </motion.p>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left text-gray-900 dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`flex-shrink-0 ml-4 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Добавить в App.tsx** — после `<SuccessStories />`, перед `<CTA />`:

```tsx
import { FAQ } from './components/sections/FAQ'

// в <main>:
<SuccessStories />
<FAQ />
<CTA />
```

- [ ] **Проверить** — 8 вопросов, аккордеон открывается/закрывается, анимация плавная.

- [ ] **Коммит**

```bash
git add src/components/sections/FAQ.tsx src/App.tsx
git commit -m "feat: FAQ-секция с аккордеоном"
```

---

## Task 8: OG-теги и PWA manifest

**Files:**
- Modify: `index.html`
- Create: `public/manifest.json`

- [ ] **Дополнить index.html**

Заменить блок `<head>` после существующих og-тегов (добавить недостающее):

```html
<!-- добавить после существующих og: тегов -->
<meta property="og:image" content="https://musongwave.github.io/global-study/assets/university_campus_1777027031669.png" />
<meta property="og:site_name" content="Global Study" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Global Study — обучение за рубежом" />
<meta name="twitter:description" content="Помощь в поступлении в топовые университеты. 3000+ студентов, 30+ стран." />
<meta name="twitter:image" content="https://musongwave.github.io/global-study/assets/university_campus_1777027031669.png" />
<meta name="theme-color" content="#C9A84C" />
<link rel="manifest" href="/global-study/manifest.json" />
```

- [ ] **Создать public/manifest.json**

```json
{
  "name": "Global Study",
  "short_name": "Global Study",
  "description": "Помощь в поступлении в университеты за рубежом",
  "start_url": "/global-study/",
  "display": "standalone",
  "theme_color": "#C9A84C",
  "background_color": "#000000",
  "lang": "ru",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Проверить** — открыть DevTools → Application → Manifest: данные загружены без ошибок. Проверить шаринг ссылки через opengraph.xyz (вставить URL).

- [ ] **Коммит**

```bash
git add index.html public/manifest.json
git commit -m "feat: OG-теги, theme-color и PWA manifest"
```

---

## Task 9: Финальная проверка

- [ ] **Запустить dev-сервер** — `bun run dev`
- [ ] **Пройтись по всем улучшениям:**
  - Кнопка «Наверх» появляется при скролле
  - Активный пункт меню подсвечивается
  - Счётчики в фильтре постов
  - Кнопка «Показать ещё» в постах
  - Секция «Как мы работаем» между Services и Destinations
  - Карточки SuccessStories 3×2
  - FAQ-аккордеон
  - DevTools → Application → Manifest без ошибок
- [ ] **Собрать** — `bun run build` — убедиться что нет TypeScript-ошибок
- [ ] **Финальный коммит если нужны правки**
