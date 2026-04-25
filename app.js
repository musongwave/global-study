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
