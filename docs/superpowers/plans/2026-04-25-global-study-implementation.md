# Global Study — План реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать статический сайт на HTML+CSS+JS на основе Telegram-канала @Globalstudyy с лентой постов, фильтрацией по категориям и поиском.

**Architecture:** Однофайловый подход — `index.html` + `styles.css` + `app.js` + `data/posts.json`. Контент хранится в JSON и рендерится на клиенте через `fetch`. Хостинг на GitHub Pages.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), Vanilla JS (ES2020+), GitHub Pages.

---

## Структура файлов

```
global-study/
├── index.html          # вся HTML-структура страницы
├── styles.css          # все стили (переменные, компоненты, responsive)
├── app.js              # fetch постов, рендер карточек, фильтры, поиск, бургер
├── data/
│   └── posts.json      # 10 постов с реалистичным контентом
└── .nojekyll           # отключает Jekyll на GitHub Pages
```

---

## Task 1: Создать `data/posts.json`

**Files:**
- Create: `data/posts.json`

- [ ] **Шаг 1: Создать директорию и файл с данными**

Создать файл `data/posts.json` со следующим содержимым:

```json
[
  {
    "id": 1,
    "date": "2025-04-22",
    "category": "возможности",
    "title": "Стипендия Chevening 2025–2026: как подать заявку",
    "preview": "Правительство Великобритании открыло приём заявок на полностью финансируемые стипендии для обучения в магистратуре. Покрывает обучение, проживание и перелёт.",
    "image": "https://picsum.photos/seed/1/600/400",
    "tags": ["стипендия", "великобритания", "магистратура"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 2,
    "date": "2025-04-20",
    "category": "образование",
    "title": "Топ-5 бесплатных курсов по программированию в 2025 году",
    "preview": "Собрали лучшие бесплатные ресурсы для изучения Python, JavaScript и Data Science. Курсы от MIT, Stanford и Google — доступны без оплаты.",
    "image": "https://picsum.photos/seed/2/600/400",
    "tags": ["курсы", "программирование", "бесплатно"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 3,
    "date": "2025-04-18",
    "category": "новости",
    "title": "Казахстан увеличивает квоту на зарубежные стипендии на 30%",
    "preview": "Министерство образования объявило о расширении программы «Болашак» и других государственных грантов для обучения за рубежом в 2025–2026 учебном году.",
    "image": "https://picsum.photos/seed/3/600/400",
    "tags": ["болашак", "казахстан", "новости"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 4,
    "date": "2025-04-16",
    "category": "возможности",
    "title": "Стажировка в Google: дедлайн подачи заявок — 1 мая",
    "preview": "Google открыл приём заявок на летнюю стажировку для студентов бакалавриата и магистратуры. Позиции в области разработки, дизайна и маркетинга.",
    "image": "https://picsum.photos/seed/4/600/400",
    "tags": ["стажировка", "google", "IT"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 5,
    "date": "2025-04-14",
    "category": "ресурсы",
    "title": "Гайд: как написать мотивационное письмо для зарубежного университета",
    "preview": "Разбираем структуру идеального мотивационного письма: что писать, чего избегать и как выделиться среди тысяч кандидатов. С примерами и шаблонами.",
    "image": "https://picsum.photos/seed/5/600/400",
    "tags": ["мотивационное письмо", "поступление", "гайд"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 6,
    "date": "2025-04-12",
    "category": "образование",
    "title": "IELTS vs TOEFL: что выбрать для поступления в 2025 году",
    "preview": "Сравниваем два главных экзамена по английскому языку. Какой принимают больше университетов, как долго готовиться и где дешевле сдать.",
    "image": "https://picsum.photos/seed/6/600/400",
    "tags": ["IELTS", "TOEFL", "английский", "экзамен"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 7,
    "date": "2025-04-10",
    "category": "возможности",
    "title": "Erasmus+ 2025: гранты для студентов из СНГ",
    "preview": "Программа Евросоюза для академического обмена открыта для студентов из стран Центральной Азии и СНГ. Покрывает обучение, проживание и дорогу.",
    "image": "https://picsum.photos/seed/7/600/400",
    "tags": ["Erasmus", "грант", "европа", "обмен"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 8,
    "date": "2025-04-08",
    "category": "новости",
    "title": "QS World University Rankings 2025: лучшие университеты мира",
    "preview": "Опубликован ежегодный рейтинг QS. MIT снова первый, а вот азиатские университеты заметно укрепили позиции. Смотри полный список в посте.",
    "image": "https://picsum.photos/seed/8/600/400",
    "tags": ["рейтинг", "университеты", "QS"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 9,
    "date": "2025-04-06",
    "category": "ресурсы",
    "title": "10 сервисов, которые упростят студенческую жизнь",
    "preview": "Notion для заметок, Anki для запоминания, Zotero для источников — собрали 10 инструментов, которые реально экономят время и нервы.",
    "image": "https://picsum.photos/seed/9/600/400",
    "tags": ["инструменты", "продуктивность", "студенту"],
    "tg_link": "https://t.me/Globalstudyy"
  },
  {
    "id": 10,
    "date": "2025-04-04",
    "category": "образование",
    "title": "Как поступить в университет Германии бесплатно в 2025 году",
    "preview": "Германия сохраняет бесплатное образование для иностранных студентов. Разбираем требования, документы и сроки подачи заявок в немецкие вузы.",
    "image": "https://picsum.photos/seed/10/600/400",
    "tags": ["германия", "бесплатное образование", "поступление"],
    "tg_link": "https://t.me/Globalstudyy"
  }
]
```

