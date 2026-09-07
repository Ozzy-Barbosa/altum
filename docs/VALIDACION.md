# Validación de la migración

Fecha: 7 de septiembre de 2026. Se verificó la compilación estática mediante vista previa local.

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

No se han habilitado pagos, mensajería, usuarios comerciales, sincronización pública ni integraciones reales. No se ha solicitado indexación en cuentas de Google/Bing, ni se ha medido posicionamiento. La validación móvil es de distribución y controles; no sustituye pruebas en todos los dispositivos físicos.
