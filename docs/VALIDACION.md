# Validación de la migración

Fecha: 7 de septiembre de 2026. Se verificó la compilación estática mediante vista previa local y después en `https://www.altumlapaz.com/`.

- 11 pruebas de dominio: stock, pedidos, disponibilidad, cancelación, entradas inválidas, búsqueda, tareas, documentos y restablecimiento.
- 31 páginas compiladas, sin errores ni advertencias de Astro/TypeScript. Revisión automática de títulos, encabezados, descripción, canonical, JSON-LD, recursos locales y etiquetas noindex de demos.
- Menú: pedido de toast y latte por $200, confirmación y persistencia tras recarga.
- Agenda: reserva por profesional, exclusión del horario ocupado y liberación tras cancelación.
- Inventario: rechazo de salida por 999 unidades, salida válida de 2 con historial y actualización de indicadores; alta y eliminación de producto de prueba.
- Commerce: compra de $390 más $80 de envío, confirmación por $470, sin cobro real.
- Proyectos: cambio de estado actualiza avance de 25 % a 50 % y permite crear una tarea.
- Search: búsqueda sin acentos de “envios” devuelve el documento correcto y permite leerlo.
- Contacto: la solución del enlace se selecciona en el formulario. No se enviaron mensajes de prueba a WhatsApp.
- Revisión visual de escritorio y vista de 390 px, incluida navegación móvil. Corregido desbordamiento de la animación de portada.
- PDF de cuatro páginas renderizado e inspeccionado; sus siete QR se decodificaron y corresponden a las rutas previstas. Los siete QR de la versión HTML también se decodifican durante la compilación.
- Supabase: RLS y cuatro políticas; prueba transaccional confirma acceso del propietario y rechazo de lectura, modificación e inserción sobre otro usuario. Las cuentas y registros usados en la prueba se revirtieron. Asesor de seguridad sin avisos.

## Límites de verificación

La prueba interactiva utiliza la salida de producción (`npm run build` y `npm run preview`). El navegador integrado del entorno devolvió un error de importación del componente TSX al utilizar el servidor de desarrollo, aunque los recursos consultados por HTTP respondían 200. La compilación y las demos servidas desde `dist/` sí funcionaron. Para revisar las demos en ese navegador, utilizar la vista previa de producción; revisar el entorno de desarrollo en el navegador habitual antes de una nueva sesión de implementación.

No se han habilitado pagos, mensajería, usuarios comerciales, sincronización pública ni integraciones reales. No se ha medido posicionamiento. La validación móvil es de distribución y controles; no sustituye pruebas en todos los dispositivos físicos.

## Publicación comprobada

