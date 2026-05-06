# Global Study — React Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Переписать одностраничный сайт Global Study на Vite + React 18 + TypeScript + Tailwind CSS с редизайном на ветке `react`.

**Architecture:** Новая ветка `react` от `main`. Все секции становятся React-компонентами. Состояние (фильтры, модалы) хранится в `App.tsx` и пробрасывается пропсами вниз. Vanta.js и Framer Motion подключаются через npm, VanillaTilt заменяется Framer Motion.

**Tech Stack:** Vite 5, React 18, TypeScript 5, Tailwind CSS 3, Framer Motion 11, three + vanta (npm), Vitest + @testing-library/react.

---

## Карта файлов

| Файл | Назначение |
|---|---|
| `package.json` | зависимости и скрипты |
| `vite.config.ts` | Vite + Vitest config |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | цвета, шрифты |
| `postcss.config.js` | Tailwind pipeline |
| `index.html` | точка входа с мета-тегами |
| `src/main.tsx` | монтирование React |
| `src/index.css` | Tailwind directives + scrollbar-hide |
| `src/App.tsx` | root: состояние + сборка всех секций |
| `src/lib/cn.ts` | утилита cn() |
| `src/types/post.ts` | интерфейс Post, тип Category |
| `src/types/university.ts` | интерфейс University |
| `src/types/vanta.d.ts` | TypeScript-декларация для vanta |
| `src/data/universities.ts` | массив университетов (из HTML) |
| `src/hooks/usePosts.ts` | фильтрация постов |
| `src/hooks/usePosts.test.ts` | тесты хука |
| `src/components/ui/Button.tsx` | Button + LinkButton |
| `src/components/ui/Pill.tsx` | фильтр-таблетка |
| `src/components/ui/Modal.tsx` | переиспользуемый модал |
| `src/components/ui/Modal.test.tsx` | тесты модала |
| `src/components/layout/Header.tsx` | шапка с навигацией |
| `src/components/layout/MobileMenu.tsx` | fullscreen мобильное меню |
| `src/components/layout/Footer.tsx` | подвал с контактами |
| `src/components/sections/Hero.tsx` | hero + Vanta globe |
| `src/components/sections/Stats.tsx` | статистика + анимированные счётчики |
| `src/components/sections/Services.tsx` | карточки услуг |
| `src/components/sections/Destinations.tsx` | топовые направления |
| `src/components/sections/Universities.tsx` | карусель университетов |
| `src/components/sections/Posts.tsx` | посты с фильтрами |
| `src/components/sections/SuccessStories.tsx` | истории успеха |
| `src/components/sections/CTA.tsx` | призыв к действию |

---

## Task 1: Создать ветку и сконфигурировать проект

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `src/test-setup.ts`
- Create: `src/App.tsx` (заглушка)

- [ ] **Step 1: Создать ветку react**

```bash
cd "/Users/muradhajyev/Claude Works/Global Study Claude"
git checkout -b react
```

- [ ] **Step 2: Создать `package.json`**

```json
{
  "name": "global-study",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwind-merge": "^2.3.0",
    "three": "^0.165.0",
    "vanta": "^0.5.24"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.165.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.1",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.4.0",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 3: Создать `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
})
```

- [ ] **Step 4: Создать `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Создать `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          dark: '#b8962c',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Создать `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: Создать `index.html`**

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Global Study — помощь в поступлении в топовые университеты мира. Гранты, визовая поддержка и полное сопровождение." />
    <meta property="og:title" content="Global Study — обучение за рубежом" />
    <meta property="og:description" content="Помощь в поступлении в топовые университеты. 3000+ студентов, 30+ стран." />
    <meta property="og:type" content="website" />
    <title>Global Study — обучение за рубежом</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Создать `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-black text-white font-inter;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

- [ ] **Step 9: Создать `src/test-setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 10: Создать заглушку `src/App.tsx`**

```tsx
export default function App() {
  return <div className="text-white p-8 font-syne text-4xl">Global Study</div>
}
```

- [ ] **Step 11: Создать `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 12: Установить зависимости и проверить запуск**

```bash
npm install
npm run dev
```

Ожидаемый результат: браузер открывает `http://localhost:5173`, видим белый текст "Global Study" на чёрном фоне.

- [ ] **Step 13: Запустить тесты (пока пустые)**

```bash
npm test
```

Ожидаемый результат: `No test files found` или `0 tests`.