- [ ] **Шаг 2: Проверить валидность JSON**

```bash
python3 -m json.tool data/posts.json > /dev/null && echo "JSON валиден"
```

Ожидаемый вывод: `JSON валиден`

- [ ] **Шаг 3: Зафиксировать**

```bash
git add data/posts.json
git commit -m "feat: добавить тестовые данные постов"
```

---

## Task 2: Создать `index.html`

**Files:**
- Create: `index.html`

- [ ] **Шаг 1: Создать файл со следующим содержимым**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Global Study — всё для студента в одном месте. Новости, образование, стажировки и полезные ресурсы из Telegram-канала.">
  <meta property="og:title" content="Global Study — всё для студента">
  <meta property="og:description" content="Новости, образование, стажировки и полезные ресурсы для студентов">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://globalstudyy.github.io">
  <title>Global Study — всё для студента</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>

  <header class="header" id="header">
    <nav class="nav container">
      <a href="#" class="nav__logo">Global Study</a>
      <ul class="nav__links" id="navLinks">
        <li><a href="#posts">Главная</a></li>
        <li><a href="#posts" data-category="новости">Новости</a></li>
        <li><a href="#posts" data-category="образование">Образование</a></li>
        <li><a href="#posts" data-category="возможности">Возможности</a></li>
        <li><a href="#posts" data-category="ресурсы">Ресурсы</a></li>
      </ul>
      <a href="https://t.me/Globalstudyy" target="_blank" rel="noopener" class="btn btn--primary">Подписаться</a>
      <button class="burger" id="burger" aria-label="Открыть меню">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </header>

  <section class="hero">
    <div class="container hero__content">
      <h1 class="hero__title">Всё для студента —<br>в одном месте</h1>
      <p class="hero__subtitle">Новости, стипендии, стажировки и полезные ресурсы из Telegram-канала Global Study</p>
      <a href="#posts" class="btn btn--white">Читать последние посты</a>
    </div>
  </section>

  <main class="container" id="posts">
    <div class="filters">
      <div class="filters__categories" id="categories">
        <button class="pill pill--active" data-category="all">Все</button>
        <button class="pill" data-category="новости">Новости</button>
        <button class="pill" data-category="образование">Образование</button>
        <button class="pill" data-category="возможности">Возможности</button>
        <button class="pill" data-category="ресурсы">Ресурсы</button>
      </div>
      <input class="search" id="search" type="search" placeholder="Поиск по постам..." aria-label="Поиск по постам">
    </div>
    <div class="posts-grid" id="postsGrid" aria-live="polite"></div>
    <p class="empty" id="empty" hidden>Ничего не найдено. Попробуй другой запрос.</p>
  </main>

  <section class="cta">
    <div class="container cta__content">
      <h2 class="cta__title">Не пропускай новые посты</h2>
      <p class="cta__text">Подпишись на Telegram-канал и получай актуальную информацию первым</p>
      <a href="https://t.me/Globalstudyy" target="_blank" rel="noopener" class="btn btn--white">Открыть Telegram</a>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer__inner">
      <a href="#" class="footer__logo">Global Study</a>
      <nav class="footer__nav" aria-label="Разделы сайта">
        <a href="#posts" data-category="новости">Новости</a>
        <a href="#posts" data-category="образование">Образование</a>
        <a href="#posts" data-category="возможности">Возможности</a>
        <a href="#posts" data-category="ресурсы">Ресурсы</a>
      </nav>
      <div class="footer__contacts">
        <a href="https://t.me/Globalstudyy" target="_blank" rel="noopener">Telegram</a>
        <a href="mailto:globalgo@gmail.com">globalgo@gmail.com</a>
      </div>
      <p class="footer__copy">© 2025 Global Study. Все права защищены.</p>
    </div>
  </footer>

  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Шаг 2: Открыть в браузере и проверить структуру**

