import test from 'node:test';
import assert from 'node:assert/strict';
import { startEntryMotion } from '../src/lib/entry-motion.mjs';

// Node has no DOM or animation engine. Record the browser boundary while the
// real coordinator performs selection, choreography and lifecycle cleanup.
class Element extends EventTarget {
  constructor(name, rect = { top: 50, bottom: 200, height: 150 }) {
    super();
    Object.assign(this, { name, rect, nodes: {}, animations: [] });
  }
  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
  querySelectorAll(selector) {
    return this.nodes[selector] ?? [];
  }
  getBoundingClientRect() {
    return this.rect;
  }
  animate(frames, options) {
    const animation = new EventTarget();
    Object.assign(animation, {
      frames,
      options,
      cancelled: false,
      cancel() {
        this.cancelled = true;
      },
      complete() {
        this.dispatchEvent(new Event('finish'));
      },
    });
    this.animations.push(animation);
    return animation;
  }
}

function page({
  paused = false,
  reduced = false,
  sceneTop = 150,
  heroBottom = 650,
  interior = false,
} = {}) {
  const document = new Element('document');
  document.documentElement = { dataset: { motion: paused ? 'paused' : 'playing' } };
  const main = new Element('main');
  const header = new Element('header');
  const hero = new Element('hero', { top: heroBottom - 600, bottom: heroBottom, height: 600 });
  const copy = new Element('copy', hero.rect);
  const names = [
    'eyebrow',
    'line-one',
    'line-two',
    'line-three',
    'lead',
    'actions',
    'proof-one',
    'proof-two',
  ];
  const text = Object.fromEntries(names.map((name) => [name, new Element(name, hero.rect)]));
  copy.nodes = {
    ':scope > .eyebrow': [text.eyebrow],
    '.eyebrow': [text.eyebrow],
    '.hero-line': [text['line-one'], text['line-two'], text['line-three']],
    h1: [text['line-one']],
    '.lead': [text.lead],
    '.actions': [text.actions],
    '.hero-proof > span': [text['proof-one'], text['proof-two']],
  };
  const scene = new Element('scene', { top: sceneTop, bottom: sceneTop + 500, height: 500 });
  const artNames = [
    'arrival',
    'atom',
    'logo',
    'track-one',
    'track-two',
    'track-three',
    'card-one',
    'card-two',
    'card-three',
    'core-caption',
    'caption',
  ];
  const art = Object.fromEntries(artNames.map((name) => [name, new Element(name, scene.rect)]));
  scene.nodes = {
    '.hero-arrival': [art.arrival],
    '.atom-svg': [art.atom],
    '.system-core img': [art.logo],
    '.atom-track': [art['track-one'], art['track-two'], art['track-three']],
    '.floating-card': [art['card-one'], art['card-two'], art['card-three']],
    '.system-core > span': [art['core-caption']],
    '.system-caption': [art.caption],
  };
  hero.nodes = interior ? copy.nodes : { '.hero-copy': [copy], '.hero-system': [scene] };
  main.nodes = { '.hero': interior ? [] : [hero], '.page-hero': interior ? [hero] : [] };
  document.nodes = { '.header': [header] };
  document.getElementById = () => main;
  const media = new EventTarget();
  media.matches = reduced;
  const window = new EventTarget();
  Object.assign(window, {
    innerHeight: 800,
    matchMedia: () => media,
    setTimeout: globalThis.setTimeout,
    clearTimeout: globalThis.clearTimeout,
  });
  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.disconnected = false;
      observers.push(this);
    }
    observe(target) {
      this.target = target;
    }
    disconnect() {
      this.disconnected = true;
    }
    enter(isIntersecting = true) {
      this.callback([
        { target: this.target, isIntersecting, intersectionRatio: isIntersecting ? 0.5 : 0 },
      ]);
    }
  };
  const all = [header, ...Object.values(text), ...Object.values(art), main];
  return {
    document,
    window,
    media,
    main,
    header,
    hero,
    copy,
    text,
    scene,
    art,
    observers,
    all,
    root: document.documentElement,
  };
}

function begin(t, options) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page(options);
  startEntryMotion(p.document, p.window);
  return p;
}

test('homepage enters in readable stages while existing scene movement remains independent', (t) => {
  const p = begin(t);
  assert.equal(p.header.animations.length, 1);
  const lines = ['line-one', 'line-two', 'line-three'].map((name) => p.text[name].animations[0]);
  assert.ok(lines.every(Boolean), 'each headline line receives its own entrance');
  assert.ok(
    lines[0].options.delay < lines[1].options.delay &&
      lines[1].options.delay < lines[2].options.delay,
  );
  assert.ok(
    p.text.actions.animations[0].options.delay > p.text.eyebrow.animations[0].options.delay,
  );
  assert.equal(p.main.animations.length, 0, 'downstream content remains visible');
  for (const name of ['atom', 'logo', 'card-one', 'card-two', 'card-three']) {
    const animation = p.art[name].animations[0];
    assert.ok(animation, `${name} enters`);
    assert.ok(animation.frames.some((frame) => Number(frame.scale) < 1));
    assert.ok(
      animation.frames.every((frame) => !('transform' in frame) && !('translate' in frame)),
    );
  }
  assert.ok(p.header.animations[0].frames.every((frame) => !('transform' in frame)));
  assert.ok(
    p.art['track-one'].animations[0].frames.some((frame) => Number(frame.strokeDashoffset) === 1),
  );
  assert.ok(
    p.art['card-three'].animations[0].options.delay > p.art['card-one'].animations[0].options.delay,
  );
  t.mock.timers.tick(2200);
  assert.equal(p.root.dataset.entry, undefined);
  assert.ok(p.all.flatMap((node) => node.animations).every((animation) => animation.cancelled));
});

