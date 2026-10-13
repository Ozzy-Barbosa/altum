# Altum Theme and Language Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar el fondo claro/oscuro y español/inglés aprobados, integrando el logo limpio sin rediseñar el sitio.

**Architecture:** Mantener Astro estático y las islas React actuales. Centralizar tema, textos traducibles y rutas por idioma; usar vistas compartidas para español e inglés, sin traducción automática de nodos DOM ni servicios externos. El cambio visual se limita a colores, controles y fondo del núcleo del logo.

**Tech Stack:** Astro 7.3.1, React 19.2.8, TypeScript, CSS/SCSS, pruebas nativas de Node y GitHub Pages existentes.

**Spec:** `docs/superpowers/specs/2026-10-12-tema-idioma.md`

## Global Constraints

- Español principal y fondo claro inicial `#f8faff`; oscuro opcional recordado.
- Conservar átomo, constelaciones, tarjetas, geometría, animaciones y reducción de movimiento.
- Usar el logo limpio aprobado; quitar únicamente el disco opaco de `.system-core`.
- No traducir ni mutar datos ingresados por visitantes; mantener precios en MXN.
- No enviar formularios de prueba reales ni cambiar DNS, cuentas o servicios externos.
- Preservar URLs españolas, proyectos, contactos, consentimientos y documentos ajenos.
- Publicar solo después de verificación y comprobar la web pública después del despliegue.

## Review Focus

1. Almacenamiento bloqueado o preferencia inválida: la página debe seguir funcionando en claro sin excepciones (tarea 1).
2. Inglés y etiquetas largas en móvil: controles, tarjetas y campos sin solaparse; teclado y foco visibles (tareas 2–4).
3. Cambio de idioma dentro de una subpágina: mantener equivalente, query y fragmento; no romper enlaces ni canonical (tarea 2).
4. Demos con datos propios: idioma y tema no modifican almacenamiento, nombres, identificadores ni importes (tarea 3).
5. Movimiento pausado o reducido: cambiar tema no reinicia animaciones ni crea nuevos bucles (tareas 1 y 4).

---

### Task 1: Tema global y logo integrado

**Files:** Crear `src/lib/appearance.mjs`, `src/styles/appearance.css`, `src/components/AppearanceControls.astro`, `public/assets/logo-altum-clean.png`, `tests/appearance.test.mjs`. Modificar `src/layouts/Layout.astro`, `src/pages/index.astro`, `src/components/Constellation.astro` y los estilos existentes únicamente donde haya colores oscuros fijados o el disco de `.system-core`.

**Interfaces:** `readTheme(storage) -> 'light' | 'dark'` acepta Storage o null y captura fallos. `applyTheme(theme, document) -> void` actualiza `data-theme`, `color-scheme`, meta theme-color y emite `altum:theme`; no toca `altum-motion`. Clave persistente `altum-theme`.

- [ ] Crear tests: almacenamiento vacío, nulo, inválido o que lanza devuelve `light`; `dark` se conserva. `applyTheme` cambia tema sin modificar `data-motion`.
- [ ] Ejecutar `node --test tests/appearance.test.mjs`: confirmar fallo por módulo ausente.
- [ ] Implementar controles y arranque temprano, tokens claros/oscuros, PNG independiente y núcleo transparente. Mantener código de órbitas y movimiento; el canvas solo adapta colores al evento de tema.
- [ ] Repetir prueba hasta PASS; revisar aspecto del hero y contraste en ambos temas.
- [ ] Commit acotado de archivos de esta tarea.

### Task 2: Sitio editorial bilingüe

**Files:** Crear `src/i18n/routing.ts`, `src/i18n/messages.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`, `src/i18n/content.ts`, `src/components/LanguageSwitch.astro`, `src/pages/en/[...path].astro`, `tests/i18n.test.mjs`. Extraer cada vista existente de `src/pages/` a su equivalente en `src/views/`, conservando los adaptadores españoles y getStaticPaths. Modificar Layout, componentes editoriales, catálogo, FAQ, formularios y configuración de sitemap para recibir locale. Ampliar `tools/verify-build.mjs`.

**Interfaces:** `Locale = 'es' | 'en'`; `getLocale(pathname): Locale`; `localizePath(url, locale): string` conserva query/fragmento y deja URLs externas y assets intactos; `t(locale, key, params?): string` usa claves tipadas y exige paridad ES/EN. `getPageEntries()` en `src/i18n/content.ts` devuelve `{path, view, props}` para todas las rutas HTML actuales, incluidas dinámicas. El adaptador inglés usa esas mismas vistas y props con `locale='en'`.

