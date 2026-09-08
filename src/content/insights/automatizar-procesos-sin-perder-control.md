---
title: "Qué automatizar primero en un negocio y qué debe seguir revisando una persona"
description: "Identifica tareas repetitivas que puedes automatizar y define responsables, excepciones e historial para mantener el control de tu operación."
category: "Operación"
published: 2026-09-07
order: 3
takeaway: "Automatiza reglas claras y repetibles. Conserva una revisión humana donde una excepción pueda cambiar el resultado."
service: "desarrollo-aplicaciones-la-paz"
demo: "cotizaciones"
---
## Reconoce las tareas que se repiten

Copiar los mismos datos en una cotización, calcular cantidades o recordar una fecha son tareas que pueden apoyarse en software. Para elegir una, describe qué la inicia, qué información necesita y qué resultado debe producir.

Si dos personas resuelven la misma situación de formas distintas, primero hay que acordar el proceso. Programar una regla ambigua puede multiplicar un error en lugar de reducirlo.

Un ejemplo sencillo es preparar una propuesta: seleccionar servicios, indicar cantidades, aplicar un descuento permitido y generar un documento con folio. La herramienta puede hacer los cálculos; la persona responsable revisa el alcance y autoriza la propuesta antes de compartirla.

## Dibuja la regla y sus excepciones

Escribe el recorrido en palabras: «cuando ocurre esto, comprobamos estos datos y hacemos esta acción». Después pregunta qué sucede si falta información, si la solicitud se repite o si un servicio externo no responde.

| Tarea | Apoyo del sistema | Revisión que conviene conservar |
| --- | --- | --- |
| Preparar una cotización | Cálculos, folio y documento | Alcance, descuento y condiciones |
| Recibir una solicitud | Registro y asignación | Prioridad y respuesta al cliente |
| Controlar inventario | Movimientos y mínimos | Conteos, pérdidas y ajustes |
| Organizar citas | Disponibilidad y conflictos | Excepciones y cambios especiales |

Estas son decisiones de diseño; el alcance final depende de cómo opera cada negocio.

## Un historial ayuda a entender lo que pasó

Una pantalla que muestra el estado actual es útil. Un registro que explica quién hizo un cambio, cuándo y por qué ayuda a resolver dudas. En una implementación privada, esos permisos e historiales deben protegerse desde el servidor.

También conviene definir cómo se corrige una operación. Eliminar un registro puede ser inadecuado si otro proceso ya depende de él; en ocasiones corresponde cancelarlo o registrar un ajuste. Esa decisión se acuerda antes de usar datos reales.

## Conectar un proveedor añade nuevas condiciones

Pagos, correo y mensajería requieren cuentas, reglas de uso y manejo de errores. Una confirmación dibujada en una demo no equivale a una transacción procesada por el proveedor.

Por eso, una integración debe probar solicitudes repetidas, fallos de conexión y respuestas tardías. El usuario necesita saber si la acción quedó pendiente, se completó o requiere atención. Los costos del proveedor se revisan al definir la propuesta.

## Empieza con una prueba que puedas seguir

Elige una tarea y compara el resultado del sistema con el trabajo manual durante un periodo acordado. Revisa también el tiempo que necesita el equipo para aprenderla.

Puedes probar [Altum Cotiza](/demos/cotizaciones/) para observar cálculos y documentos de ejemplo, y consultar sus [especificaciones](/soluciones/cotizaciones/#especificaciones). El siguiente paso sería adaptar las reglas y validar una versión privada con el negocio.
