# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Global Study** — одностраничный маркетинговый сайт агентства международного образования, основанного на Telegram-канале [@Globalstudyy](https://t.me/Globalstudyy). Аудитория: студенты 18–30 лет из СНГ. Весь интерфейс строго на русском языке.

## Key Constraints

- **Язык UI**: только русский — никакого английского в пользовательском интерфейсе
- **Стек**: Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
- **Mobile-first**: адаптивность обязательна
- **Хостинг**: два параллельных деплоя — GitHub Pages и AWS CloudFront

## Локальный запуск

```bash
bun install
bun run dev
```

## Сборка и деплой

### GitHub Pages (`musongwave.github.io/global-study/`)

```bash
bun run build   # base = /global-study/ (по умолчанию)
# деплой через GitHub Actions
```

### AWS CloudFront (`https://d35ugerun4abmu.cloudfront.net`)

```bash
bash scripts/deploy-aws.sh
# строит с VITE_BASE_PATH=/ и синкает dist/ в S3
```

AWS ресурсы: S3 bucket `global-study-site-300272448240`, CloudFront distribution `EKSIK23VB2V4N`, регион `eu-north-1`.

Переменная `VITE_BASE_PATH` управляет base URL в `vite.config.ts`:
- GitHub Pages → `/global-study/` (умолчание)
- AWS → `/` (передаётся в скрипте деплоя)

## Архитектура

### Структура `src/`

```
src/
  App.tsx                  — корневой компонент, состояние темы
  components/
    layout/
      Header.tsx           — навигация, переключатель темы, мобильное меню
      Footer.tsx
      MobileMenu.tsx
    sections/
      Hero.tsx             — Vanta.js 3D-глобус (адаптирован под тему)
      Stats.tsx            — анимированные счётчики
      Services.tsx
      Destinations.tsx
      Universities.tsx     — карусель + модал
      Posts.tsx            — фильтрация по категориям + поиск + модал
      SuccessStories.tsx
      CTA.tsx
    ui/
      Button.tsx
      Modal.tsx
      Pill.tsx
  hooks/
    usePosts.ts            — фильтрация постов
  types/
    post.ts
    university.ts
  data/
    universities.ts
```

Данные постов: `data/posts.json` (в корне проекта, не в `src/`).
Статические изображения: `public/assets/` (копируются в `dist/assets/` при сборке).

### Секции страницы (сверху вниз)

Header → Hero (Vanta globe) → Stats → Services → Destinations → Universities → Posts → SuccessStories → CTA → Footer

### Тема (светлая/тёмная)

Tailwind `darkMode: 'class'` — класс `dark` добавляется на `document.documentElement`.
Переключатель в `Header.tsx`, состояние `isDark` в `App.tsx`.
`Hero.tsx` пересоздаёт Vanta-эффект при смене темы (разные `backgroundColor` и `color2`).

### Схема поста в `posts.json`

```json
{
  "id": 42,
  "date": "2025-04-20",
  "category": "возможности",
  "title": "Заголовок на русском (40-80 символов)",
  "preview": "Краткое описание (150-250 символов)",
  "text": "Полный текст поста",
  "image": "https://images.unsplash.com/photo-...",
  "tags": ["стипендия", "европа"],
  "tg_link": "https://t.me/Globalstudyy/42"
}
```

**Допустимые категории:** `образование`, `новости`, `возможности`, `ресурсы`

Изображения постов — Unsplash CDN (`https://images.unsplash.com/photo-{ID}?w=800&h=400&fit=crop&auto=format`). При ошибке загрузки показывается градиент + emoji-иконка категории.

## Синхронизация контента

`scripts/sync_posts.py` — запускается через GitHub Actions (`sync.yml`, только вручную):

1. Скрапит `t.me/s/Globalstudyy`
2. Передаёт посты в Claude Haiku API (`claude-haiku-4-5`)
3. Обновляет `data/posts.json` (максимум 50 постов, новые — в начале)
4. Делает `git commit + push`

Запуск локально:
```bash
ANTHROPIC_API_KEY=sk-... python3 scripts/sync_posts.py
```

## Добавление поста вручную

1. Добавить объект в начало массива в `data/posts.json`
2. `git add data/posts.json && git commit -m "content: добавить пост" && git push`
3. GitHub Pages обновится за ~1 минуту; AWS — запустить `bash scripts/deploy-aws.sh`
