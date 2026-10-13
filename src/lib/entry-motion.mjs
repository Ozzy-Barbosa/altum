const enteredDocuments = new WeakSet();

/** Assemble the first scene once; the resting document is visible without JS. */
export function startEntryMotion(document, window) {
  if (enteredDocuments.has(document)) return;
  enteredDocuments.add(document);
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const main = document.getElementById('contenido');
  if (
    !main ||
    typeof main.animate !== 'function' ||
    root.dataset.motion === 'paused' ||
    media.matches
  )
    return;

  const groups = new Set();
  let observer;
  let stopped = false;
  let starting = true;
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const visible = (element, fraction = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const height = rect.height || rect.bottom - rect.top;
    const overlap = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return height > 0 && overlap > 0 && overlap / height >= fraction;
  };
  const settle = () => {
    if (starting || stopped || groups.size) return;
    delete root.dataset.entry;
    if (!observer) finish();
  };
  const finish = () => {
    if (stopped) return;
    stopped = true;
    observer?.disconnect();
    observer = undefined;
    for (const group of groups) group.finish();
    groups.clear();
    delete root.dataset.entry;
    document.removeEventListener('altum:motion', onMotion);
    media.removeEventListener('change', onMotion);
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('pageshow', onPageShow);
    window.removeEventListener('beforeprint', finish);
  };
  const onMotion = () => {
    if (root.dataset.motion === 'paused' || media.matches) finish();
  };
  const onPageShow = (event) => {
    if (event.persisted) finish();
  };

  // Each run owns only its own effects. Cancelling them restores the CSS float,
  // pointer response and original SVG styles rather than freezing the scene.
  const run = (build) => {
    if (stopped) return;
    const animations = new Set();
    let timer;
    let complete = false;
    const group = {
      finish() {
        if (complete) return;
        complete = true;
        window.clearTimeout(timer);
        for (const animation of animations) {
          animation.removeEventListener('finish', done);
          animation.cancel();
        }
        groups.delete(group);
        settle();
      },
    };
    let remaining = 0;
    const done = () => {
      remaining -= 1;
      if (remaining === 0) group.finish();
    };
    groups.add(group);
    const animate = (element, frames, duration, delay = 0) => {
      if (!element || typeof element.animate !== 'function') return;
      const animation = element.animate(frames, {
        duration,
        delay,
        easing: ease,
        fill: 'backwards',
      });
      animations.add(animation);
      remaining += 1;
      animation.addEventListener('finish', done, { once: true });
    };
    build(animate);
    if (!remaining) {
      group.finish();
      return;
    }
    root.dataset.entry = 'active';
    // A throttled tab or interrupted browser animation must still return to rest.
    timer = window.setTimeout(() => group.finish(), 2200);
  };
  const textEntrance = (animate, scope, homepage) => {
    if (!scope) return;
    const lift = (element, delay, distance = '18px', duration = 760) => {
      if (!visible(element)) return;
      animate(
        element,
        [
          { opacity: 0, transform: `translateY(${distance})` },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        duration,
        delay,
      );
    };
    lift(scope.querySelector(homepage ? ':scope > .eyebrow' : '.eyebrow'), 60, '12px', 650);
    const lines = [...scope.querySelectorAll('.hero-line')];
    if (lines.length) lines.forEach((line, index) => lift(line, 120 + index * 130, '105%', 900));
    else lift(scope.querySelector('h1'), 120, '24px', 900);
    lift(scope.querySelector('.lead'), 260);
    lift(scope.querySelector('.actions'), 360, '12px');
    lift(scope.querySelector('.contact-jump-links'), 360, '12px');
    scope
      .querySelectorAll('.hero-proof > span')
      .forEach((item, index) => lift(item, 450 + index * 70, '10px', 650));
    for (const selector of ['.contact-signal', '.profile-portrait']) {
      const illustration = scope.querySelector(selector);
      if (visible(illustration))
        animate(
          illustration,
          [
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1 },
          ],
          900,
          180,
        );
    }
  };
  const sceneEntrance = (scene) =>
    run((animate) => {
      animate(
        scene.querySelector('.hero-arrival'),
        [
          { opacity: 0, scale: 0.35 },
          { opacity: 0.8, scale: 0.8, offset: 0.4 },
          { opacity: 0, scale: 1.25 },
        ],
        1500,
      );
      animate(
        scene.querySelector('.atom-svg'),
        [
          { opacity: 0, scale: 0.68 },
          { opacity: 1, scale: 1 },
        ],
        1250,
        80,
      );
      animate(
        scene.querySelector('.system-core img'),
        [
          { opacity: 0, scale: 0.72 },
          { opacity: 1, scale: 1 },
        ],
        1000,
        200,
      );
      scene.querySelectorAll('.atom-track').forEach((track, index) => {
        animate(
          track,
          [
            { strokeDasharray: '1', strokeDashoffset: 1 },
            { strokeDasharray: '1', strokeDashoffset: 0 },
          ],
          1200,
          150 + index * 90,
        );
      });
      scene.querySelectorAll('.floating-card').forEach((card, index) => {
        animate(
          card,
          [
            { opacity: 0, scale: 0.88 },
            { opacity: 1, scale: 1 },
          ],
          800,
          350 + index * 150,
        );
      });
      animate(
        scene.querySelector('.system-core > span'),
        [{ opacity: 0 }, { opacity: 1 }],
        650,
        600,
      );
      animate(scene.querySelector('.system-caption'), [{ opacity: 0 }, { opacity: 1 }], 650, 750);
    });

  const prepareScene = (scene) => {
    if (!scene || scene.getBoundingClientRect().bottom <= 0) return;
    if (visible(scene, 0.2)) {
      sceneEntrance(scene);
    } else if (typeof window.IntersectionObserver === 'function') {
      observer = new window.IntersectionObserver(
        (entries) => {
          if (stopped || !observer) return;
          const seen = entries.some(
            (entry) =>
              entry.target === scene && entry.isIntersecting && entry.intersectionRatio >= 0.2,
          );
          if (!seen) return;
          observer.disconnect();
          observer = undefined;
          try {
            sceneEntrance(scene);
          } catch {
            finish();
          }
        },
        { threshold: 0.2, rootMargin: '0px' },
      );
      observer.observe(scene);
    }
  };

  document.addEventListener('altum:motion', onMotion);
  media.addEventListener('change', onMotion);
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', onPageShow);
  window.addEventListener('beforeprint', finish);
  try {
    const hero = main.querySelector('.hero');
    run((animate) => {
      animate(document.querySelector('.header'), [{ opacity: 0 }, { opacity: 1 }], 650);
      textEntrance(
        animate,
        hero ? hero.querySelector('.hero-copy') : main.querySelector('.page-hero'),
        Boolean(hero),
      );
    });
    if (hero) prepareScene(hero.querySelector('.hero-system'));
  } catch {
    finish();
  }
  starting = false;
  settle();
}
