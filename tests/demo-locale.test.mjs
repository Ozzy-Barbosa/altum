import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { inflateSync } from 'node:zlib';
import { createQuotePdf } from '../src/lib/quote-pdf.ts';
import english from '../src/i18n/interactive-en.json' with { type: 'json' };
import { seed, searchDocuments } from '../src/lib/demo-domain.mjs';
import { buildWhatsAppBrief } from '../src/lib/whatsapp-brief.ts';
const messages = await import('../src/i18n/messages.mjs').catch(() => ({}));
test('English search examples find the original records, and visible categories are searchable', () => {
  const hint = messages.ui('Prueba con “envíos”, “cita” o “inventario”', 'en');
  for (const word of hint.matchAll(/“([^”]+)”/g)) assert.ok(searchDocuments(seed('search').documents, word[1]).length, word[1]);
  assert.equal(typeof messages.matchesVisibleText, 'function');
  assert.equal(messages.matchesVisibleText('Services', ['Trabajo', 'Servicios', messages.ui('Servicios', 'en')]), true);
});
test('fixed chart and all-category controls translate, but visitor categories do not', () => {
  assert.equal(messages.ui('Ingresos', 'en'), 'Income');
  assert.equal(messages.ui('Gastos', 'en'), 'Expenses');
  const finance = fs.readFileSync('src/components/demos/FinanceDemo.tsx', 'utf8');
  assert.match(finance, /<span>\{ui\(label\)\}<\/span>/);
  for (const file of ['CatalogDemo.tsx', 'SearchDemo.tsx']) {
    const source = fs.readFileSync(`src/components/demos/${file}`, 'utf8');
    assert.match(source, /\{index === 0 \? ui\(c\) : c\}/);
  }
});
test('all authored React interface literals have a curated English translation', () => {
  const missing = new Set();
  for (const file of fs.readdirSync('src/components/demos').filter((f) => f.endsWith('.tsx'))) {
    const source = ts.createSourceFile(file, fs.readFileSync(`src/components/demos/${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function walk(node) {
      if (ts.isCallExpression(node) && node.expression.getText(source) === 'ui' && ts.isStringLiteral(node.arguments[0])) {
        const key = node.arguments[0].text.replace(/\s+/g, ' ').trim();
        if (!english[key]) missing.add(key);
      }
      ts.forEachChild(node, walk);
    }
    walk(source);
  }
  assert.deepEqual([...missing], []);
});
test('English quote PDF translates labels without changing visitor text or totals', () => {
  const quote = {number: 12, title: 'Noticias', customer: 'Servicios', date: '2026-10-13', validUntil: '', notes: 'Texto del visitante', discount: 0, lines: [{description: 'Trabajo personalizado', quantity: 2, price: 125}]};
  const before = JSON.stringify(quote);
  const document = createQuotePdf(quote, 'en').output();
  const text = [...document.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)].map((match) => inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1')).join('\n');
  assert.match(text, /Prepared for: Servicios/);
  assert.match(text, /Trabajo personalizado/);
  assert.match(text, /MX\$250\.00/);
  assert.equal(JSON.stringify(quote), before);
});
test('translations never enter form values, machine attributes or React state', () => {
  const failures = [];
  for (const file of fs.readdirSync('src/components/demos').filter((f) => f.endsWith('.tsx'))) {
    const source = ts.createSourceFile(file, fs.readFileSync(`src/components/demos/${file}`, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    function walk(node) {
      if (ts.isJsxAttribute(node) && ['defaultValue', 'value', 'className', 'type', 'name'].includes(node.name.getText(source)) && /\bui\(/.test(node.initializer?.getText(source) || '')) failures.push(`${file}: ${node.getText(source)}`);
      ts.forEachChild(node, walk);
    }
    walk(source);
  }
  assert.deepEqual(failures, []);
});
test('UI copy and money support both languages without changing amounts', () => {
  assert.equal(typeof messages.ui, 'function');
  assert.equal(messages.ui('Guardar', 'en'), 'Save');
  assert.equal(messages.ui('Guardar', 'es'), 'Guardar');
  assert.match(messages.formatMoney(1234.56, 'en'), /1,234.56/);
  assert.match(messages.formatMoney(1234.56, 'en'), /MX/);
  assert.equal(messages.ui('Escribe al menos {count} caracteres.', 'en', { count: 15 }), 'Enter at least 15 characters.');
});
test('English WhatsApp draft preserves visitor text, recipient and consent separation', () => {
  const data = { name: 'Servicios', business: 'Noticias', project: 'Web design', goal: 'Necesito una página para mi negocio.', consent: true };
  const before = JSON.stringify(data);
  const draft = buildWhatsAppBrief(data, 'en');
  assert.match(draft.message, /Name: Servicios/);
  assert.match(draft.message, /Business or brand: Noticias/);
  assert.match(draft.message, /Necesito una página para mi negocio\./);
  assert.match(draft.message, /not requesting a newsletter subscription/);
  assert.equal(new URL(draft.url).pathname, '/526122125198');
  assert.equal(JSON.stringify(data), before);
});