- [ ] **Step 14: Commit**

```bash
git add package.json vite.config.ts tsconfig.json tailwind.config.js postcss.config.js index.html src/
git commit -m "feat: scaffold React + Vite + Tailwind + Vitest"
```

---

## Task 2: Типы, данные и утилиты

**Files:**
- Create: `src/types/post.ts`
- Create: `src/types/university.ts`
- Create: `src/types/vanta.d.ts`
- Create: `src/data/universities.ts`
- Create: `src/lib/cn.ts`

- [ ] **Step 1: Создать `src/types/post.ts`**

```ts
export interface Post {
  id: number
  date: string
  category: 'образование' | 'новости' | 'возможности' | 'ресурсы'
  title: string
  preview: string
  text: string
  image: string
  tags: string[]
  tg_link: string
}

export type Category = 'all' | Post['category']
```

- [ ] **Step 2: Создать `src/types/university.ts`**

```ts
export interface University {
  flag: string
  name: string
  country: string
  description: string
  funding: string
}
```

- [ ] **Step 3: Создать `src/types/vanta.d.ts`**

```ts
declare module 'vanta/dist/vanta.globe.min' {
  interface VantaEffect {
    destroy(): void
  }
  interface GlobeOptions {
    el: HTMLElement
    THREE: unknown
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    scale?: number
    scaleMobile?: number
    color?: number
    color2?: number
    size?: number
    backgroundColor?: number
  }
  function GLOBE(options: GlobeOptions): VantaEffect
  export default GLOBE
}
```

- [ ] **Step 4: Создать `src/data/universities.ts`**

```ts
import type { University } from '../types/university'

export const universities: University[] = [
  {
    flag: '🇮🇹',
    name: 'Politecnico di Milano',
    country: 'Италия',
    description: 'Обучение на английском и итальянском языках. Ведущий технический вуз Италии.',
    funding: 'Доступна стипендия DSU (до 7 200€ в год), покрывающая проживание и бесплатное питание в столовой.',
  },
  {
    flag: '🇩🇪',
    name: 'Technical University of Munich',
    country: 'Германия',
    description: 'Один из лучших технических университетов Европы. Программы на немецком и английском.',
    funding: 'Обучение в государственных вузах Германии бесплатно. Помогаем с открытием блокированного счёта и визой.',
  },
  {
    flag: '🇨🇦',
    name: 'University of Toronto',
    country: 'Канада',
    description: 'Входит в мировой Топ-20. Самый престижный университет Канады.',
    funding: 'Право работать 20 ч/нед во время учёбы. После выпуска — Post-Graduation Work Permit и прямой путь к ПМЖ.',
  },
  {
    flag: '🇰🇷',
    name: 'Seoul National University',
    country: 'Южная Корея',
    description: 'Университет №1 в Корее (SKY). Передовые технологии и высочайший уровень подготовки.',
    funding: 'Грант GKS покрывает 100% обучения, авиаперелёт и ежемесячную стипендию.',
  },
  {
    flag: '🇵🇱',
    name: 'University of Warsaw',
    country: 'Польша',
    description: 'Крупнейший и самый престижный вуз Польши. Отличный старт для карьеры в Европе.',
    funding: 'Доступная стоимость. Студенческая виза и ВНЖ. Свободное перемещение по Шенгену.',
  },
  {
    flag: '🇭🇺',
    name: 'University of Debrecen',
    country: 'Венгрия',
    description: 'Один из старейших университетов Венгрии с сильной медицинской и инженерной базой.',
    funding: 'Stipendium Hungaricum — 100% обучения, бесплатное общежитие и ежемесячная стипендия.',
  },
  {
    flag: '🇺🇸',
    name: 'New York University',
    country: 'США',
    description: 'Обучение в сердце Манхэттена. Невероятный нетворкинг и стажировки.',
    funding: 'Скидки до 50% (Merit-based scholarships). Полное визовое сопровождение.',
  },
  {
    flag: '🇯🇵',
    name: 'University of Tokyo',
    country: 'Япония',
    description: 'Лучший университет Японии. Передовые исследовательские центры.',
    funding: 'Грант Министерства образования Японии (MEXT) покрывает всё обучение и даёт стипендию.',
  },
]
```

- [ ] **Step 5: Создать `src/lib/cn.ts`**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: Commit**

```bash
git add src/types/ src/data/ src/lib/
git commit -m "feat: add types, university data, cn utility"
```

