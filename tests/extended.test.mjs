import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extendedSeed,
  extendedTransition,
  goalSummary,
  personalSummary,
} from '../src/lib/extended-domain.mjs';
const day = '2026-09-07';
test('personal budget uses exact cents and shows overspending', () => {
  assert.deepEqual(personalSummary({ income: 10.3, fixed: 9.1, variable: 2.2, debt: 0 }), {
    income: 10.3,
    expense: 11.3,
    available: -1,
  });
});
test('contributions preserve state, complete goals and reject excess', () => {
  const s = extendedSeed('personal', day),
    before = structuredClone(s);
  const n = extendedTransition(
    'personal',
    s,
    { type: 'contribution.save', id: 'g1', record: { amount: 15000, date: day, note: 'Ejemplo' } },
    day,
  );
  assert.equal(goalSummary(n.goals[0]).percent, 100);
  assert.deepEqual(s, before);
  assert.throws(() =>
    extendedTransition(
      'personal',
      n,
      { type: 'contribution.save', id: 'g1', record: { amount: 0.01, date: day } },
      day,
    ),
  );
});
test('goal validation rejects invalid dates and target below saved amount', () => {
  const s = extendedSeed('personal', day);
  for (const r of [
    { name: 'Meta', target: 100, monthly: 2, date: day },
    { name: 'Meta', target: 20000, monthly: 2, date: '2026-02-30' },
  ])
    assert.throws(() =>
      extendedTransition('personal', s, { type: 'goal.save', id: 'g1', record: r }, day),
    );
});
test('tickets retain history after metadata edits and folios do not repeat', () => {
  let s = extendedSeed('soporte', day);
  s = extendedTransition(
    'soporte',
    s,
    { type: 'ticket.reply', id: 't1', record: { status: 'Resuelto', note: 'Prueba terminada' } },
    day,
  );
  s = extendedTransition(
    'soporte',
    s,
    { type: 'ticket.save', id: 't1', record: { ...s.tickets[0], subject: 'Actualizado' } },
    day,
  );
  assert.equal(s.tickets[0].history.length, 2);
  assert.equal(s.tickets[0].status, 'Resuelto');
  const record = { ...s.tickets[0] };
  s = extendedTransition('soporte', s, { type: 'ticket.save', record }, day);
  const created = s.tickets[0];
  s = extendedTransition('soporte', s, { type: 'ticket.delete', id: created.id }, day);
  s = extendedTransition('soporte', s, { type: 'ticket.save', record }, day);
  assert.equal(s.tickets[0].number, 5);
});
test('ticket replies reject empty notes and invalid statuses without mutation', () => {
  const s = extendedSeed('soporte', day),
    before = structuredClone(s);
  for (const record of [
    { status: 'Resuelto', note: '' },
    { status: 'Desconocido', note: 'Nota' },
  ])
    assert.throws(() =>
      extendedTransition('soporte', s, { type: 'ticket.reply', id: 't1', record }, day),
    );
  assert.deepEqual(s, before);
});
