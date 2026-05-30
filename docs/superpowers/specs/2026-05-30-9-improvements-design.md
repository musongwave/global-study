# Design: 9 улучшений Global Study

Date: 2026-05-30

## Scope

9 улучшений сайта Global Study, сгруппированных в три блока: UX-мелочи, контент, технические.

---

## Группа 1 — UX-мелочи

### 1. Счётчики в фильтре постов
- `Posts.tsx`: для каждой категории считать кол-во через `usePosts` с фиксированным запросом
- Отображать `(N)` внутри `<Pill>` рядом с лейблом
- При активном поиске счётчики обновляются по `searchQuery`

### 2. Активный пункт меню при скролле
- `Header.tsx`: `IntersectionObserver` на секции с id (`#hero`, `#services`, `#posts`, etc.)
- Активный пункт получает визуальный акцент (цвет gold / подчёркивание)
- Порог срабатывания: `threshold: 0.5`

### 3. Кнопка «Наверх»
- Новый компонент `src/components/ui/ScrollToTop.tsx`
- Появляется при `scrollY > 400` (useEffect + scroll listener)
- Фиксированная позиция `bottom-6 right-6`, z-index поверх всего
- Анимация появления/исчезновения через Framer Motion (`AnimatePresence`)
- Клик: `window.scrollTo({ top: 0, behavior: 'smooth' })`
- Подключить в `App.tsx`

---

## Группа 2 — Контент

### 4. SuccessStories — карточки студентов
- Переработать секцию: сетка 3 карточки (grid-cols-1 md:grid-cols-3)
- Каждая карточка: аватар-инициалы (цветной круг), имя, страна + университет, цитата
- 6 историй студентов из СНГ (данные хардкод в компоненте)
- Существующее изображение убрать или оставить как декоративный фон секции
- Анимация: stagger через Framer Motion

### 5. FAQ-секция
- Новый компонент `src/components/sections/FAQ.tsx`
- Позиция в странице: перед Footer (после CTA)
- Аккордеон на React state (без библиотек): `openIndex: number | null`
- ~8 вопросов:
  1. Сколько стоят ваши услуги?
  2. Какие сроки поступления?
  3. Помогаете ли с визой?
  4. Какой уровень языка нужен?
  5. Гарантируете ли поступление?
  6. В какие страны помогаете поступить?
  7. Какие документы нужны?
  8. Что входит в полное сопровождение?

### 6. Секция «Как мы работаем»
- Новый компонент `src/components/sections/HowItWorks.tsx`
- Позиция: после Services, перед Destinations
- 4 шага с эмодзи-иконками и номером:
  1. 💬 Бесплатная консультация
  2. 📋 Подготовка документов
  3. 🎯 Подача заявок
  4. 🎉 Зачисление и сопровождение
- Горизонтальный layout на десктопе, вертикальный на мобиле
- Соединительные стрелки между шагами (только десктоп)

---

## Группа 3 — Технические

### 7. Lazy loading постов
- `Posts.tsx`: добавить `useState<number>(6)` → `visibleCount`
- Рендерить `posts.slice(0, visibleCount)`
- Кнопка «Показать ещё» если `visibleCount < posts.length`, добавляет +6
- При смене `activeCategory` или `searchQuery` сбрасывать `visibleCount` до 6

### 8. OG-теги и SEO
- `index.html`: добавить `og:image` (баннер из `public/assets/`), `og:site_name`, `twitter:card: summary_large_image`, `twitter:image`
- Добавить `<meta name="theme-color" content="#C9A84C">`

### 9. PWA manifest
- `public/manifest.json`: name, short_name, start_url, display: standalone, theme_color: #C9A84C, background_color, icons (SVG)
- `index.html`: `<link rel="manifest" href="/manifest.json">` (или с BASE_URL)
- Service worker не добавляем

---

## Порядок секций после изменений

`Header → Hero → Stats → Services → HowItWorks → Destinations → Universities → Posts → SuccessStories → FAQ → CTA → Footer`

---

## Файлы, которые затрагиваются

| Файл | Изменение |
|------|-----------|
| `src/components/sections/Posts.tsx` | счётчики + lazy loading |
| `src/components/sections/SuccessStories.tsx` | полная переработка |
| `src/components/sections/FAQ.tsx` | новый |
| `src/components/sections/HowItWorks.tsx` | новый |
| `src/components/ui/ScrollToTop.tsx` | новый |
| `src/components/layout/Header.tsx` | active nav |
| `src/App.tsx` | новые секции + ScrollToTop |
| `index.html` | OG + manifest link |
| `public/manifest.json` | новый |
