import { getCollection } from 'astro:content';
import { site } from '../../data/catalog';
const xml = (s: string) =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
export async function GET() {
  const entries = (await getCollection('insights', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  const items = entries
    .map(({ id, data }) => {
      const link = `${site.origin}/soluciones/guias/${id}/`;
      return `<item><title>${xml(data.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${xml(data.description)}</description><category>${xml(data.category)}</category><pubDate>${data.published.toUTCString()}</pubDate></item>`;
    })
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Soluciones · Altum</title><link>${site.origin}/soluciones/</link><description>Guías de tecnología y crecimiento para negocios.</description><language>es-MX</language>${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
}
