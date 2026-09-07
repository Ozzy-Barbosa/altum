import test from 'node:test';
import assert from 'node:assert/strict';
import { seed, transition } from '../src/lib/demo-domain.mjs';
import {
  businessSeed,
  businessTransition,
  quoteTotals,
  financeSummary,
} from '../src/lib/business-domain.mjs';
const today = '2026-09-07';
test('financial reports use cents, separate months and exclude no categories', () => {
  const rows = [
    { kind: 'Ingreso', amount: 0.1, date: today },
    { kind: 'Ingreso', amount: 0.2, date: today },
    { kind: 'Gasto', amount: 0.1, date: today },
    { kind: 'Gasto', amount: 500, date: '2026-08-01' },
  ];
  assert.deepEqual(financeSummary(rows, '2026-09'), { income: 0.3, expense: 0.1, net: 0.2 });
});
test('quote calculations round discounts in cents and reject invalid amounts or quantities', () => {
  assert.deepEqual(quoteTotals([{ quantity: 3, price: 10.05 }], 10), {
    subtotal: 30.15,
    discount: 3.02,
    total: 27.13,
  });
  for (const [lines, discount] of [
    [[], 0],
    [[{ quantity: 0, price: 1 }], 0],
    [[{ quantity: 1.5, price: 1 }], 0],
    [[{ quantity: 1, price: -1 }], 0],
    [[{ quantity: 1, price: 10 }], 101],
  ])
    assert.throws(() => quoteTotals(lines, discount));
});
test('transaction validation does not mutate state on invalid dates and negative values', () => {
  const state = businessSeed('finanzas', today),
    snapshot = structuredClone(state);
  const record = {
    concept: 'Compra',
    kind: 'Gasto',
    category: 'Materiales',
    date: '2026-02-30',
    amount: 100,
  };
  assert.throws(() =>
    businessTransition('finanzas', state, { type: 'transaction.save', record }, today),
  );
  assert.throws(() =>
    businessTransition(
      'finanzas',
      state,
      { type: 'transaction.save', record: { ...record, date: today, amount: -10 } },
      today,
    ),
  );
  assert.deepEqual(state, snapshot);
  const next = businessTransition(
    'finanzas',
    state,
    { type: 'transaction.save', record: { ...record, date: today } },
    today,
  );
  assert.equal(next.transactions.length, state.transactions.length + 1);
  assert.equal(next.transactions[0].amount, 100);
});
test('CRM stage changes validate IDs and remain isolated from other workspaces', () => {
  const state = seed('crm'),
    original = structuredClone(state);
  const next = transition('crm', state, { type: 'lead.stage', id: 'l1', stage: 'Ganado' });
  assert.equal(next.leads[0].stage, 'Ganado');
  assert.deepEqual(state, original);
  assert.throws(() =>
    transition('crm', state, { type: 'lead.stage', id: 'l1', stage: 'Inventada' }),
  );
  assert.throws(() => transition('crm', state, { type: 'lead.delete', id: 'absent' }));
});
test('quote folios stay unique after deletion; expired-before-creation dates rejected', () => {
  const state = businessSeed('cotizaciones', today);
  const record = { ...state.quotes[0] };
  assert.throws(() =>
    businessTransition(
      'cotizaciones',
      state,
      { type: 'quote.save', record: { ...record, validUntil: '2026-09-01' } },
      today,
    ),
  );
  const created = businessTransition('cotizaciones', state, { type: 'quote.save', record }, today);
  assert.equal(created.quotes[0].number, 3);
  const deleted = businessTransition(
    'cotizaciones',
    created,
    { type: 'quote.delete', id: created.quotes[0].id },
    today,
  );
  const next = businessTransition('cotizaciones', deleted, { type: 'quote.save', record }, today);
  assert.equal(next.quotes[0].number, 4);
  assert.equal(next.quotes[0].lines[0].description, record.lines[0].description);
});
test('service history records each new stage once and survives edits', () => {
  const state = businessSeed('servicios', today);
  const next = businessTransition(
    'servicios',
    state,
    { type: 'job.stage', id: 'j1', stage: 'Lista', note: 'Revisión final.' },
    today,
  );
  assert.equal(next.jobs[0].history.length, 3);
  assert.equal(next.jobs[0].history.at(-1).note, 'Revisión final.');
  const same = businessTransition(
    'servicios',
    next,
    { type: 'job.stage', id: 'j1', stage: 'Lista' },
    today,
  );
  assert.equal(same.jobs[0].history.length, 3);
  const edited = businessTransition(
    'servicios',
    same,
    { type: 'job.save', id: 'j1', record: { ...same.jobs[0], assignee: 'QA' } },
    today,
  );
  assert.equal(edited.jobs[0].history.length, 3);
  assert.equal(edited.jobs[0].status, 'Lista');
  assert.equal(state.jobs[0].status, 'Diagnóstico');
});
test('all new modules reset independently to valid example records', () => {
  for (const module of ['finanzas', 'crm', 'cotizaciones', 'servicios'])
    assert.deepEqual(transition(module, { invalid: true }, { type: 'reset' }), seed(module));
});
