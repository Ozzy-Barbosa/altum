# Descubrimiento y contenido de Altum

## Cada sección responde una intención

- Servicios: oferta, entregables, alcance y consultas para contratar.
- Soluciones: artículos educativos en `src/content/insights/`; no repite el catálogo.
- Demos: recorridos interactivos con datos ficticios y acceso a sus fichas.
- Las fichas existentes en `/soluciones/[producto]/` se conservan para no romper enlaces y QR. Su navegación vuelve al catálogo de demos.

Los artículos utilizan la colección `insights`, validada en `src/content.config.ts`. Cada archivo Markdown necesita título, descripción, categoría, fecha de publicación real, orden, idea clave, servicio y demo relacionados. `draft: true` excluye el artículo de las rutas públicas y del RSS. No actualizar fechas sin cambios reales de contenido. Revisar fuentes, ejemplos y enlaces antes de publicar.

## Buscadores y navegadores

El SEO se dirige a motores de búsqueda, independientemente del navegador elegido. Edge, Firefox y Safari pueden utilizar diferentes buscadores según la configuración del usuario. Brave tiene además Brave Search. Las páginas públicas se generan como HTML accesible sin JavaScript, con canonical HTTPS, enlaces rastreables, metadatos y sitemap.

El archivo robots permite el rastreo público, incluidos Bingbot, Googlebot y Applebot. No bloquea CSS, JavaScript ni imágenes. La compatibilidad móvil, controles táctiles, foco y reducción de movimiento se comprueban como parte de la experiencia; no acreditan una posición en resultados ni una prueba física en todos los dispositivos.

Los artículos incluyen BlogPosting, autor editorial, fechas y metadatos para compartir. Su RSS está en `/soluciones/rss.xml`. Las demos ficticias y la presentación mantienen noindex. No se añaden valoraciones, acreditaciones ni resultados inventados.

## IndexNow

`public/<clave>.txt` acredita el dominio ante IndexNow. Es un archivo de verificación que debe ser accesible públicamente; no es una contraseña de una cuenta.

Después de publicar y comprobar las páginas modificadas:

```powershell
node tools/notify-search-engines.mjs https://www.altumlapaz.com/ https://www.altumlapaz.com/soluciones/
```

Para la primera notificación de esta ampliación, `--sitemap` envía las páginas indexables del build. En cambios posteriores enviar solo las direcciones añadidas, modificadas o retiradas. El script valida origen, rutas y contenido del archivo de verificación antes de enviar. No notifica durante una prueba local ni se ejecuta automáticamente al compilar.

Un HTTP 200 acredita recepción; un 202 indica recepción con validación pendiente. Ninguno acredita indexación o posicionamiento. El protocolo avisa a los motores participantes, incluido Bing; no sustituye Search Console ni el rastreo de Brave o Apple. Mantener registros de la respuesta y comprobar luego la cobertura en las herramientas de cada buscador cuando haya acceso.

## Referencias oficiales

- [Guía de Bing](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a)
- [Documentación de IndexNow](https://www.indexnow.org/documentation)
- [Rastreador de Brave Search](https://search.brave.com/help/brave-search-crawler)
- [Applebot](https://support.apple.com/en-us/119829)
- [Fundamentos de SEO de Google](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=es)
