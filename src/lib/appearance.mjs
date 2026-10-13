export function readTheme(storage) {
  try { return storage?.getItem('altum-theme') === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}
export function applyTheme(theme, doc) {
  const next = theme === 'dark' ? 'dark' : 'light';
  doc.documentElement.dataset.theme = next;
  doc.documentElement.style.colorScheme = next;
  doc.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#060a12' : '#f8faff');
  doc.dispatchEvent(new Event('altum:theme'));
}
