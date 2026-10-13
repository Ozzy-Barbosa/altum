import { defineMiddleware } from 'astro:middleware';
import { translateHtml } from './i18n/static-html.mjs';
import { getLocale } from './i18n/routing.mjs';
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  if (getLocale(url.pathname) !== 'en' || !response.headers.get('content-type')?.includes('text/html')) return response;
  return new Response(translateHtml(await response.text()), { status: response.status, statusText: response.statusText, headers: response.headers });
});
