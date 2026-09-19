# Formularios y newsletter de Altum

Actualización: 18 de septiembre de 2026.

## Recepción

Los formularios por correo del sitio estático envían sus datos mediante POST HTTPS a FormSubmit. El destinatario es **altumlapaz@gmail.com** y no se incluye ninguna contraseña o clave privada en la web. El formulario de WhatsApp es independiente y no utiliza FormSubmit.

| Formulario | Ubicación                                         | Asunto del correo                               |
| ---------- | ------------------------------------------------- | ----------------------------------------------- |
| Proyecto   | `/contacto/`                                      | `[Altum Propuesta] Nueva solicitud de proyecto` |
| Newsletter | `/#newsletter` y `/contacto/#newsletter-contacto` | `[Altum Newsletter] Solicitud de suscripción`   |

FormSubmit muestra su verificación de seguridad al enviar y después regresa a `/gracias/propuesta/` o `/gracias/newsletter/`. Estas páginas tienen `noindex` y no aparecen en el sitemap. No se desactivó reCAPTCHA. Ambos formularios incluyen un campo trampa anti-spam y funcionan también sin JavaScript.

La primera recepción requiere que el propietario confirme el correo de activación de FormSubmit. En esta sesión el propietario confirmó haberlo activado. Dos pruebas internas posteriores fueron aceptadas por el servicio (`success: true`), una por cada tipo de asunto. La aceptación del servicio debe distinguirse de la confirmación de que Gmail lo depositó en la bandeja; revisar también Spam.

## Propuestas

Cada mensaje incluye contacto, tipo de proyecto y objetivo. Negocio, teléfono, funciones, referencias, presupuesto y plazo son opcionales. Se incluye el consentimiento para atender la solicitud y la versión del aviso de privacidad. JavaScript añade fecha ISO y la etiqueta del proyecto; sin JavaScript siguen enviándose el tipo seleccionado, los campos y el consentimiento.

El campo `email` permite responder al prospecto desde el mensaje recibido. Una propuesta **no equivale a una suscripción**. No importar automáticamente los correos de los prospectos a campañas.

## Gestión manual de suscripciones

Los intereses incluyen diseño web, tecnología y automatización, noticias y novedades, aplicaciones web y demos, apps móviles y aplicaciones de escritorio. Se pueden seleccionar varios y cada elección llega en un campo independiente del correo.

El formulario captura solicitudes y su consentimiento; no es una plataforma de envío de campañas. Los registros llegan al correo de Altum, no a las bases de datos de las demos.

1. Crea etiquetas de Gmail: `Altum / Propuestas`, `Altum / Newsletter` y `Altum / Bajas`.
2. Filtra por los asuntos anteriores; revisa primero las pruebas marcadas `PRUEBA`, que no deben agregarse a ninguna lista.
3. Guarda una lista privada con correo, nombre opcional, intereses, fecha, evidencia del consentimiento y estado (`activo` o `baja`). Elimina duplicados por correo. No subas esa lista al repositorio.
4. Antes de una campaña, revisa las solicitudes de baja enviadas a `altumlapaz@gmail.com` con el asunto `Baja de newsletter`. Exclúyelas antes del siguiente envío y conserva una lista mínima de exclusión para no volver a agregarlas por accidente.
5. En cada boletín incluye un enlace de baja: `mailto:altumlapaz@gmail.com?subject=Baja%20de%20newsletter`. No expongas destinatarios en Para/CC. Para campañas regulares conviene conectar un proveedor de email marketing con confirmación de suscripción, bajas automáticas y autenticación de remitente.

No están implementados envíos masivos automáticos, calendario editorial automático, panel de suscriptores, verificación de titularidad del correo del suscriptor ni confirmación doble. La validación inicial de FormSubmit confirma el **correo destinatario de Altum**, no la identidad de cada persona que se suscribe.

## Consultas por WhatsApp

En `/contacto/#whatsapp` hay un formulario independiente que pide nombre, tipo de proyecto, idea y consentimiento; el negocio es opcional y no se pide correo. Genera una vista previa local del mensaje y un enlace al número **+52 612 212 5198**. No envía información al generar el resumen, no almacena el borrador y no suscribe al newsletter.

Al pulsar «Abrir WhatsApp», el resumen se comparte con ese servicio mediante su enlace de chat. La persona debe confirmar el envío dentro de WhatsApp. Cambiar un campo oculta el resumen anterior para evitar compartir una versión desactualizada. Si JavaScript no está disponible, se mantiene un enlace directo al chat y el formulario nativo por correo continúa funcionando.

Referencia oficial del formato: <https://faq.whatsapp.com/5913398998672934>.

## Mantenimiento

- Contacto y redes: `src/data/contact.ts`.
- Propuesta: `src/pages/contacto.astro` y `src/styles/contact.css`.
- Newsletter reutilizable: `src/components/Newsletter.astro`.
- Validaciones y estados de envío: `src/lib/email-forms.ts`.
- Formulario y resumen de WhatsApp: `src/components/WhatsAppBrief.astro` y `src/lib/whatsapp-brief.ts`.
- Tipos de proyecto compartidos entre correo y WhatsApp: `src/data/project-types.ts`.
- Privacidad: `src/pages/privacidad.astro`.
- Ayuda del proveedor: <https://formsubmit.co/documentation>.

Si se cambia el correo de destino, se deberá activar el nuevo destinatario antes de publicar. No cambiar `_next` a una dirección local: debe conservarse una URL HTTPS pública. Si el proveedor no responde, el correo y WhatsApp siguen visibles como alternativas de contacto. La disponibilidad y el filtrado de entrega dependen de FormSubmit y Gmail.
