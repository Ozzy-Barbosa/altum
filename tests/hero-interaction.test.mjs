import test from 'node:test';
import assert from 'node:assert/strict';

const { startHeroInteraction } = await import('../src/lib/hero-interaction.mjs').catch(() => ({}));

function element(rect) {
  const node = new EventTarget();
  const values = new Map();
  node.style = {
    setProperty: (name, value) => values.set(name, value),
    getPropertyValue: (name) => values.get(name) ?? '',
  };
  node.getBoundingClientRect = () => rect;
  return node;
}

function page({ paused = false, reduced = false, fine = true } = {}) {
  const document = new EventTarget();
  document.documentElement = { dataset: { motion: paused ? 'paused' : 'playing' } };
  document.hidden = false;
  const hero = element({ left: 100, top: 50, width: 800, height: 400 });
  const scene = element({ left: 500, top: 50, width: 400, height: 400 });
  const button = element({ left: 200, top: 250, width: 200, height: 80 });
  const secondButton = element({ left: 500, top: 250, width: 200, height: 80 });
  button.closest = () => button;
  secondButton.closest = () => secondButton;
  hero.closest = () => null;
  hero.querySelector = () => scene;
  hero.querySelectorAll = () => [button, secondButton];
  document.querySelector = () => hero;
  const reducedMedia = new EventTarget();
  reducedMedia.matches = reduced;
  const fineMedia = new EventTarget();
  fineMedia.matches = fine;
  const frames = new Map();
  let nextFrame = 0;
  const window = new EventTarget();
  window.matchMedia = (query) =>
    query.includes('prefers-reduced-motion') ? reducedMedia : fineMedia;
  window.requestAnimationFrame = (callback) => {
    frames.set(++nextFrame, callback);
    return nextFrame;
  };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback());
  };
  return {
    document,
    window,
    hero,
    scene,
    button,
    secondButton,
    reducedMedia,
    fineMedia,
    frames,
    flush,
  };
}

function start(p) {
  assert.equal(typeof startHeroInteraction, 'function', 'hero interaction initializer must exist');
  startHeroInteraction(p.document, p.window);
}

function move(p, x, y, { target = p.hero, pointerType = 'mouse' } = {}) {
  const event = new Event('pointermove');
  Object.defineProperties(event, {
    clientX: { value: x },
    clientY: { value: y },
    pointerType: { value: pointerType },
    target: { value: target },
  });
  p.hero.dispatchEvent(event);
  return event;
}

function scenePosition(p) {
  return ['--pointer-x', '--pointer-y'].map((name) => p.scene.style.getPropertyValue(name));
}

function buttonPosition(button) {
  return ['--magnet-x', '--magnet-y'].map((name) => button.style.getPropertyValue(name));
}

test('moving over hero copy drives the scene using the complete hero bounds', () => {
  const p = page();
  start(p);
  move(p, 300, 150);
  p.flush();
  assert.deepEqual(scenePosition(p), ['-0.5', '-0.5']);
});

test('outlying coordinates clamp scene motion to its normalized bounds', () => {
  const p = page();
  start(p);
  move(p, -100, 1000);
  p.flush();
  assert.deepEqual(scenePosition(p), ['-1', '1']);
});

test('an empty hero box produces finite neutral motion', () => {
  const p = page();
  p.hero.getBoundingClientRect = () => ({ left: 100, top: 50, width: 0, height: 0 });
  start(p);
  move(p, 150, 100);
  p.flush();
  assert.deepEqual(scenePosition(p), ['0', '0']);
});

test('only the hovered button receives a small magnetic offset', () => {
  const p = page();
  start(p);
  move(p, 350, 310, { target: p.button });
  p.flush();
  assert.deepEqual(buttonPosition(p.button), ['2px', '2px']);
  assert.deepEqual(buttonPosition(p.secondButton), ['0px', '0px']);
  move(p, 700, 330, { target: p.secondButton });
  p.flush();
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
  assert.deepEqual(buttonPosition(p.secondButton), ['4px', '4px']);
});

test('moving into hero copy or leaving a button restores its magnetic offset', () => {
  const p = page();
  start(p);
  move(p, 400, 330, { target: p.button });
  p.flush();
  p.button.dispatchEvent(new Event('pointerleave'));
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
  move(p, 400, 330, { target: p.button });
  p.flush();
  move(p, 450, 200);
  p.flush();
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
});

test('a captured pointer outside a button cannot keep its magnetic offset active', () => {
  const p = page();
  start(p);
  move(p, 450, 350, { target: p.button });
  p.flush();
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
});

