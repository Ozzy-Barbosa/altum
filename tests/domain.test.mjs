import test from 'node:test';
import assert from 'node:assert/strict';
import {
  seed,
  transition,
  totals,
  overlaps,
  slots,
  searchDocuments,
  localDate,
} from '../src/lib/demo-domain.mjs';
test('stock exit cannot go below zero and does not mutate original data', () => {
  const s = seed('inventario');
  assert.throws(
    () =>
      transition('inventario', s, {
        type: 'stock.move',
        id: 'i2',
        direction: 'Salida',
        quantity: 5,
        reason: 'Test',
      }),
    /existencias/,
  );
  assert.equal(s.products.find((p) => p.id === 'i2').stock, 4);
});
test('stock movement changes units and preserves an audit entry', () => {
  const s = transition('inventario', seed('inventario'), {
    type: 'stock.move',
    id: 'i2',
    direction: 'Entrada',
    quantity: 10,
    reason: 'Entrega de ejemplo',
    newId: 'test',
    at: '2026-09-07T12:00:00Z',
  });
  assert.equal(s.products.find((p) => p.id === 'i2').stock, 14);
  assert.equal(s.movements[0].quantity, 10);
});
test('checkout calculates shipping thresholds and reduces stock once', () => {
  const s = seed('commerce');
  assert.equal(totals(s.products, { c1: 1 }, 'envio').total, 470);
  assert.equal(totals(s.products, { c1: 3 }, 'envio').shipping, 0);
  const n = transition('commerce', s, {
    type: 'order.create',
    cart: { c1: 2 },
    delivery: 'envio',
    newId: 'test',
  });
  assert.equal(n.products[0].stock, 10);
  assert.equal(n.orders[0].total, 860);
  assert.equal(s.orders.length, 0);
});
test('empty, excessive and inactive product orders are rejected', () => {
  const s = seed('menu');
  assert.throws(() => transition('menu', s, { type: 'order.create', cart: {} }), /Agrega/);
  assert.throws(() => totals(s.products, { m1: 21 }), /Solo hay/);
  s.products[0].active = false;
  assert.throws(() => totals(s.products, { m1: 1 }), /disponible/);
});
test('reservation overlap respects service duration and cancellations', () => {
  const b = [
    { professional: 'Alex', date: '2099-01-05', start: 600, duration: 90, status: 'Confirmada' },
  ];
  assert.equal(overlaps(b, 'Alex', '2099-01-05', '11:00', 60), true);
  assert.equal(overlaps(b, 'Alex', '2099-01-05', '11:30', 60), false);
  assert.equal(overlaps(b, 'Daniela', '2099-01-05', '10:00', 60), false);
  b[0].status = 'Cancelada';
  assert.equal(overlaps(b, 'Alex', '2099-01-05', '10:00', 60), false);
});
test('booking blocks conflicting slot and cancellation releases it', () => {
  const a = {
    type: 'booking.create',
    serviceId: 's3',
    professional: 'Alex',
    date: '2099-01-05',
    time: '10:00',
    name: 'Cliente de ejemplo',
    newId: 'test',
  };
  const n = transition('agenda', seed('agenda'), a);
  assert.throws(() => transition('agenda', n, a), /disponible/);
  assert.equal(slots(n, 's1', 'Alex', a.date).includes('11:00'), false);
  const canceled = transition('agenda', n, { type: 'booking.cancel', id: 'test' });
  assert.equal(slots(canceled, 's1', 'Alex', a.date).includes('10:00'), true);
});
test('past dates and closing-time overruns are excluded', () => {
  const s = seed('agenda');
  assert.deepEqual(slots(s, 's1', 'Alex', '2020-01-01'), []);
  assert.equal(slots(s, 's3', 'Alex', '2099-01-05').includes('17:00'), false);
  assert.match(localDate(), /^\d{4}-\d{2}-\d{2}$/);
});
test('product inputs reject negative prices and fractional stock', () => {
  const a = { name: 'Café', category: 'Café', price: 10, stock: 1, min: 0 };
  assert.throws(
    () =>
      transition('inventario', seed('inventario'), {
        type: 'product.save',
        product: { ...a, stock: 1.5 },
      }),
    /entero/,
  );
  assert.throws(
    () =>
      transition('inventario', seed('inventario'), {
        type: 'product.save',
        product: { ...a, price: -1 },
      }),
    /Precio/,
  );
});
test('search ignores accents, respects category, and can return empty results', () => {
  const s = seed('search');
  assert.equal(searchDocuments(s.documents, 'envios')[0].id, 'd3');
  assert.equal(searchDocuments(s.documents, 'reserva', 'Operación').length, 0);
  assert.equal(searchDocuments(s.documents, 'zzzzzz').length, 0);
});
test('task transitions, edit, delete and module reset work independently', () => {
  let s = seed('proyectos');
  s = transition('proyectos', s, { type: 'task.move', id: 't1', status: 'Terminado' });
  assert.equal(s.tasks[0].status, 'Terminado');
  s = transition('proyectos', s, { type: 'task.delete', id: 't1' });
  assert.equal(s.tasks.length, 3);
  assert.equal(transition('proyectos', s, { type: 'reset' }).tasks.length, 4);
});
test('document CRUD is searchable and bounded', () => {
  let s = transition('search', seed('search'), {
    type: 'document.save',
    newId: 'custom',
    document: {
      title: 'Garantía de muestra',
      category: 'Políticas',
      body: 'Cobertura de ejemplo durante treinta días.',
    },
  });
  assert.equal(searchDocuments(s.documents, 'garantia')[0].id, 'custom');
  s = transition('search', s, { type: 'document.delete', id: 'custom' });
  assert.equal(searchDocuments(s.documents, 'garantia').length, 0);
});