test('finishing effects releases only entrance animations', (t) => {
  const p = begin(t);
  const ambient = {
    cancelled: false,
    cancel() {
      this.cancelled = true;
    },
  };
  p.scene.getAnimations = () => [ambient];
  const owned = p.all.flatMap((node) => node.animations);
  assert.ok(owned.length > 5);
  owned.forEach((animation) => animation.complete());
  assert.equal(p.root.dataset.entry, undefined);
  assert.ok(owned.every((animation) => animation.cancelled));
  assert.equal(ambient.cancelled, false);
});

test('below-fold scene waits visibly for its first view and runs once', (t) => {
  const p = begin(t, { sceneTop: 950 });
  assert.equal(p.art.atom.animations.length, 0);
  assert.equal(p.observers.length, 1);
  assert.equal(p.observers[0].target, p.scene);
  p.observers[0].enter(false);
  assert.equal(p.art.atom.animations.length, 0);
  t.mock.timers.tick(2200);
  p.observers[0].enter();
  assert.equal(p.art.atom.animations.length, 1);
  assert.equal(p.observers[0].disconnected, true);
  p.observers[0].enter();
  assert.equal(p.art.atom.animations.length, 1);
  t.mock.timers.tick(2200);
  assert.ok(p.art.atom.animations[0].cancelled);
  assert.equal(p.root.dataset.entry, undefined);
});

test('reload restored below the hero skips its text and scene', (t) => {
  const p = begin(t, { sceneTop: -700, heroBottom: -100 });
  assert.equal(p.text['line-one'].animations.length, 0);
  assert.equal(p.art.atom.animations.length, 0);
  assert.equal(p.observers.length, 0);
});

test('interior titles share the entrance without requiring homepage markup', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page({ interior: true });
  delete p.hero.nodes['.hero-line'];
  startEntryMotion(p.document, p.window);
  assert.equal(p.text['line-one'].animations.length, 1);
  assert.equal(p.text.lead.animations.length, 1);
  assert.equal(p.text.actions.animations.length, 1);
  assert.equal(p.art.atom.animations.length, 0);
  t.mock.timers.tick(2200);
  assert.equal(p.root.dataset.entry, undefined);
});

test('paused and reduced-motion preferences start no effects or observer', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const options of [{ paused: true }, { reduced: true }]) {
    const p = page({ ...options, sceneTop: 950 });
    startEntryMotion(p.document, p.window);
    assert.equal(p.root.dataset.entry, undefined);
    assert.equal(p.observers.length, 0);
    assert.equal(p.all.flatMap((node) => node.animations).length, 0);
  }
});

test('pausing cancels active effects and the deferred scene permanently', (t) => {
  const p = begin(t, { sceneTop: 950 });
  assert.ok(p.header.animations[0], 'header entrance starts before cancellation');
  p.root.dataset.motion = 'paused';
  p.document.dispatchEvent(new Event('altum:motion'));
  assert.equal(p.root.dataset.entry, undefined);
  assert.ok(p.header.animations[0].cancelled);
  assert.equal(p.observers[0].disconnected, true);
  p.root.dataset.motion = 'playing';
  p.document.dispatchEvent(new Event('altum:motion'));
  p.observers[0].enter();
  assert.equal(p.art.atom.animations.length, 0);
});

test('system preference, navigation away, cached restore and printing restore resting content', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const reason of ['reduced', 'pagehide', 'pageshow', 'beforeprint']) {
    const p = page({ sceneTop: 950 });
    startEntryMotion(p.document, p.window);
    assert.ok(p.header.animations[0], 'header entrance starts before cancellation');
    if (reason === 'reduced') {
      p.media.matches = true;
      p.media.dispatchEvent(new Event('change'));
    } else {
      const event = new Event(reason);
      Object.defineProperty(event, 'persisted', { value: true });
      p.window.dispatchEvent(event);
    }
    assert.equal(p.root.dataset.entry, undefined, reason);
    assert.ok(p.header.animations[0].cancelled, reason);
    assert.equal(p.observers[0].disconnected, true, reason);
  }
});

test('ordinary pageshow does not abort a fresh entrance', (t) => {
  const p = begin(t);
  assert.ok(p.header.animations[0], 'header entrance starts');
  p.window.dispatchEvent(new Event('pageshow'));
  assert.equal(p.root.dataset.entry, 'active');
  assert.equal(p.header.animations[0].cancelled, false);
  t.mock.timers.tick(2200);
});

test('unsupported animation APIs leave content at rest', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  p.all.forEach((node) => {
    node.animate = undefined;
  });
  startEntryMotion(p.document, p.window);
  assert.equal(p.root.dataset.entry, undefined);
  assert.equal(p.all.flatMap((node) => node.animations).length, 0);
});

test('animation setup failure cleans already started effects without hiding content', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const p = page();
  p.text['line-two'].animate = () => {
    throw new Error('unsupported keyframes');
  };
  assert.doesNotThrow(() => startEntryMotion(p.document, p.window));
  assert.equal(p.root.dataset.entry, undefined);
  assert.ok(p.all.flatMap((node) => node.animations).every((animation) => animation.cancelled));
});
