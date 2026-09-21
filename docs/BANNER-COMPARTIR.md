# Banner para compartir Altum

Fecha: 21 de septiembre de 2026.

## Entrega

- Imagen publicada: `public/assets/altum-social-20260921.jpg`.
- Formato: JPEG sRGB, 1200 × 630 píxeles, 136,910 bytes.
- Diseño: símbolo de marca como protagonista, ALTUM grande, tres líneas breves, fondo azul marino con iluminación azul/cian. El bloque central conserva la marca en un recorte cuadrado centrado.
- Texto: ALTUM / PÁGINAS WEB · APPS · SOFTWARE / LA PAZ, BCS / altumlapaz.com.
- Recurso de marca usado como referencia: `public/assets/logo-altum-symbol-transparent.png`.
- Método: herramienta integrada de generación de imágenes, seguida de una edición focalizada para reducir el bloque de texto; conversión y ajuste técnico a JPEG con Sharp. No se utilizó la API ni el CLI de generación de imágenes.
- El flyer anterior no se elimina: conserva su archivo y no es la imagen social predeterminada de la nueva versión.

## Integración

`src/layouts/Layout.astro` declara la nueva imagen por defecto en Open Graph, Twitter Card y la imagen del negocio en datos estructurados. La portada conserva el título SEO y utiliza un título social más breve. Las páginas de proyectos conservan sus capturas propias y las demás páginas mantienen su título correspondiente: compartir Privacidad no debe simular que se está compartiendo Inicio.

Archivo versionado para distinguirlo del banner anterior. Las propiedades de la imagen se entregan en el HTML inicial, sin depender de JavaScript. El build comprueba URL, existencia, formato, dimensiones y coherencia de los metadatos.

## Validación y límites

Las vistas amplias y compactas de QA son simulaciones de formato para revisar legibilidad y recortes, no una comprobación dentro de una cuenta de WhatsApp. La aplicación receptora decide si muestra una tarjeta grande o una miniatura, y puede reutilizar una vista anterior. No se puede garantizar desde el sitio el formato de cada chat ni un plazo de actualización de las vistas almacenadas.

Para una prueba posterior a publicar, pegar la dirección en un mensaje nuevo y esperar a que se genere la vista previa antes de enviarlo. Si se sigue mostrando una imagen anterior, puede probarse la variante `https://www.altumlapaz.com/?v=20260921`; apunta al mismo sitio y conserva la URL canónica limpia. No supone una garantía de renovación de la caché de WhatsApp. No se enviaron mensajes ni publicaciones para probar el diseño.

Referencias: [Open Graph](https://ogp.me/) y [opción de vistas previas de WhatsApp](https://faq.whatsapp.com/445453537819972).

## Prompt inicial (herramienta integrada)

```text
Use case: ads-marketing.
Asset type: production Open Graph link-preview banner for ALTUM's real website, shared on WhatsApp, Facebook and social media. Create a completely new premium polished banner, not a mockup of a browser or chat UI.
Canvas: horizontal 1200 x 630 pixels, aspect ratio 1.90476:1. All key logo and words must remain in the middle 600px-wide safe zone so a centered square thumbnail still shows the brand clearly.
Input image 1: official ALTUM symbol, supporting brand insert. Preserve faithfully its two overlapping angular mountain peaks, metallic silver upper facets, blue/cyan lower facets and thin blue/cyan arc. Do not redesign, simplify, deform or invent a different symbol. Remove no parts. Integrate on a seamless dark background without a visible rectangle.
Composition: clean centered brand poster, elegant editorial hierarchy, lots of controlled breathing room. Center the original logo large above an oversized wordmark ALTUM. The mark and wordmark dominate, easily recognizable at thumbnail size.
Backdrop: almost-black navy #030813 / #07111f, subtle luminous cyan and electric blue sculptural light ribbons sweeping in from the FAR left and right margins toward the brand without crossing it, tiny restrained violet accents, polished 3D depth and soft atmospheric light. Quiet, sophisticated digital studio aesthetic. Sharp commercial finish, not a busy cyberpunk scene.
Typography: white, very crisp geometric modern sans serif, carefully typeset, generous tracking in ALTUM, secondary text substantially sized and readable. Only the following three text lines, verbatim, each exactly once:
"ALTUM"
"PÁGINAS WEB · APPS · SOFTWARE"
"LA PAZ, BCS  /  altumlapaz.com"
ALTUM is the huge main wordmark, about 480px wide on the 1200px canvas. Second line about 520px wide. Third line is smaller but clearly legible. Center all lines. Preserve accents. No slogan needed, no additional words.
Avoid: tiny captions, lists of features, devices/laptops/phones, fake UI, price badges, buttons, QR codes, additional logos, dotted borders, promotional clutter, watermark, white background. No text or important details near canvas edges. Finished image ready for a real link preview.
```

## Ajuste final (herramienta integrada)

```text
Edit the supplied ALTUM Open Graph banner with ONE targeted correction: narrow the centered typography to be safe when WhatsApp crops the wide banner to a CENTERED SQUARE thumbnail. Keep the logo, its facets and ring, the background, the beautiful blue ribbons, the colors, the aspect ratio, and the overall composition unchanged.
The canvas is approximately1730x909. Its central square crop spans x410 to1320. Every letter of all THREE lines of text must fit INSIDE x450 to1280, with clear breathing room. Main ALTUM wordmark should be about720px wide instead of1000px. The second line must be at most830px wide instead of1120px. The bottom line should be about650px wide. Preserve nice proportional letterforms, do not horizontally squeeze letters; use smaller font size and refined tracking. Keep text centered and maintain a clear hierarchy: ALTUM huge and bold, service line smaller, bottom line smaller still. Can keep original text baselines, with slightly more negative space.
Verbatim text only:
"ALTUM"
"PÁGINAS WEB · APPS · SOFTWARE"
"LA PAZ, BCS  /  altumlapaz.com"
Keep logo exactly unchanged. No new elements. This is a polished finished banner, not a screenshot showing cropping guides.
```