---

## Task 3: Хук usePosts + тесты

**Files:**
- Create: `src/hooks/usePosts.ts`
- Create: `src/hooks/usePosts.test.ts`

- [ ] **Step 1: Написать падающий тест**

Создать `src/hooks/usePosts.test.ts`:

```ts
import { renderHook } from '@testing-library/react'
import { usePosts } from './usePosts'

describe('usePosts', () => {
  it('возвращает все посты при category=all и пустом query', () => {
    const { result } = renderHook(() => usePosts('all', ''))
    expect(result.current.length).toBeGreaterThan(0)
  })

  it('фильтрует по категории', () => {
    const { result } = renderHook(() => usePosts('новости', ''))
    result.current.forEach(post => {
      expect(post.category).toBe('новости')
    })
  })

  it('фильтрует по поисковому запросу в title', () => {
    const { result: allResult } = renderHook(() => usePosts('all', ''))
    const firstPost = allResult.current[0]
    const firstWord = firstPost.title.split(' ')[0].toLowerCase()
    const { result } = renderHook(() => usePosts('all', firstWord))
    expect(result.current.some(p => p.id === firstPost.id)).toBe(true)
  })

  it('возвращает пустой массив при несовпадающем запросе', () => {
    const { result } = renderHook(() => usePosts('all', 'xyznonexistent999'))
    expect(result.current).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Запустить тест — убедиться, что падает**

```bash
npm test
```

Ожидаемый результат: `Cannot find module './usePosts'`.

- [ ] **Step 3: Создать `src/hooks/usePosts.ts`**

```ts
import { useMemo } from 'react'
import postsData from '../../data/posts.json'
import type { Post, Category } from '../types/post'

const posts = postsData as Post[]

