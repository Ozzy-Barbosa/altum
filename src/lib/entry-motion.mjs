/** One short entrance per new document; content is visible without JavaScript. */
export function startEntryMotion(document, window) {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const main = document.getElementById('contenido');
  if (!main || root.dataset.motion === 'paused' || media.matches) return;

  let timer;
  const finish = () => {
    delete root.dataset.entry;
    window.clearTimeout(timer);
    document.removeEventListener('altum:motion', onMotion);
    media.removeEventListener('change', onMotion);
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('pageshow', onPageShow);
    main.removeEventListener('animationend', onEnd);
  };
  const onMotion = () => {
    if (root.dataset.motion === 'paused' || media.matches) finish();
  };
  const onPageShow = (event) => {
    if (event.persisted) finish();
  };
  const onEnd = (event) => {
    if (event.target === main && event.animationName === 'altum-document-entry') finish();
  };

  document.addEventListener('altum:motion', onMotion);
  media.addEventListener('change', onMotion);
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', onPageShow);
  main.addEventListener('animationend', onEnd);
  root.dataset.entry = 'active';
  timer = window.setTimeout(finish, 800);
}
