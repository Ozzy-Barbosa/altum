export function getLocale(path = '') { return /^\/en(?:\/|$)/.test(path) ? 'en' : 'es'; }
/** Public page links only: assets, APIs, external URLs and fragments stay intact. */
export function localizePath(path, locale) {
  if (['/404.html', '/404/', '/en/404/'].includes(path)) return locale === 'en' ? '/en/404/' : '/404.html';
  if (!path.startsWith('/') || path.startsWith('//') || /^\/(?:assets|_astro|api)\//.test(path) || /\.[a-z0-9]+(?:[?#]|$)/i.test(path)) return path;
  const plain = path.replace(/^\/en(?=\/|[?#]|$)/, '') || '/';
  return locale === 'en' ? `/en${plain.startsWith('/') ? plain : '/' + plain}` : plain;
}