- Commit de implementación: `e4e3fcd9db8163201023265330f97eaae4c06c73` en `main` de `Ozzy-Barbosa/altum`.
- [GitHub Actions](https://github.com/Ozzy-Barbosa/altum/actions/runs/34164468821): instalación, pruebas, revisión, compilación y despliegue completados correctamente.
- Las 30 rutas HTML válidas responden 200; la ruta inexistente devuelve 404 con la página de Altum. El dominio sin www redirige a la dirección canónica HTTPS.
- El PDF del dominio es idéntico, byte por byte, al documento local validado.
- Menú público: prueba de compra simulada de un latte por $65 y posterior restablecimiento de los ejemplos, sin escritura en Supabase.
- Nuevo sitemap con 22 rutas indexables, excluyendo las demos ficticias. Conservada la URL antigua `/sitemap.xml` como índice compatible.
- Google Search Console: propiedad de dominio existente, portada ya indexada y sitemap nuevo enviado con estado «Correcto». Esto no implica que las nuevas páginas ya estén indexadas. Bing no se ha configurado en esta entrega.
- Se solicitó revisar la portada actualizada. Google confirmó «Se ha solicitado la indexación» y la incorporó a su cola de rastreo; no supone una mejora de posición inmediata.

## Ampliación a diez demos y diseño orbital

7 de septiembre de 2026, revisión posterior a la migración inicial:

- 18 pruebas de dominio aprobadas. Se agregaron cálculos en centavos, descuentos, validación de fechas, folios sin reutilización, etapas comerciales e historial de servicio.
- 39 páginas compiladas, 26 rutas indexables en el sitemap. Revisión de Astro/TypeScript sin errores, advertencias ni sugerencias. Metadatos únicos, enlaces locales, JSON-LD, breadcrumbs y noindex de demos comprobados.
- Fondo de constelaciones y tres órbitas con partículas. Control para pausar, preferencia local, movimiento reducido del sistema y suspensión del canvas en pestañas ocultas.
- Finanzas: gasto de prueba por $250.50 actualiza gastos a $7,860.00 y flujo neto a $11,340.00. Presupuesto de Servicios reducido a $500 muestra $849.50 y alerta de exceso. Persistencia confirmada tras recarga.
- CRM: una oportunidad cambió de Propuesta a Ganado; totales y filtro mostraron dos oportunidades ganadas y dos abiertas.
- Cotiza: propuesta de dos servicios de $850, descuento de 10 %, total $1,530. PDF descargado desde la interfaz y leído del disco con cliente, folio e importe correctos. PDF de 30 conceptos probado con cuatro páginas; sin HTML ni recursos externos evaluados.
- Servicio: cambio de Diagnóstico a Lista con nota, agregado al historial manteniendo las etapas anteriores.
- Carpeta comercial: seis hojas renderizadas e inspeccionadas, 11 códigos QR decodificados en el PDF y 11 en el HTML. Destinos corresponden a las diez demos y al catálogo.
- Supabase: restricción ampliada a diez módulos mediante migración. RLS permanece habilitado, cuatro políticas por propietario, permisos públicos de lectura y escritura denegados y asesor de seguridad sin avisos.
- jsPDF 4.2.1 fijado en el lockfile; instalación reportó cero vulnerabilidades. Su módulo se carga al solicitar la descarga, no al abrir la portada.

La señal de descarga de la herramienta del navegador integrado agotó su espera, pero el archivo sí apareció en Descargas y se verificó con un lector PDF. La vista previa usa el mismo build estático que se publica. Las limitaciones comerciales y de dispositivos de la validación anterior siguen aplicando.

- Vista móvil mediante iframe local de 390 × 844: ancho útil y scrollWidth de 375 px en portada, portafolio y las cuatro demos nuevas. Revisados formularios de cotización, paneles y selector móvil de módulos. Navegación desplegable muestra Inicio y las secciones principales.
- Catálogo: categoría Finanzas devuelve una solución; búsqueda sin coincidencias devuelve cero y un mensaje útil.
- Privacidad: diálogo de confirmación, borrado de ejemplos y regreso a las dos cotizaciones iniciales comprobados. La preferencia de pausa permanece al navegar; las animaciones se reactivaron después de la prueba.

## Validación local de la ampliación a doce demos

7 de septiembre de 2026:

- 23 pruebas de dominio aprobadas. Las nuevas pruebas cubren presupuesto en centavos, aportaciones y límites de metas, fechas, folios e historial de tickets, inmutabilidad y rechazo de respuestas inválidas.
- 53 páginas compiladas y 38 entradas indexables en el sitemap. Revisión final de 62 archivos de Astro/TypeScript sin errores, advertencias ni sugerencias.
- Metas: ingreso mensual de $19,000.50 actualiza disponible y margen; se muestra alerta cuando las aportaciones planeadas exceden el disponible. Aportación de $500.50 actualiza ahorro, porcentaje e historial y persiste tras recarga. Alta de meta desde el formulario móvil comprobada.
- Soporte: cambio a Resuelto con respuesta conserva el historial; el filtro muestra los tickets correspondientes. Creación del folio TK-0004 y búsqueda por router comprobadas.
- Átomo: respuesta al cursor comprobada mediante sus valores de desplazamiento. Pausar movimiento restaura la posición y detiene animaciones; después se reactivó. Iconos de doce tecnologías y foco visible de sus enlaces revisados.
- Vista de 390 × 844 px: portada, Metas, Soporte, servicios, arquitectura y tarjeta sin desbordamiento horizontal (ancho útil y scrollWidth de 375 px). Revisados menú desplegable, tarjetas orbitales y formularios. La validación no sustituye pruebas en todos los dispositivos físicos.
- Presentación comercial de ocho páginas, guía de arquitectura de diez y manual comercial de ocho: 26 páginas renderizadas e inspeccionadas. Comprobados márgenes y ausencia de texto fuera de página.
- Trece códigos QR de la presentación PDF decodificados y trece QR de su versión HTML verificados en la compilación. El QR de la tarjeta PNG de 90 × 55 mm apunta al catálogo público de demos y también se decodificó.
- Metas y Soporte conservan datos de ejemplo únicamente en el navegador. No se modificaron los ajustes de autenticación, permisos ni base de datos de Supabase. No se enviaron mensajes, reservas ni cobros reales.

Las guías de arquitectura y operación se entregan como archivos locales. La presentación comercial y la tarjeta son los documentos publicados con el sitio.
