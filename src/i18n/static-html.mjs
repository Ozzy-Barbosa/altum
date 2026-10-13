import { parse, serialize } from 'parse5';
import messages from './en.json' with { type: 'json' };
import { localizePath } from './routing.mjs';
export const normalize = (value) => value.replace(/\s+/g, ' ').trim();
export function translate(value, dictionary = messages) {
  const key = normalize(value);
  const translated = dictionary[key];
  return translated ? value.replace(/\S(?:[\s\S]*\S)?/, () => translated) : value;
}
const textAttributes = new Set(['alt', 'title', 'aria-label', 'placeholder', 'label']);
const metaText = new Set([
  'description',
  'og:title',
  'og:description',
  'og:image:alt',
  'twitter:title',
  'twitter:description',
  'twitter:image:alt',
]);
const jsonText = new Set([
  'name',
  'description',
  'headline',
  'text',
  'articleSection',
  'serviceType',
]);
export function visitCopy(html, visitor) {
  const root = parse(html, { scriptingEnabled: false });
  function walk(node, skip = false) {
    const attrs = node.attrs || [];
    const get = (name) => attrs.find((a) => a.name === name)?.value;
    // A translated option label must not change its form/filter identifier.
    if (node.tagName === 'option' && get('value') === undefined) {
      const text = (item) => item.nodeName === '#text' ? item.value : (item.childNodes || []).map(text).join('');
      attrs.push({ name: 'value', value: normalize(text(node)) });
    }
    const excluded =
      skip ||
      ['script', 'style', 'code', 'pre'].includes(node.tagName) ||
      get('translate') === 'no';
    if (node.nodeName === '#text' && !excluded && normalize(node.value))
      node.value = visitor(node.value, 'text');
    if (!excluded)
      for (const attr of attrs) {
        if (
          textAttributes.has(attr.name) ||
          (node.tagName === 'meta' &&
            attr.name === 'content' &&
            metaText.has(get('property') || get('name')))
        )
          attr.value = visitor(attr.value, 'attribute');
      }
    if (node.tagName === 'script' && get('type') === 'application/ld+json') {
      const visitJson = (value, key = '') => {
        if (typeof value === 'string' && jsonText.has(key)) return visitor(value, 'schema');
        if (Array.isArray(value)) return value.map((v) => visitJson(v, key));
        if (value && typeof value === 'object')
          return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, visitJson(v, k)]));
        return value;
      };
      const text = node.childNodes.find((n) => n.nodeName === '#text');
      if (text)
        text.value = JSON.stringify(visitJson(JSON.parse(text.value))).replace(/</g, '\\u003c');
    }
    for (const child of node.childNodes || []) walk(child, excluded);
  }
  walk(root);
  return root;
}
/** Runs at Astro prerender time. Never touches visitor-entered values or browser DOM. */
export function translateHtml(html, dictionary = messages) {
  const root = visitCopy(html, (value) => translate(value, dictionary));
  function links(node) {
    const attrs = node.attrs || [];
    const get = (name) => attrs.find((a) => a.name === name)?.value;
    if (node.tagName === 'script' && get('type') === 'application/ld+json') {
      const localizeSchema = (value, key = '') => {
        if (key === 'inLanguage' && value === 'es-MX') return 'en';
        if (
          typeof value === 'string' &&
          ['url', 'item', 'mainEntityOfPage', '@id'].includes(key) &&
          value.startsWith('https://www.altumlapaz.com/') &&
          !/#(?:business|website)$/.test(value)
        ) {
          return (
            'https://www.altumlapaz.com' +
            localizePath(value.slice('https://www.altumlapaz.com'.length), 'en')
          );
        }
        if (Array.isArray(value)) return value.map((item) => localizeSchema(item, key));
        if (value && typeof value === 'object')
          return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, localizeSchema(v, k)]),
          );
        return value;
      };
      const text = node.childNodes.find((n) => n.nodeName === '#text');
      if (text)
        text.value = JSON.stringify(localizeSchema(JSON.parse(text.value))).replace(
          /</g,
          '\\u003c',
        );
    }
    for (const attr of attrs) {
      if (attr.name === 'href' && node.tagName === 'a' && get('data-language-link') === undefined) {
        const origin = 'https://www.altumlapaz.com';
        attr.value = attr.value.startsWith(origin + '/')
          ? origin + localizePath(attr.value.slice(origin.length), 'en')
          : localizePath(attr.value, 'en');
      }
      if (node.tagName === 'input' && get('name') === '_next' && attr.name === 'value')
        attr.value = attr.value.replace(
          'https://www.altumlapaz.com/',
          'https://www.altumlapaz.com/en/',
        );
    }
    for (const child of node.childNodes || []) links(child);
  }
  links(root);
  return serialize(root);
}