- [ ] Crear tests: equivalencia `/proyectos/orthomax/?a=1#avance` ↔ `/en/proyectos/orthomax/?a=1#avance`; no doble prefijo; externos/mailto/wa.me/assets no cambian; claves ES/EN idénticas y ninguna traducción vacía.
- [ ] Ejecutar `node --test tests/i18n.test.mjs`: confirmar RED.
- [ ] Implementar registro de rutas, vistas compartidas y traducción de contenido propio completo. Traducir atributos accesibles, placeholders, validaciones, consentimiento y metadatos; mantener nombres de marcas y hechos comerciales. Los artículos conservan fecha y contenido equivalente, sin reemplazarlos por resúmenes.
- [ ] Renderizar `lang`, canonical, hreflang ES/EN/x-default y schema de la página según locale. Mantener noindex de demos y exclusiones actuales del sitemap. No inferir que ofrecer web inglesa equivale a cambiar idiomas de atención declarados.
- [ ] Verificar cobertura de cada ruta española con equivalente inglés y enlaces internos localizados. Ejecutar tests, `npm run check` y build; errores de cobertura bloquean publicación.
- [ ] Commit acotado de internacionalización editorial.

### Task 3: Interacciones y demos bilingües

**Files:** Crear `src/components/demos/LocaleContext.tsx`, `src/i18n/demo-messages.ts`, `tests/demo-locale.test.mjs`; modificar `src/components/demos/DemoApp.tsx`, `Shared.tsx`, `BusinessShared.tsx` y cada módulo de demos existente. Modificar `src/lib/whatsapp-brief.ts`, `src/lib/email-forms.ts` y `src/lib/quote-pdf.ts` donde produzcan textos al visitante; preservar sus contratos y datos originales.

**Interfaces:** `LocaleProvider({locale, children})`, `useLocale() -> {locale, t, formatDate, formatMoney}`. `formatMoney` mantiene currency MXN en ambos idiomas. Locale se pasa desde la vista de demo, no se almacena dentro de sus datos de negocio.

- [ ] Añadir tests: mismos datos y centavos antes/después de formatear ES/EN; mensajes con parámetros y pluralización traducidos; usuario llamado «Servicios» conserva exactamente ese nombre; construir WhatsApp en inglés conserva contacto y datos escritos.
- [ ] Ejecutar `node --test tests/demo-locale.test.mjs tests/whatsapp-brief.test.mjs`: confirmar RED de nuevos requisitos.
- [ ] Traducir interfaz, errores, modales, opciones visibles y salidas propias de las demos sin modificar valores de enums, registros persistidos ni funciones de negocio. Mantener rutas locales por idioma y adaptar superficies al tema.
- [ ] Verificar formularios interceptando envíos en pruebas: destinos y campos inalterados, consentimiento requerido, ninguna transmisión real.
- [ ] Ejecutar `npm test` y `npm run check`; commit acotado.

### Task 4: Verificación y publicación

**Files:** Actualizar `tools/verify-build.mjs` y `docs/VALIDACION.md`; capturas en `output/qa/`. Mantener `.github/workflows/deploy.yml` salvo cambios estrictamente necesarios por las nuevas comprobaciones.

**Interfaces:** Build produce rutas españolas e inglesas con assets compartidos; workflow despliega el mismo SHA validado a `https://www.altumlapaz.com`.

- [ ] Ejecutar `npm test`, `npm run check`, `npm run build` y `git diff --check`: todos deben finalizar correctamente.
- [ ] Revisar en navegador a 390×844 y escritorio: ES/EN × claro/oscuro; hero, navegación, proyectos, artículo, contacto, newsletter y demos. Comprobar foco/teclado, reload, navegación profunda, almacenamiento bloqueado y movimiento reducido; guardar capturas y resultados.
- [ ] Confirmar que no hay rutas sin traducción, enlaces rotos, errores de consola ni datos cambiados en demos. Revisar diff contra restricciones del spec.
- [ ] Sincronizar y comprobar remote/main antes de publicar. Incluir solo commits del alcance; no tocar archivos personales pendientes. Subir al repo autorizado y esperar workflow exitoso para su SHA exacto.
- [ ] Abrir producción en ambos idiomas/temas y verificar controles, logo, imágenes, metadatos, enlaces y despliegue. Documentar límites de las pruebas; distinguir publicado de meramente subido.

## Self-review

Cobertura revisada: tema, idioma completo, logo sin disco, identidad visual, movimiento, datos, formularios, SEO y publicación cuentan con tarea y comprobación. Los cinco casos de Review Focus tienen pruebas asignadas. No se incluye rediseño, cambio de hosting ni automatización comercial.