```bash
open index.html
```

Ожидаемый результат: страница открывается, шапка и подвал видны, лента постов пуста (app.js ещё не создан — это нормально).

- [ ] **Шаг 3: Зафиксировать**

```bash
git add index.html
git commit -m "feat: добавить HTML-структуру страницы"
```

---

## Task 3: Создать `styles.css`

**Files:**
- Create: `styles.css`

- [ ] **Шаг 1: Создать файл со следующим содержимым**

```css
/* === ПЕРЕМЕННЫЕ === */
:root {
  --gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  --gradient-light: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  --accent: #6366f1;
  --accent-dark: #4f46e5;
  --bg: #f8f9ff;
  --surface: #ffffff;
  --text: #1e1b4b;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --radius: 12px;
  --shadow: 0 1px 3px rgb(0 0 0 / .08), 0 1px 2px rgb(0 0 0 / .06);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);
  --container: 1200px;
  --header-h: 64px;
  --transition: .2s ease;
}

/* === СБРОС === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
ul { list-style: none; }
button { cursor: pointer; border: none; background: none; font: inherit; }

/* === КОНТЕЙНЕР === */
.container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 1rem;
}

/* === КНОПКИ === */
.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.25rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: .9rem;
  transition: transform var(--transition), box-shadow var(--transition);
  white-space: nowrap;
  cursor: pointer;
}
.btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.btn:active { transform: translateY(0); }
.btn--primary { background: var(--gradient); color: #fff; }
.btn--white { background: #fff; color: var(--accent-dark); }
.btn--outline { border: 1.5px solid var(--accent); color: var(--accent); }
.btn--outline:hover { background: var(--gradient-light); }

/* === ШАПКА === */
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--header-h);
  background: rgba(255, 255, 255, .92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
.nav {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 2rem;
}
.nav__logo {
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
}
.nav__links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}
.nav__links a {
  font-size: .9rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color var(--transition);
}
.nav__links a:hover { color: var(--accent); }

/* === БУРГЕР === */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 28px;
  margin-left: auto;
  padding: 4px;
}
.burger span {
  display: block;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform var(--transition), opacity var(--transition);
}
.burger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.burger--open span:nth-child(2) { opacity: 0; }
.burger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* === HERO === */
.hero {
  background: var(--gradient);
  padding: calc(var(--header-h) + 5rem) 0 5rem;
  text-align: center;
  color: #fff;
}
.hero__content { max-width: 680px; margin: 0 auto; }
.hero__title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.25rem;
}
.hero__subtitle {
  font-size: 1.05rem;
  opacity: .85;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* === ОСНОВНАЯ СЕКЦИЯ === */
main { padding: 3rem 1rem 4rem; }

/* === ФИЛЬТРЫ === */
.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.filters__categories {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  flex: 1;
}
.pill {
  padding: .4rem 1rem;
  border-radius: 999px;
  font-size: .85rem;
  font-weight: 500;
  border: 1.5px solid var(--border);
  color: var(--text-muted);
  background: var(--surface);
  transition: all var(--transition);
}
.pill:hover { border-color: var(--accent); color: var(--accent); }
.pill--active {
  background: var(--gradient);
  border-color: transparent;
  color: #fff;
}
.search {
  padding: .5rem 1.1rem;
  border: 1.5px solid var(--border);
  border-radius: 999px;
  font-size: .9rem;
  outline: none;
  width: 220px;
  transition: border-color var(--transition), box-shadow var(--transition);
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
}
.search:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgb(99 102 241 / .15);
}
.search::placeholder { color: var(--text-muted); }

/* === СЕТКА ПОСТОВ === */
.posts-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

/* === КАРТОЧКА === */
.card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
  display: flex;
  flex-direction: column;
}
.card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }

.card__img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 16 / 9;
}
.card__img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .4s ease;
}
.card:hover .card__img { transform: scale(1.04); }

.card__badge {
  position: absolute;
  top: .75rem; left: .75rem;
  padding: .25rem .75rem;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 600;
}
.badge--образование { background: #dbeafe; color: #1d4ed8; }
.badge--новости     { background: #fee2e2; color: #dc2626; }
.badge--возможности { background: #d1fae5; color: #059669; }
.badge--ресурсы     { background: #fef3c7; color: #d97706; }

.card__body {
  display: flex;
  flex-direction: column;
  gap: .5rem;
  padding: 1.25rem;
  flex: 1;
}
.card__date { font-size: .8rem; color: var(--text-muted); }
.card__title { font-size: 1rem; font-weight: 700; line-height: 1.4; }
.card__preview {
  font-size: .9rem;
  color: var(--text-muted);
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card__link { margin-top: .75rem; align-self: flex-start; }

/* === ПУСТОЕ СОСТОЯНИЕ === */
.empty {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem 0;
  font-size: 1rem;
  grid-column: 1 / -1;
}

/* === CTA СЕКЦИЯ === */
.cta {
  background: var(--gradient);
  padding: 5rem 1rem;
  text-align: center;
  color: #fff;
  margin-top: 2rem;
}
.cta__content { max-width: 540px; margin: 0 auto; }
.cta__title {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 800;
  margin-bottom: 1rem;
}
.cta__text { opacity: .85; margin-bottom: 2rem; font-size: 1.05rem; }

/* === ПОДВАЛ === */
.footer {
  background: var(--text);
  color: rgba(255, 255, 255, .65);
  padding: 3rem 1rem 2rem;
}
.footer__inner {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.footer__logo { font-size: 1.2rem; font-weight: 800; color: #fff; }
.footer__nav { display: flex; flex-wrap: wrap; gap: 1rem; }
.footer__nav a { font-size: .9rem; transition: color var(--transition); }
.footer__nav a:hover { color: #fff; }
.footer__contacts { display: flex; flex-wrap: wrap; gap: 1rem; }
.footer__contacts a { font-size: .9rem; transition: color var(--transition); }
.footer__contacts a:hover { color: #fff; }
.footer__copy { font-size: .8rem; opacity: .45; margin-top: .5rem; }

/* === АНИМАЦИИ === */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-in {
  opacity: 0;
  animation: fadeInUp .4s ease forwards;
}

/* === АДАПТИВНОСТЬ === */
@media (min-width: 600px) {
  .container { padding: 0 1.5rem; }
  .posts-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; }
  .posts-grid { grid-template-columns: repeat(3, 1fr); }
  .footer__inner {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    align-items: start;
  }
  .footer__logo { grid-column: 1; }
  .footer__nav  { grid-column: 2; padding-left: 3rem; }
  .footer__contacts { grid-column: 3; }
  .footer__copy { grid-column: 1 / -1; }
}

@media (max-width: 767px) {
  .burger { display: flex; }
  .nav .btn--primary { display: none; }
  .nav__links {
    display: none;
    position: fixed;
    top: var(--header-h);
    left: 0; right: 0;
    background: var(--surface);
    flex-direction: column;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    gap: 1rem;
    box-shadow: var(--shadow-md);
    z-index: 99;
  }
  .nav__links.open { display: flex; }
  .filters { flex-direction: column; align-items: stretch; }
  .search { width: 100%; }
}
```

