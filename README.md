# Altum — Soluciones Digitales

Sitio corporativo y portafolio estático preparado para
`https://www.altumlapaz.com/`, GitHub Pages y hosting tradicional.

## Características

- Sitio responsive sin dependencias ni proceso de compilación.
- Portafolio con Orthomax, Alexa Lara Fotografía y Proyectcons.
- Formulario que organiza el brief y lo envía directamente por WhatsApp.
- Enlaces oficiales de Facebook, Instagram y TikTok.
- SEO técnico: URL canónica, Open Graph, Twitter Card, JSON-LD,
  `robots.txt` y `sitemap.xml`.
- Accesibilidad básica, navegación móvil por teclado y reducción de movimiento.
- Animaciones optimizadas para detenerse fuera de pantalla.
- Página 404 personalizada, manifest e iconos para dispositivos.

## Probar localmente

No requiere instalación. Se recomienda servir la carpeta mediante Live Server o
cualquier servidor HTTP local para comprobar rutas y recursos.

## Publicar en GitHub Pages

1. Sube el contenido completo de esta carpeta a la rama `main`.
2. En GitHub abre **Settings → Pages**.
3. Selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Configura `www.altumlapaz.com` como dominio personalizado.
5. En el proveedor DNS, crea el registro `CNAME` de `www` hacia el destino que
   indique GitHub Pages.
6. Activa **Enforce HTTPS** cuando el certificado esté disponible.

El archivo `CNAME` ya contiene el dominio final y `.nojekyll` evita que GitHub
Pages procese los archivos como un proyecto Jekyll.

## Publicar en hosting tradicional

1. Sube todos los archivos, incluida la carpeta `assets`, a `public_html` o al
   directorio público configurado para el dominio.
2. Asegúrate de incluir los archivos ocultos `.htaccess` y `.nojekyll`.
3. Apunta `www.altumlapaz.com` al hosting y configura el dominio raíz para redirigir
   a `www`.
4. Instala y activa el certificado SSL antes de anunciar el sitio.

`.htaccess` añade redirección HTTPS/canónica, compresión, caché, cabeceras de
seguridad y la página 404 en servidores Apache. En Nginx o en un hosting que no
utilice Apache, esas reglas deben replicarse desde el panel del proveedor.

## Archivos principales

- `index.html`: contenido, metadatos y datos estructurados.
- `styles.css`: diseño responsive, animaciones y estados accesibles.
- `script.js`: navegación, animaciones y envío del formulario.
- `sitemap.xml` y `robots.txt`: descubrimiento por buscadores.
- `CNAME`: dominio personalizado para GitHub Pages.
- `.htaccess`: configuración recomendada para Apache.
- `404.html`: página de error personalizada.

## Antes del lanzamiento público

- Confirmar que DNS y HTTPS funcionen para `www.altumlapaz.com` y el dominio raíz.
- Registrar el dominio en Google Search Console y enviar `sitemap.xml`.
- Conectar una herramienta de analítica sólo si se define una política de
  privacidad y consentimiento adecuada.
- Publicar un aviso de privacidad antes de almacenar formularios, usar píxeles
  publicitarios o instalar cookies no esenciales.
- Sustituir las capturas y el estado “en desarrollo” cuando finalicen los tres
  proyectos mostrados.
