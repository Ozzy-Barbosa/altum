import english from './interactive-en.json' with { type: 'json' };
import { localizePath } from './routing.mjs';
export const browserLocale = () =>
  typeof document !== 'undefined' && document.documentElement.lang.startsWith('en') ? 'en' : 'es';
/** Call only for authored interface copy, never for visitor record names or descriptions. */
export function ui(text, locale = browserLocale(), params = {}) {
  if (typeof text !== 'string') return text;
  const key = text.replace(/\s+/g, ' ').trim();
  let translated = locale === 'en' ? english[key] : undefined;
  if (locale === 'en' && !translated) {
    let match;
    if ((match = key.match(/^(.+): escribe entre 1 y (\d+) caracteres\.$/)))
      translated = `${ui(match[1], locale)}: enter between 1 and ${match[2]} characters.`;
    else if ((match = key.match(/^(.+): utiliza un número entre (.+) y (.+)\.$/)))
      translated = `${ui(match[1], locale)}: use a number between ${match[2]} and ${match[3]}.`;
    else if ((match = key.match(/^(.+): utiliza un número entero\.$/)))
      translated = `${ui(match[1], locale)}: use a whole number.`;
    else if ((match = key.match(/^Solo hay (\d+) unidades de (.+)\.$/)))
      translated = `Only ${match[1]} units of ${match[2]} are available.`;
    else if ((match = key.match(/^Revisa el texto: máximo (\d+) caracteres\.$/)))
      translated = `Check the text: maximum ${match[1]} characters.`;
  }
  const output = translated ? text.replace(/\S(?:[\s\S]*\S)?/, () => translated) : text;
  return output.replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(params, name) ? String(params[name]) : match,
  );
}
export const languageTag = () => (browserLocale() === 'en' ? 'en-US' : 'es-MX');
export const localizedHref = (path) => localizePath(path, browserLocale());
/** Include rendered interface labels in searches without changing stored values. */
export function matchesVisibleText(query, fields) {
  const normalize = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  return normalize(fields.join(' ')).includes(normalize(query));
}
export const formatMoney = (value, locale = browserLocale()) =>
  new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);
