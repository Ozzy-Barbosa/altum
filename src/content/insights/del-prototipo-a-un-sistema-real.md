---
title: "De una demo a un sistema para tu negocio: qué cambia"
description: "Conoce qué se necesita para convertir un prototipo en una aplicación privada: reglas del negocio, permisos, datos, pruebas y una entrega documentada."
category: "Operación"
published: 2026-09-07
order: 6
takeaway: "Una demo permite explorar la experiencia. La implementación real añade las reglas, los accesos y las condiciones de operación de cada negocio."
service: "bases-de-datos-la-paz"
demo: "soporte"
---
## La demo ayuda a definir lo que necesitas

Un prototipo permite probar pantallas y conversar sobre el trabajo cotidiano. Puedes registrar un producto, mover una tarea o preparar una cotización con información ficticia. Así es más fácil identificar funciones necesarias antes de contratar una implementación.

Las demostraciones públicas de Altum conservan ejemplos en el navegador. No comparten información entre empleados y no deben utilizarse como registro principal de un negocio. Ese límite permite explorar sin introducir datos de clientes reales.

## Adaptar una base tiene distintos niveles

Logo, colores, textos y datos de catálogo pueden configurarse cuando la operación es similar. Cambiar reglas de inventario, incorporar sucursales o conectar facturación requiere trabajo adicional.

| Parte del proyecto | Qué se define |
| --- | --- |
| Identidad | Marca, contacto, lenguaje y recursos autorizados |
| Operación | Estados, responsables, excepciones y reglas |
| Datos | Campos, importación, conservación y calidad |
| Acceso | Usuarios y acciones permitidas por rol |
| Integraciones | Proveedores, costos y comportamiento ante fallos |
| Entrega | Pruebas, documentación y mantenimiento acordado |

El alcance debe distinguir esas piezas para que el negocio sepa qué está contratando.

## Los permisos se comprueban en el servidor

Ocultar un botón no impide por sí solo una operación. Una aplicación privada debe comprobar quién hace la solicitud y a qué datos puede acceder. También necesita separar la información de cada cliente cuando una base de producto sirve a varios negocios.

Antes del lanzamiento se prueban usuarios sin permiso, registros ajenos y cambios simultáneos. En la práctica, dos personas pueden editar el mismo pedido; el sistema debe detectar el conflicto o aplicar una regla definida, evitando sobrescribir información de forma silenciosa.

## Preparar datos incluye poder recuperarlos

Una importación debe comenzar con una muestra pequeña que pueda revisarse. Conviene acordar qué campos son necesarios, cómo se corrigen duplicados y quién autoriza el resultado.

Los respaldos necesitan una política y una prueba de restauración. Tener un archivo guardado no basta si nadie sabe cómo recuperarlo o si no contiene la información esperada. La frecuencia y la conservación se definen según la operación y el servicio contratado.

## La entrega debe poder comprobarse

Prepara una lista de recorridos: registrar, consultar, corregir, cancelar y exportar. Verifica también errores y recuperación. El negocio debe recibir accesos, instrucciones y condiciones de soporte claras.

Puedes probar [Altum Soporte](/demos/soporte/) para entender un recorrido de atención y revisar sus [especificaciones](/soluciones/soporte/#especificaciones). Para conocer la base del propio sitio, consulta [cómo está construido Altum](/como-esta-hecho/).