export function usePosts(category: Category, query: string): Post[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter(post => {
      const matchCat = category === 'all' || post.category === category
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.preview.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [category, query])
}
```

- [ ] **Step 4: Запустить тест — убедиться, что проходит**

```bash
npm test
```

Ожидаемый результат: `4 passed`.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add usePosts hook with tests"
```

---

## Task 4: UI-компоненты — Button, Pill, Modal

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Pill.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Modal.test.tsx`

- [ ] **Step 1: Написать падающий тест для Modal**

Создать `src/components/ui/Modal.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal', () => {
  it('рендерит дочерние элементы когда открыт', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <p>Test content</p>
      </Modal>
    )
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('не рендерит дочерние элементы когда закрыт', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <p>Hidden content</p>
      </Modal>
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('вызывает onClose при нажатии Escape', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('вызывает onClose при клике на кнопку закрытия', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose}>
        <p>Content</p>
      </Modal>
    )
    fireEvent.click(screen.getByLabelText('Закрыть'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Запустить — убедиться, что падает**

```bash
npm test
```

Ожидаемый результат: `Cannot find module './Modal'`.

- [ ] **Step 3: Создать `src/components/ui/Button.tsx`**

```tsx
import { cn } from '../../lib/cn'

type Variant = 'gold' | 'outline-gold' | 'light' | 'outline-light'

const base =
  'inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer'

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-black hover:bg-gold-dark',
  'outline-gold': 'border border-gold text-gold hover:bg-gold hover:text-black',
  light: 'bg-white text-black hover:bg-gray-100',
  'outline-light': 'border border-white/80 text-white hover:bg-white hover:text-black',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
}

export function Button({ variant = 'gold', className, ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />
}

export function LinkButton({ variant = 'gold', className, ...props }: LinkButtonProps) {
  return <a className={cn(base, variants[variant], className)} {...props} />
}
```

- [ ] **Step 4: Создать `src/components/ui/Pill.tsx`**

```tsx
import { cn } from '../../lib/cn'

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function Pill({ active, className, ...props }: PillProps) {
  return (
    <button
      className={cn(
        'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
        active
          ? 'bg-gold text-black'
          : 'border border-white/20 text-white/60 hover:border-gold/50 hover:text-white',
        className
      )}
      {...props}
    />
  )
}
```

- [ ] **Step 5: Создать `src/components/ui/Modal.tsx`**

```tsx
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={e => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 max-w-lg w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl leading-none"
              aria-label="Закрыть"
            >
              ×
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 6: Запустить тесты — убедиться, что проходят**

```bash
npm test
```

Ожидаемый результат: `8 passed` (4 usePosts + 4 Modal).

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Button, Pill, Modal UI components with tests"
```

---

## Task 5: Layout — Header, MobileMenu, Footer

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/MobileMenu.tsx`
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Создать `src/components/layout/Header.tsx`**

```tsx
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
```

- [ ] **Step 2: Создать `src/components/layout/MobileMenu.tsx`**

```tsx
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
          className="fixed inset-0 z-30 bg-black flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col items-center gap-8 text-2xl font-syne font-bold text-white">
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
```

- [ ] **Step 3: Создать `src/components/layout/Footer.tsx`**

```tsx
import { LinkButton } from '../ui/Button'
import type { Category } from '../../types/post'

interface FooterProps {
  onCategorySelect: (cat: Category) => void
}

export function Footer({ onCategorySelect }: FooterProps) {
  return (
    <footer id="contact" className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <div className="font-syne text-2xl font-bold text-white mb-4">Global Study</div>
          <p className="text-white/50 text-sm mb-6">
            Ваш надёжный партнёр в сфере международного образования.
          </p>
          <LinkButton
            href="https://t.me/Globalstudyy"
            target="_blank"
            rel="noopener"
            variant="gold"
          >
            Написать в Telegram
          </LinkButton>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Навигация</h4>
          <ul className="space-y-2 text-white/50 text-sm">
            <li>
              <button
                onClick={() => onCategorySelect('all')}
                className="hover:text-white transition-colors"
              >
                Главная
              </button>
            </li>
            <li>
              <a href="#services" className="hover:text-white transition-colors">
                Услуги
              </a>
            </li>
            <li>
              <a href="#universities" className="hover:text-white transition-colors">
                Университеты
              </a>
            </li>
            <li>
              <button
                onClick={() => onCategorySelect('новости')}
                className="hover:text-white transition-colors"
              >
                Новости
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Контакты</h4>
          <ul className="space-y-2 text-white/50 text-sm">
            <li>
              <a href="tel:+998880211122" className="hover:text-white transition-colors">
                📞 +998 88 021 11 22
              </a>
            </li>
            <li>
              <a
                href="mailto:globalgo@gmail.com"
                className="hover:text-white transition-colors"
              >
                📧 globalgo@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://t.me/Globalstudyy"
                target="_blank"
                rel="noopener"
                className="hover:text-white transition-colors"
              >
                @Globalstudyy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 border-t border-white/10 pt-8 text-center text-white/30 text-sm">
        © 2025 Global Study. Все права защищены.
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Header, MobileMenu, Footer layout components"
```

---

## Task 6: Section — Hero с Vanta Globe

**Files:**
- Create: `src/components/sections/Hero.tsx`

- [ ] **Step 1: Создать `src/components/sections/Hero.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { LinkButton } from '../ui/Button'

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<{ destroy(): void } | null>(null)

  useEffect(() => {
    if (!bgRef.current) return
    let mounted = true

    import('vanta/dist/vanta.globe.min').then(mod => {
      if (!mounted || !bgRef.current) return
      effectRef.current = mod.default({
        el: bgRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xd4af37,
        color2: 0x2a2a2a,
        size: 1.5,
        backgroundColor: 0x0a0a0a,
      })
    })

    return () => {
      mounted = false
      effectRef.current?.destroy()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div ref={bgRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      <div className="relative z-10 container mx-auto px-6 py-32 pt-40">
        <p className="text-gold font-syne text-sm font-semibold tracking-widest uppercase mb-4">
          Агентство международного образования
        </p>
        <h1 className="font-syne text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
          Обучение за рубежом
          <br />
          с гарантированной
          <br />
          поддержкой
        </h1>
        <p className="text-white/70 text-lg max-w-xl mb-10 leading-relaxed">
          Ваш путь в топовые университеты мира. Гранты, визовое сопровождение и поддержка на каждом
          этапе.
        </p>
        <div className="flex flex-wrap gap-4">
          <LinkButton href="#contact" variant="light">
            Начать путь
          </LinkButton>
          <LinkButton href="#universities" variant="outline-light">
            Университеты
          </LinkButton>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Добавить Hero в заглушку App.tsx и проверить в браузере**

Обновить `src/App.tsx`:

```tsx
import { Hero } from './components/sections/Hero'

export default function App() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

Запустить `npm run dev` и проверить: должен отрендериться герой-блок с Vanta-глобусом.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx src/App.tsx
git commit -m "feat: add Hero section with Vanta globe"
```

---

## Task 7: Section — Stats с анимированными счётчиками

**Files:**
- Create: `src/components/sections/Stats.tsx`

- [ ] **Step 1: Создать `src/components/sections/Stats.tsx`**

```tsx
import { useEffect, useRef } from 'react'
import { motion, useInView, animate } from 'framer-motion'

interface StatItem {
  value: number
  suffix: string
  label: string
}

const STATS: StatItem[] = [
  { value: 5, suffix: '+', label: 'лет опыта' },
  { value: 3000, suffix: '+', label: 'студентов' },
  { value: 30, suffix: '+', label: 'стран мира' },
  { value: 100, suffix: '%', label: 'помощь с грантами' },
]

function StatCounter({ value, suffix, label }: StatItem) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView || !numRef.current) return
    const node = numRef.current
    const controls = animate(0, value, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString('ru-RU')
      },
    })
    return () => controls.stop()
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/40 transition-colors cursor-default"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="font-syne text-4xl font-bold text-gold whitespace-nowrap">
        <span ref={numRef}>0</span>
        {suffix}
      </div>
      <div className="text-white/60 text-sm mt-2">{label}</div>
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="py-16 bg-zinc-950">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <StatCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Stats.tsx
git commit -m "feat: add Stats section with animated counters"
```

---

## Task 8: Sections — Services и Destinations

**Files:**
- Create: `src/components/sections/Services.tsx`
- Create: `src/components/sections/Destinations.tsx`

- [ ] **Step 1: Создать `src/components/sections/Services.tsx`**

```tsx
import { motion } from 'framer-motion'

const SERVICES = [
  {
    icon: '🎓',
    title: 'Подбор университета',
    desc: 'Анализируем ваш профиль и находим идеальные варианты в США, Канаде, Европе и Азии.',
  },
  {
    icon: '💰',
    title: 'Помощь со стипендиями',
    desc: 'Помогаем получить гранты и стипендии, покрывающие до 100% стоимости обучения.',
  },
  {
    icon: '✈️',
    title: 'Визовая поддержка',
    desc: 'Полное сопровождение в подготовке документов и прохождении интервью в посольстве.',
  },
]

export function Services() {
  return (
    <section id="services" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <motion.h2
          className="font-syne text-4xl font-bold text-white mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Наши услуги
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-gold/40 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="text-4xl mb-6">{s.icon}</div>
              <h3 className="font-syne text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать `src/components/sections/Destinations.tsx`**

```tsx
import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function Destinations() {
  return (
    <section id="destinations" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-white mb-6">
            Топовые направления
          </h2>
          <p className="text-white/60 mb-4 leading-relaxed">
            Открываем двери в лучшие учебные заведения мира. США, Канада, Италия, Германия, Южная
            Корея, Польша, Венгрия, Япония.
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">
            Каждая страна предлагает уникальные карьерные возможности и программы финансирования для
            иностранных студентов.
          </p>
          <LinkButton href="#contact" variant="gold">
            Получить консультацию
          </LinkButton>
        </motion.div>
        <motion.img
          src="assets/university_campus_1777027031669.png"
          alt="Кампус университета"
          className="rounded-2xl object-cover w-full h-80"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Services.tsx src/components/sections/Destinations.tsx
git commit -m "feat: add Services and Destinations sections"
```

---

## Task 9: Section — Universities карусель

**Files:**
- Create: `src/components/sections/Universities.tsx`

- [ ] **Step 1: Создать `src/components/sections/Universities.tsx`**

```tsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
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
    <section id="universities" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            className="font-syne text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Наши университеты
          </motion.h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('prev')}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Назад"
            >
              ←
            </button>
            <button
              onClick={() => scroll('next')}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              aria-label="Вперёд"
            >
              →
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
              className="flex-shrink-0 w-48 p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-gold/40 transition-all snap-start"
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-3xl mb-3">{uni.flag}</div>
              <div className="text-white font-semibold text-sm leading-tight mb-1">{uni.name}</div>
              <div className="text-gold text-xs">{uni.country}</div>
              <div className="text-white/40 text-xs mt-2">Нажмите для деталей</div>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-white/40 text-sm mt-6">
          И ещё более 100 топовых университетов с возможностью получить грант до 100%.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Universities.tsx
git commit -m "feat: add Universities carousel section"
```

---

## Task 10: Section — Posts с фильтрацией

**Files:**
- Create: `src/components/sections/Posts.tsx`

- [ ] **Step 1: Создать `src/components/sections/Posts.tsx`**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/Posts.tsx
git commit -m "feat: add Posts section with filter and search"
```

---

## Task 11: Sections — SuccessStories и CTA

**Files:**
- Create: `src/components/sections/SuccessStories.tsx`
- Create: `src/components/sections/CTA.tsx`

- [ ] **Step 1: Создать `src/components/sections/SuccessStories.tsx`**

```tsx
import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function SuccessStories() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.img
          src="assets/student_success_1777027045477.png"
          alt="Истории успеха студентов"
          className="rounded-2xl object-cover w-full h-80 order-last md:order-first"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-white mb-6">Истории успеха</h2>
          <p className="text-white/60 mb-4 leading-relaxed">
            Более 3 000 наших студентов уже учатся в престижных университетах мира, строят
            международную карьеру и расширяют свои горизонты.
          </p>
          <p className="text-white/60 mb-8 leading-relaxed">
            Присоединяйтесь к сообществу Global Study и сделайте первый шаг к своему успешному
            будущему.
          </p>
          <LinkButton href="#contact" variant="gold">
            Начать путь
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Создать `src/components/sections/CTA.tsx`**

```tsx
import { motion } from 'framer-motion'
import { LinkButton } from '../ui/Button'

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-y border-white/10">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-syne text-4xl font-bold text-white mb-4">
            Не пропускай новые посты
          </h2>
          <p className="text-white/60 mb-8">
            Подпишись на Telegram-канал и получай актуальную информацию первым
          </p>
          <LinkButton
            href="https://t.me/Globalstudyy"
            target="_blank"
            rel="noopener"
            variant="light"
          >
            Открыть Telegram
          </LinkButton>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/SuccessStories.tsx src/components/sections/CTA.tsx
git commit -m "feat: add SuccessStories and CTA sections"
```

---

## Task 12: App.tsx — сборка всего приложения

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Заменить `src/App.tsx` финальной версией**

```tsx
import { useState } from 'react'
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
            <h2 className="font-syne text-2xl font-bold text-white mb-2">
              {selectedUni.flag} {selectedUni.name}
            </h2>
            <p className="text-gold text-sm mb-4">{selectedUni.country}</p>
            <p className="text-white/70 mb-3">{selectedUni.description}</p>
            <p className="text-white/70">
              <strong className="text-white">Финансирование: </strong>
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
            <h2 className="font-syne text-2xl font-bold text-white mb-4">
              {selectedPost.title}
            </h2>
            <div className="text-white/70 space-y-3 max-h-80 overflow-y-auto pr-2">
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
```

- [ ] **Step 2: Запустить тесты — убедиться, что всё проходит**

```bash
npm test
```

Ожидаемый результат: `8 passed`.

- [ ] **Step 3: Запустить dev-сервер и проверить полный сайт**

```bash
npm run dev
```

Проверить в браузере:
- Все секции отрендерились
- Vanta-глобус работает в Hero
- Счётчики анимируются при скролле до Stats
- Карусель университетов скроллится кнопками
- Фильтры постов работают
- Поиск фильтрует посты в реальном времени
- Модал университета открывается и закрывается
- Модал поста открывается и закрывается
- Мобильное меню работает (при сужении окна до <768px)
- Закрытие модала по Escape и клику на оверлей

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire all sections in App with state management"
```

---

## Task 13: Финальная проверка и сборка

**Files:**
- (нет изменений файлов — только проверка)

- [ ] **Step 1: Запустить полный прогон тестов**

```bash
npm test
```

Ожидаемый результат: `8 passed`, 0 failed.

- [ ] **Step 2: Проверить TypeScript**

```bash
npx tsc --noEmit
```

Ожидаемый результат: нет ошибок.

- [ ] **Step 3: Собрать продакшн-бандл**

```bash
npm run build
```

Ожидаемый результат: папка `dist/` создана без ошибок. В выводе — размеры бандла.

- [ ] **Step 4: Проверить продакшн-сборку**

```bash
npm run preview
```

Открыть `http://localhost:4173` и убедиться, что сайт работает корректно.

- [ ] **Step 5: Финальный commit**

```bash
git add -A
git commit -m "feat: complete React rewrite with Tailwind redesign"
```
