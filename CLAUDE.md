# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Обзор проекта

**Global Study** — одностраничный маркетинговый сайт для агентства международного образования, основанного вокруг Telegram-канала [@Globalstudyy](https://t.me/Globalstudyy). Аудитория: студенты 18–30 лет из СНГ. **Весь UI строго на русском — никакого английского в интерфейсе.**

Стек: Vite 5 + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion 11 + Vanta.js (глобус на Three.js).

## Команды

```bash
bun install          # установить зависимости (используется bun.lockb)
bun run dev          # запустить Vite dev-сервер
bun run build        # tsc -b && vite build
bun run preview      # локально просмотреть production-сборку
bun run test         # запустить Vitest один раз
bun run test:watch   # Vitest в режиме watch
```

Тесты лежат рядом с исходниками (например, `src/hooks/usePosts.test.ts`). Запустить один файл:
```bash
bun run test src/hooks/usePosts.test.ts
```

## Деплой

### GitHub Pages (`musongwave.github.io/global-study/`)
```bash
bun run build   # base = /global-study/ (по умолчанию)
# деплой автоматически через GitHub Actions при пуше
```

### AWS CloudFront (`https://d35ugerun4abmu.cloudfront.net`)
```bash
bash scripts/deploy-aws.sh
# собирает с VITE_BASE_PATH=/, синкает dist/ в S3, инвалидирует CloudFront
```

Переменная `VITE_BASE_PATH` управляет опцией `base` в `vite.config.ts`: GitHub Pages → `/global-study/` (умолчание), AWS → `/` (передаётся в скрипте).

AWS ресурсы: S3 `global-study-site-300272448240`, CloudFront `EKSIK23VB2V4N`, регион `eu-north-1`.

## Архитектура

### Управление состоянием

Всё состояние приложения хранится в `App.tsx` и передаётся вниз через пропсы — нет роутера, нет контекста, нет внешнего стора:

| Состояние | Назначение |
|---|---|
| `isDark` | Переключение светлой/тёмной темы |
| `mobileMenuOpen` | Мобильный навигационный дроуэр |
| `activeCategory` | Активная пилюля фильтра постов |
| `searchQuery` | Строка поиска постов |
| `selectedPost` | Открытый пост в модале |
| `selectedUni` | Открытый университет в модале |

`isDark` добавляет/убирает класс `dark` на `document.documentElement` (Tailwind `darkMode: 'class'`).

### Порядок секций страницы

`Header → Hero → Stats → Services → HowItWorks → Destinations → Universities → Posts → SuccessStories → FAQ → CTA → Footer`

Навигация — якорные ссылки (`#hero`, `#services`, `#universities`, `#posts`, `#contact`). `Header` использует `IntersectionObserver` для подсветки активной секции.

### Поток данных

- **Посты**: загружаются из `data/posts.json` (корень репозитория, **не** в `src/`). Хук `usePosts(category, query)` фильтрует их через `useMemo`. `usePostCounts(query)` возвращает количество постов по категориям для пилюль фильтра. Оба хука — в `src/hooks/usePosts.ts`.
- **Университеты**: статический массив в `src/data/universities.ts`, отображается в карусели со snap-scroll.
- **Модалы**: состояния `selectedPost` и `selectedUni` в `App.tsx` управляют открытым моделом. `Modal.tsx` использует Framer Motion `AnimatePresence` для анимаций входа/выхода.

### Глобус в Hero

`Hero.tsx` инициализирует эффект Vanta.js GLOBE при монтировании и **уничтожает + пересоздаёт его при каждом изменении `isDark`**, чтобы поменять цвета фона и переднего плана. Canvas глобуса привязан к div-контейнеру через `useRef`.

### UI-соглашения

- **`src/lib/cn.ts`** — всегда использовать утилиту `cn()` (обёртка `clsx` + `tailwind-merge`) для условной композиции классов.
- **`Button.tsx`** — использовать компоненты `Button` или `LinkButton` с вариантами: `gold`, `outline-gold`, `light`, `outline-light`.
- **`Pill.tsx`** — чипы фильтра по категориям, используются в `Posts.tsx`.
- Изображения карточек постов — Unsplash CDN (`?w=800&h=400&fit=crop&auto=format`). При ошибке загрузки отображается градиент + emoji-иконка категории.

### Тема

Тёмный режим использует префикс `dark:` Tailwind везде. Кастомные токены в `tailwind.config.js`:
- Золотой: `#d4af37` (светлая) / `#b8962c` (тёмная)
- Шрифты: Syne (заголовки, 700–800), Inter (текст, 300–600) — загружаются через Google Fonts в `index.html`

## Схема поста (`data/posts.json`)

```json
{
  "id": 42,
  "date": "2025-04-20",
  "category": "возможности",
  "title": "Заголовок (40–80 символов)",
  "preview": "Краткое описание (150–250 символов)",
  "text": "Полный текст поста",
  "image": "https://images.unsplash.com/photo-{ID}?w=800&h=400&fit=crop&auto=format",
  "tags": ["стипендия", "европа"],
  "tg_link": "https://t.me/Globalstudyy/42"
}
```

Допустимые категории: `образование`, `новости`, `возможности`, `ресурсы`

Посты отсортированы от новых к старым. Скрипт синхронизации хранит максимум 50 постов.

## Синхронизация контента

`scripts/sync_posts.py` (запускается вручную через GitHub Actions `sync.yml`):
1. Скрапит `t.me/s/Globalstudyy`
2. Отправляет сырые посты в Claude Haiku (`claude-haiku-4-5`) для категоризации, генерации заголовка, превью и тегов
3. Добавляет новые посты в начало `data/posts.json` (максимум 50 всего)
4. Делает commit и push

Запуск локально:
```bash
ANTHROPIC_API_KEY=sk-... python3 scripts/sync_posts.py
```

Добавить пост вручную: добавить объект в начало массива в `data/posts.json`, закоммитить и запушить. GitHub Pages обновится за ~1 мин; AWS требует запуска `bash scripts/deploy-aws.sh`.
