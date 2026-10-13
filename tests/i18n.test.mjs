import { test } from 'node:test';
import assert from 'node:assert/strict';
import { translateHtml } from '../src/i18n/static-html.mjs';
import { parse } from 'parse5';
import es from '../src/i18n/es.json' with { type: 'json' };
import en from '../src/i18n/en.json' with { type: 'json' };

const routing = await import('../src/i18n/routing.mjs').catch(() => ({}));
test('translated category labels retain the values used by real catalog filtering', () => {
  const output = translateHtml('<select><option>Alimentos</option></select><article data-category="Alimentos"></article>', { Alimentos: 'Food' });
  const body = parse(output).childNodes.find((n) => n.tagName === 'html').childNodes.find((n) => n.tagName === 'body');
  const option = body.childNodes[0].childNodes[0];
  const card = body.childNodes[1];
  assert.equal(option.attrs.find((a) => a.name === 'value')?.value, card.attrs.find((a) => a.name === 'data-category').value);
  assert.equal(option.childNodes[0].value, 'Food');
});
test('same-origin absolute links keep the chosen language; external clients stay external', () => {
  const output = translateHtml('<a href="https://www.altumlapaz.com/proyectos/orthomax/?a=1#avance">Orthomax</a><a href="https://www.orthomaxlapaz.com/">Client</a>');
  assert.match(output, /href="https:\/\/www.altumlapaz.com\/en\/proyectos\/orthomax\/\?a=1#avance"/);
  assert.match(output, /href="https:\/\/www.orthomaxlapaz.com\/"/);
});
test('literal dollar symbols in curated translations stay literal', () => {
  assert.match(translateHtml('<p>Precio</p>', { Precio: '$& USD' }), /\$&amp; USD/);
});
test('locale links preserve deep routes, query and hash without double prefixes', () => {
  assert.equal(typeof routing.localizePath, 'function');
  assert.equal(routing.localizePath('/proyectos/orthomax/?a=1#avance', 'en'), '/en/proyectos/orthomax/?a=1#avance');
  assert.equal(routing.localizePath('/en/proyectos/orthomax/?a=1#avance', 'es'), '/proyectos/orthomax/?a=1#avance');
  assert.equal(routing.localizePath('/en/contacto/', 'en'), '/en/contacto/');
  for (const path of ['https://example.com/', 'mailto:altumlapaz@gmail.com', '/assets/a.png', '#contacto', '/soluciones/rss.xml']) assert.equal(routing.localizePath(path, 'en'), path);
});
test('all reviewed source strings have a nonempty English equivalent', () => {
  for (const key of es) assert.ok(en[key]?.trim(), key);
});
test('static translation preserves scripts, values and language links while translating copy', () => {
  const output = translateHtml('<html><head><title>Inicio</title><script type="application/ld+json">{"@type":"WebPage","name":"Inicio","inLanguage":"es-MX","url":"https://www.altumlapaz.com/contacto/"}</script></head><body><a href="/contacto/">Contacto</a><a data-language-link="es" href="/">ES</a><input name="x" value="Servicios" placeholder="Tu nombre"><script>const name="Servicios";</script></body></html>');
  assert.match(output, /<title>Home<\/title>/);
  assert.match(output, /href="\/en\/contacto\/"/);
  assert.match(output, /data-language-link="es" href="\/"/);
  assert.match(output, /value="Servicios"/);
  assert.match(output, /const name="Servicios"/);
  assert.match(output, /"inLanguage":"en"/);
  assert.match(output, /https:\/\/www.altumlapaz.com\/en\/contacto\//);
});
test('language defaults to Spanish and only the en route changes it', () => {
  assert.equal(typeof routing.getLocale, 'function');
  assert.equal(routing.getLocale('/en/contacto/'), 'en');
  assert.equal(routing.getLocale('/contacto/?lang=en'), 'es');
});
