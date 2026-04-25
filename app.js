// === ЭЛЕМЕНТЫ ===
const postsGrid   = document.getElementById('postsGrid');
const emptyMsg    = document.getElementById('empty');
const searchInput = document.getElementById('search');
const pills       = document.querySelectorAll('.pill');
const header      = document.getElementById('header');
const menuBtn     = document.getElementById('menuBtn');
const mobileMenu  = document.getElementById('mobileMenu');
const menuText    = menuBtn.querySelector('.menu-text');

let allPosts = [];
let activeCategory = 'all';

// === ПОСТЫ: ЗАГРУЗКА И РЕНДЕР ===
async function init() {
  try {
    const res = await fetch('data/posts.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    allPosts = await res.json();
    render(allPosts);
  } catch (err) {
    console.error('Ошибка загрузки постов:', err);
    postsGrid.innerHTML = '<p class="empty">Не удалось загрузить посты. Попробуй позже.</p>';
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : d.toLocaleDateString('ru-RU', {
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
        <a class="card__link btn btn--outline-gold"
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

// Таблетки-фильтры
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

// === ШАПКА: СКРОЛЛ ===
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// === МОБИЛЬНОЕ МЕНЮ (FULLSCREEN) ===
function toggleMenu(force) {
  const open = typeof force === 'boolean' ? force : !mobileMenu.classList.contains('active');
  menuBtn.classList.toggle('active', open);
  mobileMenu.classList.toggle('active', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuText.textContent = open ? 'закрыть' : 'меню';
  menuBtn.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}

menuBtn.addEventListener('click', () => toggleMenu());

// Ссылки с data-category (шапка + мобильное меню + подвал)
document.querySelectorAll('a[data-category]').forEach(link => {
  link.addEventListener('click', e => {
    const cat = link.dataset.category;
    if (!cat) return;
    e.preventDefault();
    activeCategory = cat;
    pills.forEach(p => p.classList.toggle('pill--active', p.dataset.category === cat));
    render(getFiltered());
    searchInput.value = '';
    document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
    toggleMenu(false);
  });
});

// Закрыть меню при клике на ссылку без data-category
document.querySelectorAll('.mobile-link:not([data-category])').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// === SCROLL REVEAL (IntersectionObserver) ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === VANTA GLOBE ===
window.addEventListener('load', () => {
  if (typeof VANTA !== 'undefined') {
    VANTA.GLOBE({
      el: '#heroBg',
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
      backgroundColor: 0x0a0a0a
    });
  }

  // === VANILLA TILT ===
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
      max: 12, speed: 400, glare: true, 'max-glare': 0.12
    });
    VanillaTilt.init(document.querySelectorAll('.uni-card'), {
      max: 8, speed: 300, scale: 1.03
    });
  }
});

// === КАРУСЕЛЬ УНИВЕРСИТЕТОВ ===
const uniCarousel = document.getElementById('uniCarousel');
const prevBtn = document.getElementById('prevUni');
const nextBtn = document.getElementById('nextUni');

if (uniCarousel && prevBtn && nextBtn) {
  const scrollAmt = 300;
  prevBtn.addEventListener('click', () => uniCarousel.scrollBy({ left: -scrollAmt, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => uniCarousel.scrollBy({ left: scrollAmt, behavior: 'smooth' }));
}

// === МОДАЛ УНИВЕРСИТЕТОВ ===
const uniModal   = document.getElementById('uniModal');
const closeModal = document.getElementById('closeModal');
const modalBody  = document.getElementById('modalBody');

if (uniModal) {
  document.querySelectorAll('.uni-card').forEach(card => {
    const open = () => {
      const details = card.querySelector('.uni-details');
      if (!details) return;
      modalBody.innerHTML = details.innerHTML;
      uniModal.classList.add('active');
      uniModal.setAttribute('aria-hidden', 'false');
      closeModal.focus();
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  const closeUniModal = () => {
    uniModal.classList.remove('active');
    uniModal.setAttribute('aria-hidden', 'true');
  };

  closeModal.addEventListener('click', closeUniModal);
  uniModal.addEventListener('click', e => { if (e.target === uniModal) closeUniModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && uniModal.classList.contains('active')) closeUniModal(); });
}

init();
