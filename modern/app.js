const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const topbar = document.querySelector('.topbar');
const animatedItems = [...document.querySelectorAll('.js-animate')];
const magneticButtons = [...document.querySelectorAll('.btn')];

function onScrollHeader() {
  if (!topbar) return;
  topbar.classList.toggle('scrolled', window.scrollY > 14);
}

function setupReveal() {
  if (reducedMotion || !animatedItems.length) {
    animatedItems.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const index = Number(el.dataset.index || 0);
        const delay = Number(el.dataset.delay || 0) + index * 70;
        el.style.setProperty('--delay', `${delay}ms`);
        el.classList.add('in-view');
        obs.unobserve(el);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
  );

  const groups = document.querySelectorAll('.cards .js-animate, .portfolio-grid .js-animate, .steps .js-animate');
  groups.forEach((el, i) => {
    el.dataset.index = String(i % 4);
  });

  animatedItems.forEach((el) => observer.observe(el));
}

function setupMagneticButtons() {
  if (reducedMotion) return;

  magneticButtons.forEach((btn) => {
    btn.classList.add('magnetic');

    btn.addEventListener('mousemove', (event) => {
      const rect = btn.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}


function setupPortfolioSpotlight() {
  const items = [...document.querySelectorAll('.portfolio-item')];
  if (!items.length) return;

  const activate = (item) => {
    items.forEach((card) => {
      const video = card.querySelector('.portfolio-video');
      const isActive = card === item;
      card.classList.toggle('is-active', isActive);

      if (!video) return;
      video.controls = isActive;
      if (isActive) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  items.forEach((item, index) => {
    item.addEventListener('mouseenter', () => activate(item));
    item.addEventListener('focusin', () => activate(item));
    if (index === 0) activate(item);
  });
}

function setupParallax() {
  if (reducedMotion) return;

  const hero = document.querySelector('#inicio');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * 0.08, 32);
    hero.style.transform = `translate3d(0, ${offset}px, 0)`;
  }, { passive: true });
}

onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });
setupReveal();
setupMagneticButtons();
setupPortfolioSpotlight();
setupParallax();
