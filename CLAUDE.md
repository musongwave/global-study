# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Global Study** — single-page marketing site for an international education agency built around the Telegram channel [@Globalstudyy](https://t.me/Globalstudyy). Target audience: students aged 18–30 from CIS countries. **All UI text must be in Russian only — no English in the user interface.**

Stack: Vite 5 + React 18 + TypeScript + Tailwind CSS 3 + Framer Motion 11 + Vanta.js (Three.js globe).

## Commands

```bash
bun install          # install dependencies (uses bun.lockb)
bun run dev          # start Vite dev server
bun run build        # tsc -b && vite build
bun run preview      # preview production build locally
bun run test         # run Vitest once
bun run test:watch   # run Vitest in watch mode
```

Tests live alongside source files (e.g. `src/hooks/usePosts.test.ts`). Run a single test file:
```bash
bun run test src/hooks/usePosts.test.ts
```

## Deployment

### GitHub Pages (`musongwave.github.io/global-study/`)
```bash
bun run build   # base = /global-study/ (default)
# deployed automatically via GitHub Actions on push
```

### AWS CloudFront (`https://d35ugerun4abmu.cloudfront.net`)
```bash
bash scripts/deploy-aws.sh
# builds with VITE_BASE_PATH=/ then syncs dist/ to S3 + invalidates CloudFront
```

`VITE_BASE_PATH` controls the Vite `base` option in `vite.config.ts`. GitHub Pages needs `/global-study/`; AWS needs `/`. The deploy script sets this automatically.

AWS resources: S3 `global-study-site-300272448240`, CloudFront `EKSIK23VB2V4N`, region `eu-north-1`.

## Architecture

### State Management

All application state lives in `App.tsx` and is passed down as props — there is no router, no context, no external store:

| State | Purpose |
|---|---|
| `isDark` | Light/dark theme toggle |
| `mobileMenuOpen` | Mobile nav drawer |
| `activeCategory` | Posts filter pill |
| `searchQuery` | Posts search input |
| `selectedPost` | Open post in modal |
| `selectedUni` | Open university in modal |

`isDark` adds/removes the `dark` class on `document.documentElement` (Tailwind `darkMode: 'class'`).

### Page Section Order

`Header → Hero → Stats → Services → HowItWorks → Destinations → Universities → Posts → SuccessStories → FAQ → CTA → Footer`

Navigation uses anchor links (`#hero`, `#services`, `#universities`, `#posts`, `#contact`). The `Header` uses `IntersectionObserver` to highlight the active section.

### Data Flow

- **Posts**: loaded from `data/posts.json` (root of repo, **not** inside `src/`). The `usePosts(category, query)` hook filters them with `useMemo`. `usePostCounts(query)` returns per-category counts for the filter pills. Both hooks are in `src/hooks/usePosts.ts`.
- **Universities**: static array in `src/data/universities.ts`, displayed in a snap-scroll carousel.
- **Modals**: `selectedPost` and `selectedUni` state in `App.tsx` control which modal is open. `Modal.tsx` uses Framer Motion `AnimatePresence` for enter/exit animations.

### Hero Globe

`Hero.tsx` initialises a Vanta.js GLOBE effect on mount and **destroys + re-creates it whenever `isDark` changes** to swap background/foreground colours. The globe canvas is attached to a `useRef` container div.

### UI Conventions

- **`src/lib/cn.ts`** — always use this `cn()` utility (wraps `clsx` + `tailwind-merge`) for conditional class composition.
- **`Button.tsx`** — use the `Button` or `LinkButton` components with variants: `gold`, `outline-gold`, `light`, `outline-light`.
- **`Pill.tsx`** — category filter chips used in `Posts.tsx`.
- Post card images are Unsplash CDN URLs (`?w=800&h=400&fit=crop&auto=format`). On load error, components render a gradient + category emoji fallback.

### Theme

Dark mode classes use the `dark:` Tailwind prefix throughout. Custom design tokens in `tailwind.config.js`:
- Gold: `#d4af37` (light) / `#b8962c` (dark)
- Fonts: Syne (headings, weight 700–800), Inter (body, weight 300–600) — loaded via Google Fonts in `index.html`

## Post Schema (`data/posts.json`)

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

Valid categories: `образование`, `новости`, `возможности`, `ресурсы`

Posts are sorted newest-first. Max 50 posts are kept by the sync script.

## Content Sync

`scripts/sync_posts.py` (triggered manually via GitHub Actions `sync.yml`):
1. Scrapes `t.me/s/Globalstudyy`
2. Sends raw posts to Claude Haiku (`claude-haiku-4-5`) for categorisation, title, preview, and tag generation
3. Prepends new posts to `data/posts.json` (max 50 total)
4. Commits and pushes

Run locally:
```bash
ANTHROPIC_API_KEY=sk-... python3 scripts/sync_posts.py
```

To add a post manually: prepend an entry to `data/posts.json`, commit, and push. GitHub Pages updates in ~1 min; AWS requires running `bash scripts/deploy-aws.sh`.
