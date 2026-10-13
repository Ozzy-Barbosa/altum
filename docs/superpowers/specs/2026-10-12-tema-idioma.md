# Altum: tema claro, idioma y logo integrado

## Diseño aprobado y alcance

Solicitud del 12 de octubre de 2026: implementar y publicar las funcionalidades aprobadas en la propuesta, conservando la composición del sitio actual. La nueva captura es la referencia de composición, no una instrucción para sustituir el sitio por el mockup.

- Fondo claro inicial: blanco suave `#f8faff`, superficies blancas, texto azul marino y acentos azul/violeta. Debe funcionar también cuando el sistema operativo esté en oscuro.
- Control claro/oscuro accesible en navegación, con preferencia persistente y sin destello de tema incorrecto.
- Español como idioma principal; selector ES/EN para el contenido propio del sitio completo, incluidos navegación, formularios, avisos, estados, demostraciones y metadatos. No traducir marcas, direcciones, enlaces externos ni datos escritos por visitantes.
- Conservar estructura, átomo, órbitas, electrones, constelaciones, tarjetas, animaciones, controles de pausa y reducción de movimiento del sistema. Adaptar su contraste al tema sin cambiar su geometría o comportamiento.
- Integrar el PNG limpio aprobado, procedente de `output/branding/logo-altum-clean-preview.png`. Quitar únicamente el disco opaco de `.system-core`, no el átomo ni su iluminación exterior. Conservar el original como respaldo.
- Mantener proyectos, enlaces, precios en MXN, contactos, servicios, consentimientos y funcionamiento de formularios; no enviar propuestas ni suscripciones durante pruebas.
- Conservar las URLs españolas y el SEO existente. Ofrecer páginas equivalentes en inglés bajo `/en/`, con canonical propio y alternancias de idioma. Español seguirá siendo el valor predeterminado, sin redirección basada en idioma del navegador.
- No modificar datos persistidos de las demos, cuentas, DNS, correo ni servicios externos. No incluir documentos de Instagram ajenos a este trabajo en el commit.
- Publicar mediante el flujo existente de GitHub Pages únicamente después de pruebas, revisión visual y compilación correctas; comprobar despliegue y sitio público.

## Criterios de aceptación

La página inicial conserva su composición actual en ambos temas; logo sin disco opaco y sin el halo gris observado. ES/EN mantiene la página equivalente, no devuelve siempre al inicio. Al navegar y recargar se conserva el tema elegido. Formularios, estados interactivos y demos muestran el idioma seleccionado sin alterar los datos. Se revisa escritorio y móvil, teclado, contraste, movimiento reducido, errores de consola, metadatos y enlaces internos. No se considera publicado por el mero hecho de subir un commit.