- [ ] **Шаг 2: Открыть в браузере и проверить визуал**

```bash
open index.html
```

Ожидаемый результат:
- Шапка фиксирована, градиентный логотип
- Hero с сине-фиолетовым фоном и белым текстом
- Фильтры с таблетками и строкой поиска
- CTA-секция с градиентом
- Тёмный подвал с ссылками
- На мобильном (Developer Tools → responsive): бургер-меню отображается, кнопка «Подписаться» скрыта

- [ ] **Шаг 3: Зафиксировать**

```bash
git add styles.css
git commit -m "feat: добавить все стили (компоненты, сетка, адаптивность)"
```

---

## Task 4: Создать `app.js`

**Files:**
- Create: `app.js`

- [ ] **Шаг 1: Создать файл со следующим содержимым**

```javascript
const postsGrid  = document.getElementById('postsGrid');
const emptyMsg   = document.getElementById('empty');
const searchInput = document.getElementById('search');
const pills       = document.querySelectorAll('.pill');
const burger      = document.getElementById('burger');
const navLinks    = document.getElementById('navLinks');

let allPosts = [];
let activeCategory = 'all';

async function init() {
  try {
    const res = await fetch('data/posts.json');
    if (!res.ok) throw new Error('Ошибка загрузки');
    allPosts = await res.json();
    render(allPosts);
  } catch {
    postsGrid.innerHTML = '<p class="empty">Не удалось загрузить посты. Попробуй позже.</p>';
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function createCard(post, index) {
  return `
    <article class="card fade-in" style="animation-delay:${index * 0.06}s">
      <div class="card__img-wrap">
        <img class="card__img" src="${post.image}" alt="${post.title}" loading="lazy">
        <span class="card__badge badge--${post.category}">${post.category}</span>
      </div>
      <div class="card__body">
        <time class="card__date" datetime="${post.date}">${formatDate(post.date)}</time>
        <h2 class="card__title">${post.title}</h2>
        <p class="card__preview">${post.preview}</p>
        <a class="card__link btn btn--outline"
           href="${post.tg_link}"
           target="_blank"
           rel="noopener noreferrer">
          Читать в Telegram
        </a>
      </div>
    </article>
  `;
}

function render(posts) {
  if (posts.length === 0) {
    postsGrid.innerHTML = '';
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
    postsGrid.innerHTML = posts.map((p, i) => createCard(p, i)).join('');
  }
}

function getFiltered() {
  const query = searchInput.value.trim().toLowerCase();
  return allPosts.filter(post => {
    const matchCat = activeCategory === 'all' || post.category === activeCategory;
    const matchSearch = !query
      || post.title.toLowerCase().includes(query)
      || post.preview.toLowerCase().includes(query)
      || post.tags.some(t => t.toLowerCase().includes(query));
    return matchCat && matchSearch;
  });
}

// Фильтр по категории через таблетки
pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('pill--active'));
    pill.classList.add('pill--active');
    activeCategory = pill.dataset.category;
    render(getFiltered());
  });
});

// Поиск в реальном времени
searchInput.addEventListener('input', () => render(getFiltered()));

// Бургер-меню
burger.addEventListener('click', () => {
  burger.classList.toggle('burger--open');
  navLinks.classList.toggle('open');
  burger.setAttribute('aria-label',
    navLinks.classList.contains('open') ? 'Закрыть меню' : 'Открыть меню');
});

// Клик по ссылкам навигации с data-category (шапка и подвал)
document.querySelectorAll('[data-category]').forEach(link => {
  link.addEventListener('click', e => {
    const cat = link.dataset.category;
    if (!cat) return;
    e.preventDefault();
    activeCategory = cat;
    pills.forEach(p => p.classList.toggle('pill--active', p.dataset.category === cat));
    render(getFiltered());
    searchInput.value = '';
    document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
    navLinks.classList.remove('open');
    burger.classList.remove('burger--open');
  });
});

init();
```

