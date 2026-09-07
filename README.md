# Altum · Plataforma y demostraciones

Sitio de servicios, casos de trabajo, portafolio profesional y seis aplicaciones de demostración para [Altum](https://www.altumlapaz.com), La Paz, BCS.

## Arquitectura

- Astro genera las páginas públicas como HTML; React se carga únicamente en las demos. Las páginas comerciales muestran su contenido sin depender de JavaScript.
- Catálogo central en `src/data/catalog.ts`; plantillas para soluciones, servicios y casos en `src/pages/`.
- Cada demo tiene su interfaz independiente y comparte validaciones, almacenamiento, diálogos y componentes.
- Demos públicas con datos ficticios guardados en el navegador. No procesan pagos, reservas ni pedidos reales.
- Supabase está aprovisionado para la siguiente etapa privada. El conector exige una sesión autorizada; no se crean usuarios anónimos.

## Desarrollo

Requiere Node.js 24 y npm. Instala las versiones del archivo de bloqueo:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm ci
npm run dev
```

Astro muestra la dirección local. Sus servidores pueden permanecer en segundo plano; consulta `npx astro dev --help` para los comandos disponibles de estado, registros y parada.

```powershell
npm test
npm run check
npm run build
npm run preview
```

La compilación comprueba páginas, enlaces locales, títulos, descripciones, etiquetas canónicas, datos estructurados y exclusión de demos de la indexación. `dist/` es el único directorio que se publica. Los archivos HTML/CSS/JS antiguos en la raíz se conservan como referencia de la migración; ya no son la fuente del sitio.

## Aplicaciones

| Ruta                 | Demostración funcional                                                     |
| -------------------- | -------------------------------------------------------------------------- |
| `/demos/menu/`       | Carta, filtros, carrito, administración y pedidos simulados                |
| `/demos/agenda/`     | Servicios, duración, disponibilidad por profesional, reserva y cancelación |
| `/demos/inventario/` | CRUD, movimientos, mínimos, indicadores y CSV                              |
| `/demos/commerce/`   | Catálogo, carrito, envío de ejemplo y compra simulada                      |
| `/demos/proyectos/`  | Tareas, responsables, fechas, estados, avance y exportación                |
| `/demos/search/`     | Biblioteca editable y búsqueda de texto por relevancia y categoría         |

La lógica se encuentra en `src/lib/demo-domain.mjs`, y los ejemplos iniciales en `seed()`. `Restablecer demo` recupera esos ejemplos para el módulo abierto. El carrito sin confirmar es temporal. Los cambios confirmados permanecen en ese navegador. Abrir otra pestaña no ofrece edición colaborativa; recarga para ver su última copia guardada.

## Publicación y reversión

GitHub Pages debe utilizar **GitHub Actions**, conservando el dominio `www.altumlapaz.com`. El flujo `.github/workflows/deploy.yml` valida cada propuesta y publica `dist/` cuando cambia `main`. No requiere secretos de Supabase para esta versión. No subir `node_modules`, `.env` ni `dist` al repositorio.

Para volver a una versión anterior, revierte el commit en Git, publica la reversión y comprueba el resultado de Actions. Para restaurar la antigua landing, recupera el estado anterior a la migración y vuelve a configurar Pages desde la rama. Evita mezclar publicación desde rama y desde Actions.

## Personalización y crecimiento

Consulta [la guía de producto](docs/PRODUCTOS.md) y [la preparación de Supabase](database/README.md). Cambiar datos, logo, colores y contacto permite adaptar experiencias similares. Operaciones diferentes, pagos, facturación, roles, integraciones y colaboración requieren implementación y validación adicionales.

El portafolio personal está en `/portafolio/`: añadir foto y datos profesionales confirmados cuando estén disponibles. Los casos reales mantienen su estado publicado o en desarrollo; no se incluyen métricas comerciales inventadas.

## SEO y presentación

Páginas específicas de servicios para La Paz, metadatos por ruta, contenido semántico, fuentes locales, imágenes con dimensiones, navegación accesible y movimiento reducido. Mapa del sitio: `/sitemap-index.xml`. Las demos y la presentación llevan `noindex` para que los negocios ficticios no compitan con las páginas comerciales.

La propiedad de dominio de Altum está verificada en Google Search Console. El 7 de septiembre de 2026 se envió `/sitemap-index.xml` y Google lo aceptó con estado «Correcto». La portada ya figuraba como indexada; el mapa nuevo permite descubrir 22 páginas comerciales. Tener SEO técnico correcto y un sitemap aceptado no garantiza la indexación de todas las páginas ni posiciones. Bing Webmaster Tools queda pendiente. Mantener casos reales y contenido útil es trabajo continuo.

`/presentacion/` ofrece cuatro hojas imprimibles y códigos QR a las demos. La versión PDF descargable está en `/documentos/altum-presentacion-comercial.pdf`.
