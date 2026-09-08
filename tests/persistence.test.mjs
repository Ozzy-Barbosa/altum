import test from 'node:test';
import assert from 'node:assert/strict';
import { seed, transition } from '../src/lib/demo-domain.mjs';
import {
  localKey,
  parseSnapshot,
  readSnapshot,
  writeSnapshot,
} from '../src/lib/local-persistence.mjs';
const storage = () => {
  const map = new Map();
  return { getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
};
test('legacy workspaces load without losing data and gain a revision on save', () => {
  const db = storage(),
    initial = seed('personal');
  const raw = JSON.stringify({ version: 2, data: initial });
  db.setItem(localKey('personal'), raw);
  const read = readSnapshot(db, 'personal', initial);
  assert.deepEqual(read.data, initial);
  const saved = writeSnapshot(db, 'personal', initial, read.raw, initial);
  assert.equal(JSON.parse(saved.raw).revision, 1);
  assert.equal(db.getItem(localKey('personal') + ':previous'), raw);
});
test('stale writes cannot overwrite the latest snapshot or recovery copy', () => {
  const db = storage(),
    initial = seed('personal');
  const baseline = writeSnapshot(db, 'personal', initial, null, initial);
  const changed = { ...initial, budget: { ...initial.budget, income: 31000 } };
  const next = writeSnapshot(db, 'personal', changed, baseline.raw, initial);
  assert.throws(
    () => writeSnapshot(db, 'personal', initial, baseline.raw, initial),
    /otra pestaña/,
  );
  assert.equal(db.getItem(localKey('personal')), next.raw);
  assert.equal(db.getItem(localKey('personal') + ':previous'), baseline.raw);
});
test('corrupt primary data recovers the prior valid snapshot', () => {
  const db = storage(),
    initial = seed('soporte');
  const first = writeSnapshot(db, 'soporte', initial, null, initial);
  writeSnapshot(db, 'soporte', initial, first.raw, initial);
  db.setItem(localKey('soporte'), '{broken');
  const recovered = readSnapshot(db, 'soporte', initial);
  assert.equal(recovered.recovered, true);
  assert.deepEqual(recovered.data, initial);
});
test('module mismatches and malformed required fields are rejected', () => {
  const initial = seed('personal');
  assert.equal(
    parseSnapshot(
      JSON.stringify({ version: 2, module: 'soporte', data: initial }),
      'personal',
      initial,
    ),
    null,
  );
  assert.equal(
    parseSnapshot(
      JSON.stringify({ version: 2, data: { ...initial, goals: {} } }),
      'personal',
      initial,
    ),
    null,
  );
  assert.equal(
    parseSnapshot(JSON.stringify({ version: 9, data: initial }), 'personal', initial),
    null,
  );
  assert.equal(
    parseSnapshot(JSON.stringify({ version: 2, revision: -1, data: initial }), 'personal', initial),
    null,
  );
});
test('unavailable storage leaves the demo usable and reports no persistent save', () => {
  const unavailable = {
    getItem() {
      throw Error('blocked');
    },
    setItem() {
      throw Error('blocked');
    },
  };
  const initial = seed('personal');
  assert.deepEqual(readSnapshot(unavailable, 'personal', initial).data, initial);
  assert.equal(writeSnapshot(unavailable, 'personal', initial, null, initial).saved, false);
});
test('resetting one module leaves all other modules intact', () => {
  const db = storage(),
    a = seed('personal'),
    b = seed('soporte');
  writeSnapshot(db, 'personal', a, null, a);
  const before = writeSnapshot(db, 'soporte', b, null, b);
  const current = readSnapshot(db, 'personal', a);
  writeSnapshot(
    db,
    'personal',
    transition('personal', current.data, { type: 'reset' }),
    current.raw,
    a,
  );
  assert.equal(db.getItem(localKey('soporte')), before.raw);
});