- [ ] **Шаг 2: Запустить локальный сервер и открыть в браузере**

`fetch()` не работает через `file://` — нужен HTTP-сервер:

```bash
python3 -m http.server 8000
```

Затем открыть в браузере: `http://localhost:8000`

**Проверить:**
1. Лента из 10 карточек загрузилась с изображениями, датами и категориями
2. Клик по таблетке «Образование» → остаются только посты категории «образование»
3. Клик «Все» → возвращает все посты
4. Ввод «стипендия» в поиск → отфильтровываются релевантные карточки
5. Кнопка «Читать в Telegram» открывает t.me/Globalstudyy в новой вкладке
6. На мобильном: бургер-меню открывается/закрывается
7. Клик «Новости» в шапке (мобильный) → фильтрует + закрывает меню + скроллит к ленте

- [ ] **Шаг 3: Зафиксировать**

```bash
git add app.js
git commit -m "feat: добавить логику рендера, фильтрации и поиска"
```

---

## Task 5: Настроить GitHub Pages и задеплоить

**Files:**
- Create: `.nojekyll`

- [ ] **Шаг 1: Создать `.nojekyll`**

```bash
touch .nojekyll
```

Этот файл говорит GitHub Pages не обрабатывать проект через Jekyll, чтобы папка `data/` и JSON-файлы отдавались корректно.

