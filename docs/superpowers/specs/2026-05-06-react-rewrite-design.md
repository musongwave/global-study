# Спецификация: Реврайт Global Study на React

**Дата:** 2026-05-06  
**Статус:** Approved  
**Цель:** Экспериментальный переход на React + Tailwind + TypeScript с редизайном визуала

---

## 1. Контекст

Текущий сайт — одностраничный маркетинговый лендинг (~1300 строк HTML/CSS/JS) на GitHub Pages. Работает нормально, но представляет собой монолит. Цель — исследовательский реврайт на React для опыта.

## 2. Стратегия

Новая ветка `react` в том же репозитории. Ветка `main` (текущий vanilla-сайт) остаётся нетронутой.

## 3. Стек

| Слой | Инструмент |
|---|---|
| Сборка | Vite 5 |
| UI | React 18 + TypeScript |
| Стили | Tailwind CSS v3 |
| Анимации | Framer Motion |
| 3D-глобус | three + vanta (npm) |
| Данные | JSON-импорт (posts.json) + data/universities.ts |

## 4. Структура файлов

```
src/
  components/
    layout/
      Header.tsx
      Footer.tsx
      MobileMenu.tsx
    sections/
      Hero.tsx
      Stats.tsx
      Services.tsx
      Destinations.tsx
      Universities.tsx
      Posts.tsx
      SuccessStories.tsx
      CTA.tsx
    ui/
      Button.tsx
      Card.tsx
      Modal.tsx
      Pill.tsx
  hooks/
    usePosts.ts
    useModal.ts
  data/
    universities.ts
  types/
    post.ts
    university.ts
  App.tsx
  main.tsx
data/
  posts.json          (существующий, без изменений)
assets/               (существующие, без изменений)
```

## 5. Управление состоянием

Только в `App.tsx`, пропсами вниз. Без Redux/Zustand.

```ts
activeCategory: string          // фильтр постов
searchQuery: string             // поиск
selectedPost: Post | null       // открытый пост в модале
selectedUni: University | null  // открытый университет в модале
```

## 6. Ключевые компоненты

### Hero
- Vanta GLOBE через `useEffect` + `useRef`
- Cleanup через `effect.destroy()` при unmount

### Stats
- Framer Motion `useInView` + анимированные счётчики
- `useMotionValue` + `useTransform` для плавного числового перехода

### Universities
- Данные вынесены из HTML в `src/data/universities.ts`
- Карусель через `useRef` + `scrollBy`
- Клик по карточке → `selectedUni` в App.tsx → Modal

### Posts
- `usePosts(category, query)` — фильтрует posts.json
- Карточки с `AnimatePresence` для плавного появления/исчезновения при фильтрации
- Клик → `selectedPost` в App.tsx → Modal

### Modal
- Единый переиспользуемый компонент
- `isOpen`, `onClose`, `children`
- Framer Motion для анимации появления
- Закрытие по Escape, клику на оверлей

## 7. Визуальный редизайн

- Сохраняем золотой акцент `#d4af37` и тёмный фон (`#0a0a0a`)
- Glassmorphism-карточки: `backdrop-blur`, полупрозрачные фоны
- Framer Motion заменяет VanillaTilt и IntersectionObserver scroll reveal
- Шрифты: Syne (заголовки) + Inter (текст) — без изменений
- Увеличенные отступы, более воздушная типографика

## 8. Данные

- `posts.json` — импортируется напрямую через Vite (`import posts from '../data/posts.json'`)
- `universities.ts` — TypeScript-массив с объектами университетов, перенесённый из HTML
- Тип `Post`: `{ id, date, category, title, preview, text, image, tags, tg_link }`
- Тип `University`: `{ flag, name, country, description, funding }`

## 9. Что НЕ входит в scope

- Роутинг (сайт одностраничный, `#`-якоря остаются)
- Авторизация
- SSR / Next.js
- Обновление GitHub Actions (деплой — отдельная задача)
- Перенос sync_posts.py (скрипт не меняется)
