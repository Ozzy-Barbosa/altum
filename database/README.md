# Supabase preparado para Altum

Proyecto `altum-demos`, organización Altum, región `us-west-1`. Aprovisionado con costo inicial informado de 0 al mes. Revisar cuotas y condiciones antes de habilitar servicios o cambiar de plan.

## Estado

- Tabla `public.demo_workspaces`, clave compuesta `(user_id, module)`, contenido JSON limitado, versión y fecha de modificación.
- RLS habilitado; cuatro políticas limitan lectura, alta, modificación y baja al propietario autenticado.
- El rol público `anon` no tiene permisos de tabla. Los accesos anónimos de Auth están desactivados.
- La versión pública utiliza almacenamiento local. No necesita claves de Supabase ni crea cuentas.
- `src/lib/demo-store.ts` prepara carga y guardado privado con control de versión para detectar modificaciones simultáneas. Falta implementar la interfaz de acceso privado antes de activar esa modalidad.

No activar `PUBLIC_DEMO_CLOUD` en producción hasta implementar y probar el acceso privado. Copiar `.env.example` a un archivo local ignorado; usar únicamente la URL y una clave **publishable** en el cliente. Nunca publicar claves secretas o `service_role`.

La migración `migrations/001_demo_workspaces.sql` documenta el esquema aplicado mediante Supabase MCP. Los siguientes cambios de esquema deben tener migraciones revisables y verificación de permisos.

La ampliación `supabase/migrations/20260907223818_expand_business_demos.sql`, generada con Supabase CLI 2.117.0 y aplicada mediante MCP como `expand_business_demos`, admite los cuatro módulos nuevos: finanzas, CRM, cotizaciones y servicios. Mantiene las políticas por propietario, los límites de contenido y el acceso público deshabilitado. La colección puede contener hasta diez documentos por propietario. El historial del servidor utiliza la fecha asignada por MCP; estos archivos son una copia revisable de los cambios, no un proyecto local vinculado para ejecutar `db push` sin reconciliar el historial.

## Límite del modelo

El documento JSON por usuario/módulo es un espacio de prototipo, no el modelo de producción de un cliente. Antes de operar negocios reales se necesitan tablas normalizadas por entidad, aislamiento por negocio, roles, transacciones, restricciones de horarios/existencias, respaldos y política de retención. No reutilizar este proyecto para almacenar datos reales sin definir ese alcance.