- [ ] **Шаг 2: Создать GitHub-репозиторий**

```bash
gh repo create global-study --public --source=. --remote=origin
```

Ожидаемый вывод: `✓ Created repository <username>/global-study on GitHub`

- [ ] **Шаг 3: Зафиксировать `.nojekyll` и запушить всё**

```bash
git add .nojekyll
git commit -m "feat: добавить .nojekyll для GitHub Pages"
git push -u origin main
```

- [ ] **Шаг 4: Включить GitHub Pages**

```bash
gh api repos/:owner/global-study/pages \
  --method POST \
  --field source='{"branch":"main","path":"/"}' \
  --silent && echo "GitHub Pages включён"
```

- [ ] **Шаг 5: Получить URL сайта и открыть**

```bash
gh api repos/:owner/global-study/pages --jq '.html_url'
```

Подождать 1–2 минуты, затем открыть полученный URL в браузере.

Ожидаемый результат: сайт доступен по адресу `https://<username>.github.io/global-study/`

---

## Обновление контента после деплоя

Чтобы добавить новый пост:

1. Открыть `data/posts.json`
2. Добавить новый объект в начало массива:
```json
{
  "id": 11,
  "date": "2025-04-25",
  "category": "образование",
  "title": "Заголовок нового поста",
  "preview": "Краткое описание поста (2–3 предложения).",
  "image": "https://picsum.photos/seed/11/600/400",
  "tags": ["тег1", "тег2"],
  "tg_link": "https://t.me/Globalstudyy/НОМЕР_ПОСТА"
}
```
3. Сохранить и запушить:
```bash
git add data/posts.json
git commit -m "content: добавить пост — <название>"
git push
```

GitHub Pages обновится автоматически за ~1 минуту.
