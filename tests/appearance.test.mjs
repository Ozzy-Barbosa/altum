import test from 'node:test';
import assert from 'node:assert/strict';

const appearance = await import('../src/lib/appearance.mjs').catch(() => ({}));
test('first visit or blocked storage defaults to light regardless of system preference', () => {
  assert.equal(typeof appearance.readTheme, 'function', 'theme reader must exist');
  for (const storage of [null, {getItem:()=>null}, {getItem:()=> 'invalid'}, {getItem(){throw Error('blocked');}}]) {
    assert.equal(appearance.readTheme(storage), 'light');
  }
  assert.equal(appearance.readTheme({getItem:()=> 'dark'}), 'dark');
});
test('switching appearance updates browser chrome without changing motion preference', () => {
  assert.equal(typeof appearance.applyTheme, 'function', 'theme applier must exist');
  const events=[];
  const meta={setAttribute(name,value){this[name]=value;}};
  const doc={documentElement:{dataset:{motion:'paused'},style:{}},querySelector:()=>meta,dispatchEvent:e=>events.push(e.type)};
  appearance.applyTheme('dark',doc);
  assert.equal(doc.documentElement.dataset.theme,'dark');
  assert.equal(doc.documentElement.dataset.motion,'paused');
  assert.equal(doc.documentElement.style.colorScheme,'dark');
  assert.equal(meta.content,'#060a12');
  appearance.applyTheme('light',doc);
  assert.equal(meta.content,'#f8faff');
  assert.deepEqual(events,['altum:theme','altum:theme']);
});