test('touch, coarse pointer, reduced motion, pause and hidden documents ignore interaction', () => {
  for (const options of [
    { fine: false },
    { reduced: true },
    { paused: true },
    { touch: true },
    { hidden: true },
  ]) {
    const p = page(options);
    p.document.hidden = Boolean(options.hidden);
    start(p);
    move(p, 400, 330, { target: p.button, pointerType: options.touch ? 'touch' : 'mouse' });
    p.flush();
    assert.deepEqual(scenePosition(p), ['0', '0']);
    assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
    assert.equal(p.frames.size, 0);
  }
});

test('pointer events share one requested frame and never start a continuing loop', () => {
  const p = page();
  start(p);
  move(p, 300, 150);
  move(p, 700, 350);
  assert.equal(p.frames.size, 1);
  p.flush();
  assert.deepEqual(scenePosition(p), ['0.5', '0.5']);
  assert.equal(p.frames.size, 0);
});

test('leaving the hero, losing focus or hiding the page resets motion and cancels pending work', () => {
  for (const [surface, type] of [
    ['hero', 'pointerleave'],
    ['window', 'blur'],
    ['document', 'visibilitychange'],
  ]) {
    const p = page();
    start(p);
    move(p, 400, 330, { target: p.button });
    p.flush();
    move(p, 350, 310, { target: p.button });
    p[surface].dispatchEvent(new Event(type));
    assert.deepEqual(scenePosition(p), ['0', '0']);
    assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
    assert.equal(p.frames.size, 0);
  }
});

test('pause and preference changes reset active motion and prevent further updates', () => {
  for (const preference of ['paused', 'reduced', 'coarse']) {
    const p = page();
    start(p);
    move(p, 400, 330, { target: p.button });
    p.flush();
    move(p, 350, 310, { target: p.button });
    if (preference === 'paused') {
      p.document.documentElement.dataset.motion = 'paused';
      p.document.dispatchEvent(new Event('altum:motion'));
    } else {
      const media = preference === 'reduced' ? p.reducedMedia : p.fineMedia;
      media.matches = preference === 'reduced';
      media.dispatchEvent(new Event('change'));
    }
    assert.deepEqual(scenePosition(p), ['0', '0']);
    assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
    assert.equal(p.frames.size, 0);
    move(p, 400, 330, { target: p.button });
    p.flush();
    assert.deepEqual(scenePosition(p), ['0', '0']);
  }
});

test('a motion restriction set before the requested frame prevents its update', () => {
  const p = page();
  start(p);
  move(p, 400, 330, { target: p.button });
  p.document.documentElement.dataset.motion = 'paused';
  p.flush();
  assert.deepEqual(scenePosition(p), ['0', '0']);
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
});

test('navigation away stops interaction and a cached restore reconnects it once', () => {
  const p = page();
  start(p);
  move(p, 400, 330, { target: p.button });
  const hidden = new Event('pagehide');
  Object.defineProperty(hidden, 'persisted', { value: true });
  p.window.dispatchEvent(hidden);
  assert.deepEqual(scenePosition(p), ['0', '0']);
  assert.deepEqual(buttonPosition(p.button), ['0px', '0px']);
  assert.equal(p.frames.size, 0);
  move(p, 400, 330, { target: p.button });
  assert.equal(p.frames.size, 0);
  const restored = new Event('pageshow');
  Object.defineProperty(restored, 'persisted', { value: true });
  p.window.dispatchEvent(restored);
  p.window.dispatchEvent(restored);
  move(p, 300, 150);
  assert.equal(p.frames.size, 1);
  p.flush();
  assert.deepEqual(scenePosition(p), ['-0.5', '-0.5']);
});

test('a permanent navigation removes the restore hook', () => {
  const p = page();
  start(p);
  p.window.dispatchEvent(new Event('pagehide'));
  const restored = new Event('pageshow');
  Object.defineProperty(restored, 'persisted', { value: true });
  p.window.dispatchEvent(restored);
  move(p, 300, 150);
  assert.equal(p.frames.size, 0);
});

test('interaction leaves existing animation transforms and navigation events intact', () => {
  const p = page();
  p.scene.style.setProperty('transform', 'rotate(4deg)');
  p.button.style.setProperty('translate', '0 -2px');
  start(p);
  const event = move(p, 400, 330, { target: p.button });
  p.flush();
  assert.equal(p.scene.style.getPropertyValue('transform'), 'rotate(4deg)');
  assert.equal(p.button.style.getPropertyValue('translate'), '0 -2px');
  assert.equal(event.defaultPrevented, false);
});
