/** Pointer-driven hero motion; existing transform animations remain owned by CSS. */
export function startHeroInteraction(document, window) {
  const hero = document.querySelector('.hero');
  const scene = hero?.querySelector('.hero-system');
  if (!hero || !scene) return;

  const buttons = [...hero.querySelectorAll('.button')];
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let point = null;
  let attached = false;

  const enabled = () =>
    attached &&
    fine.matches &&
    !reduced.matches &&
    !document.hidden &&
    document.documentElement.dataset.motion !== 'paused';
  const normalized = (coordinate, origin, size) =>
    size > 0 && Number.isFinite(coordinate)
      ? Math.max(-1, Math.min(1, ((coordinate - origin) / size) * 2 - 1))
      : 0;
  const resetButton = (button) => {
    button.style.setProperty('--magnet-x', '0px');
    button.style.setProperty('--magnet-y', '0px');
  };
  const reset = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    point = null;
    scene.style.setProperty('--pointer-x', '0');
    scene.style.setProperty('--pointer-y', '0');
    buttons.forEach(resetButton);
  };
  const render = () => {
    frame = 0;
    if (!enabled() || !point) return reset();
    const rect = hero.getBoundingClientRect();
    scene.style.setProperty('--pointer-x', String(normalized(point.x, rect.left, rect.width)));
    scene.style.setProperty('--pointer-y', String(normalized(point.y, rect.top, rect.height)));
    buttons.forEach(resetButton);
    if (point.button) {
      const bounds = point.button.getBoundingClientRect();
      if (
        point.x >= bounds.left &&
        point.x <= bounds.left + bounds.width &&
        point.y >= bounds.top &&
        point.y <= bounds.top + bounds.height
      ) {
        point.button.style.setProperty(
          '--magnet-x',
          `${normalized(point.x, bounds.left, bounds.width) * 4}px`,
        );
        point.button.style.setProperty(
          '--magnet-y',
          `${normalized(point.y, bounds.top, bounds.height) * 4}px`,
        );
      }
    }
  };
  const onMove = (event) => {
    if (!enabled() || event.pointerType === 'touch') return;
    const candidate = event.target?.closest?.('.button');
    point = {
      x: event.clientX,
      y: event.clientY,
      button: buttons.includes(candidate) ? candidate : null,
    };
    if (!frame) frame = window.requestAnimationFrame(render);
  };
  const buttonLeaves = buttons.map((button) => [
    button,
    () => {
      resetButton(button);
      if (point?.button === button) point.button = null;
    },
  ]);
  const detach = () => {
    attached = false;
    reset();
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', reset);
    buttonLeaves.forEach(([button, onLeave]) =>
      button.removeEventListener('pointerleave', onLeave),
    );
    document.removeEventListener('altum:motion', reset);
    document.removeEventListener('visibilitychange', reset);
    fine.removeEventListener('change', reset);
    reduced.removeEventListener('change', reset);
    window.removeEventListener('blur', reset);
    window.removeEventListener('pagehide', onPageHide);
  };
  const onPageHide = (event) => {
    detach();
    if (!event.persisted) window.removeEventListener('pageshow', onPageShow);
  };
  const onPageShow = (event) => {
    if (event.persisted) attach();
  };
  const attach = () => {
    if (attached) return;
    attached = true;
    reset();
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerleave', reset);
    buttonLeaves.forEach(([button, onLeave]) => button.addEventListener('pointerleave', onLeave));
    document.addEventListener('altum:motion', reset);
    document.addEventListener('visibilitychange', reset);
    fine.addEventListener('change', reset);
    reduced.addEventListener('change', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('pagehide', onPageHide);
  };

  window.addEventListener('pageshow', onPageShow);
  attach();
}
