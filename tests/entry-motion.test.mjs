import test from 'node:test';
import assert from 'node:assert/strict';

const { startEntryMotion } = await import('../src/lib/entry-motion.mjs').catch(() => ({}));

function page({ paused = false, reduced = false } = {}) {
  const document = new EventTarget();
  document.documentElement = { dataset: { motion: paused ? 'paused' : 'playing' } };
  const main = new EventTarget();
  document.getElementById = () => main;
  const media = new EventTarget();
  media.matches = reduced;
  const window = new EventTarget();
  window.matchMedia = () => media;
  window.setTimeout = globalThis.setTimeout;
  window.clearTimeout = globalThis.clearTimeout;
  return { document, window, main, media, root: document.documentElement };
}

function start(p) {
  assert.equal(typeof startEntryMotion, 'function', 'document entrance initializer must exist');
  startEntryMotion(p.document, p.window);
}

test('a fresh document enters and always returns to visible resting state within 800ms', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  start(p);
  assert.equal(p.root.dataset.entry, 'active');
  t.mock.timers.tick(800);
  assert.equal(p.root.dataset.entry, undefined);
});

test('paused and reduced-motion documents never enter', () => {
  for (const options of [{ paused: true }, { reduced: true }]) {
    const p = page(options);
    start(p);
    assert.equal(p.root.dataset.entry, undefined);
  }
});

test('pausing during entrance ends it immediately and resuming does not replay', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  start(p);
  p.root.dataset.motion = 'paused';
  p.document.dispatchEvent(new Event('altum:motion'));
  assert.equal(p.root.dataset.entry, undefined);
  p.root.dataset.motion = 'playing';
  p.document.dispatchEvent(new Event('altum:motion'));
  assert.equal(p.root.dataset.entry, undefined);
});

test('a changed system motion preference cancels the active entrance', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  start(p);
  p.media.matches = true;
  p.media.dispatchEvent(new Event('change'));
  assert.equal(p.root.dataset.entry, undefined);
});

test('navigation away and a cached restore leave content immediately visible', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const type of ['pagehide', 'pageshow']) {
    const p = page();
    start(p);
    const event = new Event(type);
    Object.defineProperty(event, 'persisted', { value: true });
    p.window.dispatchEvent(event);
    assert.equal(p.root.dataset.entry, undefined);
  }
});

test('ordinary pageshow and unrelated animations do not end the new document entrance', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  start(p);
  p.window.dispatchEvent(new Event('pageshow'));
  const unrelated = new Event('animationend');
  Object.defineProperty(unrelated, 'animationName', { value: 'float-one' });
  p.main.dispatchEvent(unrelated);
  assert.equal(p.root.dataset.entry, 'active');
  const finished = new Event('animationend');
  Object.defineProperty(finished, 'animationName', { value: 'altum-document-entry' });
  p.main.dispatchEvent(finished);
  assert.equal(p.root.dataset.entry, undefined);
});
