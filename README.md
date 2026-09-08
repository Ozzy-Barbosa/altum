# Altum · Plataforma y demostraciones

Sitio de servicios, casos de trabajo, portafolio profesional y doce aplicaciones de demostración para [Altum](https://www.altumlapaz.com), La Paz, BCS.

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

| Ruta                   | Demostración funcional                                                     |
| ---------------------- | -------------------------------------------------------------------------- |
| `/demos/menu/`         | Carta, filtros, carrito, administración y pedidos simulados                |
| `/demos/agenda/`       | Servicios, duración, disponibilidad por profesional, reserva y cancelación |
| `/demos/inventario/`   | CRUD, movimientos, mínimos, indicadores y CSV                              |
| `/demos/commerce/`     | Catálogo, carrito, envío de ejemplo y compra simulada                      |
| `/demos/proyectos/`    | Tareas, responsables, fechas, estados, avance y exportación                |
| `/demos/search/`       | Biblioteca editable y búsqueda de texto por relevancia y categoría         |
| `/demos/finanzas/`     | Movimientos, flujo mensual, presupuestos por categoría y CSV               |
| `/demos/crm/`          | Oportunidades, etapas de venta, notas y seguimiento                        |
| `/demos/cotizaciones/` | Conceptos, descuentos, folios, documento y estados                         |
| `/demos/servicios/`    | Órdenes, responsable, prioridad e historial por estado                     |
| `/demos/personal/` | Presupuesto mensual, metas, aportaciones y proyección simple |
| `/demos/soporte/` | Tickets, responsables, respuestas, historial y filtros |

La lógica se encuentra en `src/lib/demo-domain.mjs`, `src/lib/business-domain.mjs` y `src/lib/extended-domain.mjs`, y los ejemplos iniciales en `seed()`. `Restablecer demo` recupera esos ejemplos para el módulo abierto. El carrito sin confirmar es temporal. Los cambios confirmados permanecen en ese navegador. `local-persistence.mjs` comprueba el formato de guardado, conserva una copia anterior y detecta escrituras con una versión desactualizada. Web Locks coordina las escrituras entre pestañas compatibles; en otros navegadores se compara la copia antes de escribir. Esto no es edición colaborativa ni un respaldo remoto.

## Publicación y reversión

GitHub Pages debe utilizar **GitHub Actions**, conservando el dominio `www.altumlapaz.com`. El flujo `.github/workflows/deploy.yml` valida cada propuesta y publica `dist/` cuando cambia `main`. No requiere secretos de Supabase para esta versión. No subir `node_modules`, `.env` ni `dist` al repositorio.

Para volver a una versión anterior, revierte el commit en Git, publica la reversión y comprueba el resultado de Actions. Para restaurar la antigua landing, recupera el estado anterior a la migración y vuelve a configurar Pages desde la rama. Evita mezclar publicación desde rama y desde Actions.

## Personalización y crecimiento

Consulta [la guía de producto](docs/PRODUCTOS.md) y [la preparación de Supabase](database/README.md). Cambiar datos, logo, colores y contacto permite adaptar experiencias similares. Operaciones diferentes, pagos, facturación, roles, integraciones y colaboración requieren implementación y validación adicionales.

El portafolio personal está en `/portafolio/`: añadir foto y datos profesionales confirmados cuando estén disponibles. Los casos reales mantienen su estado publicado o en desarrollo; no se incluyen métricas comerciales inventadas.

## SEO y presentación

Páginas específicas de servicios para La Paz, metadatos por ruta, contenido semántico, fuentes locales, imágenes con dimensiones, navegación accesible y movimiento reducido. Mapa del sitio: `/sitemap-index.xml`. Las demos y la presentación llevan `noindex` para que los negocios ficticios no compitan con las páginas comerciales.

La propiedad de dominio de Altum está verificada en Google Search Console. El 7 de septiembre de 2026 se envió `/sitemap-index.xml` y Google lo aceptó con estado «Correcto». La portada ya figuraba como indexada; el mapa nuevo permite descubrir las páginas comerciales (44 en la versión actual; su indexación aún depende del rastreo). Tener SEO técnico correcto y un sitemap aceptado no garantiza la indexación de todas las páginas ni posiciones. Bing Webmaster Tools queda pendiente. Mantener casos reales y contenido útil es trabajo continuo.

`/presentacion/` ofrece ocho hojas imprimibles y códigos QR a las demos. La versión PDF descargable está en `/documentos/altum-presentacion-comercial.pdf`.

## Evolución visual y referencias

Servicios, Soluciones y Demos tienen propósitos distintos: oferta comercial, guías educativas y aplicaciones de ejemplo. La portada muestra tres demos y una selección de tecnologías. Los artículos se editan en `src/content/insights/` y se validan con Content Collections; su índice, rutas y RSS se generan desde esos archivos. Consulta [SEO y contenido](docs/SEO-Y-CONTENIDO.md) para publicar artículos y notificar cambios a IndexNow.

Constelaciones animadas, órbitas y partículas decorativas, pausa de movimiento persistente y respeto de la preferencia del sistema. El lienzo pausa su animación en pestañas ocultas y limita la densidad y resolución. Navegación con Inicio, iconos sociales, búsqueda y categorías de soluciones, tecnologías y herramientas para borrar datos locales de las demos.

Las 25 referencias de video y las siguientes ideas están en [REFERENCIAS-YOUTUBE.md](docs/REFERENCIAS-YOUTUBE.md). Sus títulos fueron verificados; la revisión completa de los videos sigue pendiente.

## Guías y tarjeta

`node --experimental-strip-types tools/export-catalog.mjs` exporta el catálogo. `python tools/create-guides.py` genera los tres PDF en `output/pdf/` (requiere ReportLab y las fuentes Arial de Windows). Solo copia la presentación comercial a `public/documentos/`; las guías de estudio y operación se entregan localmente. El script también crea el maestro vectorial temporal de la tarjeta; se renderiza a PNG a 600 dpi, de 90 × 55 mm. Los QR se deben decodificar después de renderizar.

`/como-esta-hecho/` explica la arquitectura; `/tarjeta/` presenta el contacto y la tarjeta descargable. Las tecnologías del ecosistema se enlazan a su documentación oficial con iconos de [Simple Icons](https://simpleicons.org/). Sass compila `src/styles/evolution.scss`; Flutter y Tauri forman parte de las posibilidades de otros proyectos y no del runtime de esta web.

Metas y Soporte son módulos locales. Su conexión privada requiere ampliar la preparación de base de datos y validar los permisos antes de habilitarla. No se modificó el inicio de sesión ni se habilitó acceso público a Supabase en esta ampliación.
