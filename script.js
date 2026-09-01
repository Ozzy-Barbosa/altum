'use strict';

document.documentElement.classList.add('js');

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress span');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const closeMenu = ({ returnFocus = false } = {}) => {
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Abrir menú');
  if (returnFocus) toggle?.focus();
};

toggle?.addEventListener('click', () => {
  const open = nav?.classList.toggle('open') ?? false;
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    closeMenu({ returnFocus: true });
  }
});

addEventListener('resize', () => {
  if (innerWidth > 700 && nav?.classList.contains('open')) closeMenu();
}, { passive: true });

const updateScroll = () => {
  header?.classList.toggle('scrolled', scrollY > 24);
  const available = document.documentElement.scrollHeight - innerHeight;
  if (progress) {
    const percentage = available > 0 ? Math.min((scrollY / available) * 100, 100) : 0;
    progress.style.width = `${percentage}%`;
  }
};

let scrollFrame = 0;
addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScroll();
    scrollFrame = 0;
  });
}, { passive: true });
updateScroll();

const revealElements = [...document.querySelectorAll('.reveal')];
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px' });

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]:not(.nav-cta)')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

const glow = document.querySelector('.cursor-glow');
if (glow && finePointer && !reducedMotion) {
  addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

const logoStage = document.getElementById('logo-stage');
if (logoStage && finePointer && !reducedMotion) {
  logoStage.addEventListener('pointermove', (event) => {
    const rect = logoStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    logoStage.style.setProperty('--ry', `${x * 7}deg`);
    logoStage.style.setProperty('--rx', `${y * -7}deg`);
  }, { passive: true });

  logoStage.addEventListener('pointerleave', () => {
    logoStage.style.setProperty('--ry', '0deg');
    logoStage.style.setProperty('--rx', '0deg');
  });
}

const canvas = document.getElementById('hero-canvas');
if (canvas && !reducedMotion) {
  const context = canvas.getContext('2d');
  let dots = [];
  let animationFrame = 0;
  let resizeFrame = 0;
  let canvasVisible = true;

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height || !context) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = Array.from({ length: 42 }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 0.13,
      vy: (Math.random() - 0.5) * 0.13,
      radius: Math.random() * 1.2 + 0.3
    }));
  };

  const drawCanvas = () => {
    if (!context || !canvasVisible || document.hidden) {
      animationFrame = 0;
      return;
    }

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    dots.forEach((point, index) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) point.vx *= -1;
      if (point.y < 0 || point.y > height) point.vy *= -1;

      context.beginPath();
      context.fillStyle = 'rgba(49,139,255,.48)';
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fill();

      for (let next = index + 1; next < dots.length; next += 1) {
        const other = dots[next];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance >= 120) continue;
        context.beginPath();
        context.strokeStyle = `rgba(37,103,205,${(1 - distance / 120) * 0.12})`;
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    });

    animationFrame = requestAnimationFrame(drawCanvas);
  };

  const startCanvas = () => {
    if (!animationFrame && canvasVisible && !document.hidden) {
      animationFrame = requestAnimationFrame(drawCanvas);
    }
  };

  const stopCanvas = () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  resizeCanvas();
  startCanvas();

  if ('IntersectionObserver' in window) {
    const canvasObserver = new IntersectionObserver(([entry]) => {
      canvasVisible = entry.isIntersecting;
      if (canvasVisible) startCanvas();
      else stopCanvas();
    }, { threshold: 0 });
    canvasObserver.observe(canvas);
  }

  addEventListener('resize', () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeCanvas();
      startCanvas();
      resizeFrame = 0;
    });
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopCanvas();
    else startCanvas();
  });
}

const projectForm = document.getElementById('project-form');
const formStatus = document.getElementById('form-status');
projectForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!projectForm.reportValidity()) return;

  const data = new FormData(projectForm);
  const value = (name) => String(data.get(name) || '').trim();
  const message = [
    'Hola Altum, quiero iniciar un proyecto.',
    '',
    `Nombre: ${value('name')}`,
    `Negocio o marca: ${value('business')}`,
    `Sitio o red actual: ${value('current') || 'No indicado'}`,
    `Tipo de proyecto: ${value('service')}`,
    `Objetivo principal: ${value('goal')}`,
    `Inversión estimada: ${value('budget')}`,
    `Fecha ideal: ${value('timeline')}`,
    `Detalles: ${value('details') || 'Sin detalles adicionales'}`
  ].join('\n');

  const submit = projectForm.querySelector('.form-submit');
  submit?.setAttribute('aria-busy', 'true');
  if (formStatus) formStatus.textContent = 'Abriendo WhatsApp con tu solicitud…';

  window.open(
    `https://wa.me/526122125198?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer'
  );

  setTimeout(() => submit?.removeAttribute('aria-busy'), 800);
});
