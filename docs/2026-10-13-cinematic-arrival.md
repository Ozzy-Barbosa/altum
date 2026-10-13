# Apertura e interacción de Altum

## Alcance

Se conserva el diseño aprobado, logo, constelaciones, órbitas, tarjetas traslúcidas,
formularios, idiomas y temas. Se enriquece la primera entrada y la recarga:

- Titular de inicio por líneas, con aparición escalonada de texto y acciones.
- Onda breve de luz, trazado de las tres órbitas y entrada por capas del logo y tarjetas.
- Campos de luz suaves que se desplazan lentamente, sin un disco opaco detrás del logo.
- Respuesta al puntero desde toda la portada y desplazamiento máximo de 4 px en su botón.
- Entrada más breve para las cabeceras de las páginas interiores.
- El átomo espera a entrar en pantalla si queda debajo del primer pliegue.

La secuencia principal dura aproximadamente 1,5 segundos. No introduce un cargador,
video, dependencia nueva ni bloqueo de navegación. Los estilos base siguen visibles
sin JavaScript. La pausa y la preferencia de movimiento reducido desactivan los efectos;
la salida, impresión y restauración de página limpian la entrada.

## Referencias consultadas

Se revisaron Landing.love, Awwwards, Godly, Epic, Unseen y Stripe. Se tomaron como
principios la revelación tipográfica, la composición por capas y la luz en movimiento,
sin copiar sus recursos. Algunas piezas de video de las galerías no se reprodujeron.

Se evaluaron los complementos Higgsfield y Lovable solicitados: sus flujos de video o
creación de sitios externos no eran adecuados para esta modificación del repositorio
existente. No se generaron videos ni se creó otro proyecto en la nube. La implementación
usa animación web nativa para conservar interacción y contenido indexable.

## Verificación local

- 79 pruebas automatizadas aprobadas; incluye 25 pruebas de entrada e interacción.
- Revisión independiente del código sin problemas bloqueantes encontrados.
- Comprobación de tipos y compilación terminadas correctamente.
- 124 páginas verificadas, 62 pares ES/EN y 13 códigos QR decodificados.
- Anchos ES revisados: 320, 390, 768, 834, 1024, 1180, 1194 y 1440 px.
- Anchos EN revisados: 320, 390, 834, 1194 y 1440 px.
- Sin desbordamiento horizontal ni intersección entre logo y tarjetas en las mediciones.
- Revisión visual clara/oscura, escritorio, móvil y tablet; encabezados legibles y completos.
- Activación de entrada comprobada en Servicios, Soluciones, Proyectos, Demos,
  Portafolio, Preguntas y Contacto.
- Pausa y recarga comprobadas: contenido visible y animaciones pausadas.
- Respuesta real al puntero comprobada en la portada; sin errores de consola observados.

Las medidas de tablet son emulación de viewport, no una prueba en un iPad físico.
La reducción de movimiento y BFCache tienen cobertura automatizada de sus eventos;
no se afirma una prueba física de todos los navegadores ni una medición de rendimiento
en hardware móvil. No se enviaron formularios ni se modificaron DNS o cuentas.

## Publicación

Publicar mediante el flujo existente de GitHub Pages sobre `main` y comprobar el SHA
desplegado, la portada pública y una ruta interior. Las capturas de revisión se guardan
en `output/qa/`, excluido de Git.
