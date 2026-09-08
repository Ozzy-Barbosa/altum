# Bases de producto

Las doce demos ejecutan operaciones sobre datos de ejemplo y se pueden restablecer. Son bases de interfaz y lógica con pruebas; todavía no son sistemas comerciales con usuarios, pagos o trabajo compartido.

| Base       | Configuración para un cliente similar        | Desarrollo adicional habitual                                                        |
| ---------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| Menú       | Marca, productos, precios, categorías        | Extras, pedidos por mesa, cocina, reparto, cobros                                    |
| Agenda     | Marca, servicios, profesionales, duración    | Horarios configurables, festivos, anticipos, recordatorios, concurrencia en servidor |
| Inventario | Productos, categorías, mínimos, identidad    | Compras, proveedores, almacenes, lotes, permisos, importación                        |
| Commerce   | Marca, catálogo, información de productos    | Variantes, pago, impuestos, entrega, devoluciones                                    |
| Proyectos  | Proyectos, responsables, tareas              | Invitaciones, archivos, comentarios, permisos por cliente                            |
| Search     | Documentos, categorías, marca                | Conectores, documentos privados, búsqueda semántica                                  |
| Finanzas   | Categorías, conceptos y presupuestos         | Bancos, conciliación, impuestos y contabilidad                                       |
| Clientes   | Prospectos, etapas, notas y seguimientos     | Mensajería, recordatorios y asignación por vendedor                                  |
| Cotiza     | Conceptos, descuentos y condiciones          | Impuestos, aceptación y facturación fiscal                                           |
| Servicio   | Equipos, responsables, prioridades y órdenes | Fotos, portal privado y mantenimiento recurrente                                     |

## Primer cliente

Comenzar con un menú público y un administrador privado para una cafetería. Confirmar catálogo, logo, fotografías autorizadas, contacto y quién actualizará la carta. Aprobar por escrito el alcance: consulta de carta, disponibilidad, precios y categorías. Si se recibirán pedidos, definir canal, responsables, horarios y confirmaciones antes de prometer esa función.

## Pasar a operación real

1. Acordar el proceso, datos, permisos y criterios de aceptación.
2. Crear configuración de negocio y tablas dedicadas, con claves, índices y restricciones. Separar los datos reales de los ejemplos.
3. Implementar acceso privado, recuperación de cuenta, permisos por negocio y validaciones en servidor. Las validaciones del navegador no son una barrera de seguridad.
4. Implementar transacciones para reservar horarios y descontar existencias sin conflictos entre usuarios. Probar concurrencia y autorización.
5. Integrar pagos o mensajes con las cuentas autorizadas del negocio; utilizar entornos de prueba antes de operar.
6. Definir respaldo/restauración, exportación, mantenimiento, alertas, privacidad, alojamiento y costos externos.
7. Validar con el dueño, capacitar y publicar. Cambios de operación e integraciones se cotizan aparte del alcance aprobado.

## Tipos de panel

- Inventario: existencias, mínimos y valor del catálogo.
- Agenda: citas confirmadas, tiempo reservado y valor de servicios de ejemplo.
- Proyectos: trabajo por estado y porcentaje terminado.
- Pedidos: historial e importe simulado.

- Finanzas: ingresos y gastos del mes, flujo neto y gasto frente al presupuesto.
- Clientes: valor potencial abierto, etapas y seguimientos por atender.
- Cotizaciones: propuestas guardadas, pendientes y aceptadas.
- Servicios: órdenes activas, prioridades y entregas.

Todos los paneles usan ejemplos locales. Los datos bancarios, ingresos reales, analítica y colaboración requieren fuentes, permisos e indicadores acordados. Los estados comerciales no equivalen a pagos.

## Portfolio técnico

Para una candidatura, explicar problema, arquitectura, reglas y pruebas. El siguiente incremento valioso es un producto con autenticación, permisos probados, datos persistentes y observabilidad. No atribuir a estas demos pagos reales, IA, colaboración ni resultados comerciales que no poseen.

## Nuevas bases: Metas y Soporte

- Metas: presupuesto mensual, objetivos, aportaciones, progreso y duración estimada sin rendimientos. No ofrece conexión bancaria ni recomendaciones de inversión. En producción requiere acceso privado, historial y reglas de corrección de movimientos.
- Soporte: tickets con folio, categoría, prioridad, responsable, fecha objetivo e historial de respuestas. No envía mensajes ni monitorea routers. Portal del cliente, notificaciones, archivos y monitoreo son integraciones adicionales.

Los doce servicios se presentan en `/servicios/`. Redes, identidad y marketing tienen entregables propios; los proyectos móviles y de escritorio comienzan por viabilidad, plataforma y alcance. Las fichas `/soluciones/[slug]/#especificaciones` explican problema, recorrido y caso cotidiano.
