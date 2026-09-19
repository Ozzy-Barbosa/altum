import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsAppBrief } from '../src/lib/whatsapp-brief.ts';

const input = {
  name: ' María ',
  business: ' A&M ',
  project: 'Aplicación móvil',
  goal: 'Quiero organizar mis citas & clientes.\nCon avisos 📱.',
  consent: true,
};

test('WhatsApp draft targets Altum and preserves accents, ampersands and newlines', () => {
  const { message, url } = buildWhatsAppBrief(input);
  const destination = new URL(url);
  assert.equal(destination.origin, 'https://wa.me');
  assert.equal(destination.pathname, '/526122125198');
  assert.equal(destination.searchParams.get('text'), message);
  assert.match(message, /Nombre: María\nNegocio o marca: A&M/);
  assert.ok(message.includes(input.goal));
  assert.match(message, /No solicito una suscripción/);
});

test('WhatsApp draft permits an optional business without requesting email', () => {
  const { message } = buildWhatsAppBrief({ ...input, business: '' });
  assert.ok(!message.includes('Negocio o marca:'));
  assert.ok(!message.includes('undefined'));
  assert.ok(!message.includes('Correo:'));
});

test('WhatsApp draft rejects absent consent and empty or short required fields', () => {
  for (const overrides of [
    { consent: false },
    { name: '  ' },
    { project: '' },
    { goal: '              ' },
    { goal: 'corta' },
  ]) {
    assert.throws(() => buildWhatsAppBrief({ ...input, ...overrides }));
  }
});

test('WhatsApp draft enforces field length limits', () => {
  for (const overrides of [
    { name: 'a'.repeat(81) },
    { business: 'a'.repeat(101) },
    { project: 'a'.repeat(151) },
    { goal: 'a'.repeat(1001) },
  ]) {
    assert.throws(() => buildWhatsAppBrief({ ...input, ...overrides }));
  }
  assert.ok(buildWhatsAppBrief({ ...input, goal: 'a'.repeat(1000) }).url);
});
