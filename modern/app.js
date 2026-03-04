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


function setupProcessEvolution() {
  const steps = [...document.querySelectorAll('.steps .step')];
  const progressFill = document.querySelector('#process-progress-fill');
  const stage = document.querySelector('#process-stage');
  if (!steps.length || !progressFill || !stage) return;

  const stageDetails = {
    1: {
      title: 'Imersão estratégica',
      text: 'Mapeamos cenário, objetivos e público para definir o porquê de cada criativo antes da produção começar.'
    },
    2: {
      title: 'Conceito e roteiro',
      text: 'Traduzimos a estratégia em conceito e roteiro para que cada peça tenha função clara na jornada comercial.'
    },
    3: {
      title: 'Produção e pós',
      text: 'Executamos captação e edição com consistência para garantir qualidade criativa sem perder velocidade de negócio.'
    },
    4: {
      title: 'Distribuição e desdobramentos',
      text: 'Distribuímos versões por canal e meta para conectar cada formato ao resultado esperado: alcance, retenção e conversão.'
    }
  };

  const updateStage = (nextStep) => {
    const current = Math.min(Math.max(nextStep, 1), steps.length);
    steps.forEach((step, index) => {
      const isActive = index + 1 === current;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-selected', String(isActive));
      step.tabIndex = isActive ? 0 : -1;
    });

    const percent = (current / steps.length) * 100;
    progressFill.style.width = `${percent}%`;

    const content = stageDetails[current];
    stage.innerHTML = `<h3>${content.title}</h3><p>${content.text}</p>`;
  };

  steps.forEach((step, index) => {
    const target = index + 1;
    step.addEventListener('click', () => updateStage(target));
    step.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        updateStage(target);
      }
    });
  });

  updateStage(1);
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
setupProcessEvolution();
setupPortfolioSpotlight();
setupParallax();
