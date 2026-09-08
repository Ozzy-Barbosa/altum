"""Create the Altum sales folder, study guide, operating guide and a vector QR card.
Run node --experimental-strip-types tools/export-catalog.mjs first.
Only the sales folder and rendered business card are copied to public/.
"""
import json, shutil
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon, Circle
from reportlab.graphics import renderPDF

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'tmp/pdfs/catalog.json').read_text(encoding='utf8'))
OUT=ROOT/'output/pdf'; OUT.mkdir(parents=True,exist_ok=True)
PUBLIC=ROOT/'public/documentos'; PUBLIC.mkdir(parents=True,exist_ok=True)
for name,file in [('Body','arial.ttf'),('Bold','arialbd.ttf')]: pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')
W,H=A4; NAVY=HexColor('#0c1930'); BLUE=HexColor('#167acb'); CYAN=HexColor('#16b8d6'); MUTED=HexColor('#526278'); LINE=HexColor('#dce5ef'); PALE=HexColor('#eef5fb')
def P(s,size=10.5,bold=False,color=NAVY):
    return Paragraph(s,ParagraphStyle('p',fontName='Bold' if bold else 'Body',fontSize=size,leading=size*1.48,textColor=color,spaceAfter=9))
def title(k,t,sub): return [P(k.upper(),8.5,True,BLUE),P(t,27,True),P(sub,11.5,False,MUTED),Spacer(1,12)]
def h(t):
    heading=P(t,15,True);heading.style.spaceBefore=12;heading.style.keepWithNext=True;return heading
def bullets(items): return [P('• '+escape(x)) for x in items]
def table(headers,rows,widths=None):
    cell=lambda s:P(escape(str(s)).replace('\n','<br/>'),9)
    data=[[P(escape(x),9,True,white) for x in headers]]+[[cell(v) for v in row] for row in rows]
    t=Table(data,colWidths=widths or [(W-84)/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,1),(-1,-1),[white,PALE]),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]))
    return t
def qr(url,size=100):
    q=QrCodeWidget(url,barLevel='M'); x,y,x1,y1=q.getBounds(); d=Drawing(size,size,transform=[size/(x1-x),0,0,size/(y1-y),0,0]);d.add(q);return d
def diagram(labels):
    d=Drawing(W-84,118); gap=16; width=(W-84-gap*(len(labels)-1))/len(labels)
    for i,(a,b) in enumerate(labels):
        x=i*(width+gap);d.add(Rect(x,10,width,95,rx=9,fillColor=PALE,strokeColor=LINE))
        d.add(String(x+12,82,a,fontName='Bold',fontSize=11,fillColor=BLUE))
        for j,line in enumerate(b.split('|')):d.add(String(x+12,61-j*15,line,fontName='Body',fontSize=9,fillColor=NAVY))
        if i<len(labels)-1:
            d.add(Line(x+width+2,57,x+width+gap-2,57,strokeColor=BLUE));d.add(Polygon([x+width+gap-2,57,x+width+gap-7,61,x+width+gap-7,53],fillColor=BLUE,strokeColor=BLUE))
    return d
def page(c,doc):
    c.saveState();c.setFillColor(NAVY);c.rect(0,H-75,W,75,fill=1,stroke=0)
    c.drawImage(str(ROOT/'public/assets/logo-altum-symbol-transparent.png'),40,H-51,width=48,height=26,mask='auto')
    c.setFillColor(white);c.setFont('Bold',15);c.drawString(104,H-37,'ALTUM');c.setFont('Body',7);c.drawString(104,H-51,doc.title_label.upper())
    c.setStrokeColor(CYAN);c.setLineWidth(2);c.line(42,H-75,125,H-75)
    c.setStrokeColor(HexColor('#2c4568'));c.setLineWidth(.6)
    c.ellipse(W-148,H-69,W-27,H-10,stroke=1,fill=0);c.ellipse(W-125,H-86,W-62,H+8,stroke=1,fill=0)
    c.setFillColor(CYAN);c.circle(W-50,H-29,2,stroke=0,fill=1)
    c.setStrokeColor(LINE);c.line(42,44,W-42,44);c.setFillColor(MUTED);c.setFont('Body',7.5);c.drawString(42,28,'www.altumlapaz.com  |  Edición 08.09.2026');c.drawRightString(W-42,28,f'{doc.page:02d} / {doc.expected_pages:02d}');c.restoreState()
def build(name,label,pages):
    doc=SimpleDocTemplate(str(OUT/name),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=100,bottomMargin=65,title=label,author='Altum Soluciones Digitales');doc.title_label=label;doc.expected_pages=len(pages)
    story=[]
    for i,items in enumerate(pages):
        if i:story.append(PageBreak())
        story.extend(items)
    doc.build(story,onFirstPage=page,onLaterPages=page)
    print(name,len(pages),'planned pages')

def website_image(filename, width=245):
    from PIL import Image as Raster
    path=ROOT/'public/assets'/filename
    with Raster.open(path) as img: size=img.size
    return Image(str(path),width=width,height=width*size[1]/size[0])

def note(text):
    box=Table([[P(text,10.5)]],colWidths=[511])
    box.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.6,LINE),('LEFTPADDING',(0,0),(-1,-1),16),('RIGHTPADDING',(0,0),(-1,-1),16),('TOPPADDING',(0,0),(-1,-1),13),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return box

def site_map():
    d=Drawing(511,190)
    d.add(Rect(182,148,147,32,rx=8,fillColor=NAVY,strokeColor=NAVY));d.add(String(255,160,'ALTUM / INICIO',textAnchor='middle',fontName='Bold',fontSize=11,fillColor=white))
    columns=[('CONTRATAR',['Servicios: 12 fichas','Proyectos: 4 casos','Contacto / tarjeta']),('APRENDER',['Soluciones: 6 guías','Especificaciones','Preguntas frecuentes']),('COMPROBAR',['Demos: 12 módulos','Portafolio personal','Cómo está hecho'])]
    for i,(label,rows) in enumerate(columns):
        x=i*176;mid=x+79.5
        d.add(Line(255,148,255,132,strokeColor=BLUE));d.add(Line(79.5,132,431.5,132,strokeColor=BLUE));d.add(Line(mid,132,mid,118,strokeColor=BLUE))
        d.add(Rect(x,15,159,103,rx=8,fillColor=PALE,strokeColor=LINE));d.add(String(x+12,96,label,fontName='Bold',fontSize=9,fillColor=BLUE))
        for j,row in enumerate(rows):d.add(String(x+12,73-j*19,row,fontName='Body',fontSize=9,fillColor=NAVY))
    return d

def sales():
    pages=[]
    pages.append(title('Presentación para negocios','Diseño que inspira.<br/>Tecnología que impulsa.','Una presencia que comunica tu valor. Herramientas que facilitan atender, vender y organizar tu negocio.')+[
      table(['Una necesidad','Una posibilidad'],[['Presentar y vender','Sitios web, identidad, campañas y comercio electrónico'],['Organizar y atender','Agendas, inventario, cotizaciones y seguimiento'],['Conectar y crecer','Redes Wi-Fi, datos y aplicaciones por etapas']],[150,361]),Spacer(1,19),
      h('Doce aplicaciones que puedes probar.'),P('Explora el catálogo desde tu celular. Sin registro, con información ficticia y recorridos interactivos.'),
      Table([[qr(DATA['site']['origin']+'/demos/',125),P('<b>Escanea y prueba.</b><br/><br/>www.altumlapaz.com<br/>+52 612 212 5198<br/>Instagram: @altumlapaz',12)]],colWidths=[160,351]),Spacer(1,15),
      h('Un proyecto claro desde el inicio.'),P('Escuchamos tu necesidad, definimos el alcance, construimos y probamos contigo. El presupuesto detalla entregables, revisiones y costos externos.')])
    pages.append(title('Servicios / una visión integral','Más puntos de contacto.<br/>Una misma dirección.','Cada servicio tiene su propio alcance. Podemos comenzar por una necesidad concreta y ampliar por etapas.')+[
      table(['Servicio','Qué podemos trabajar'],[[s['short'],s['intro']] for s in DATA['services']],[164,347]),Spacer(1,13),P('Equipos, materiales, pauta publicitaria, cuentas, licencias y servicios externos se acuerdan por separado. La viabilidad de aplicaciones móviles y de escritorio se revisa antes de definir el desarrollo.',9,False,MUTED)])
    for i in range(0,len(DATA['solutions']),2):
      content=[]
      for s in DATA['solutions'][i:i+2]:
        content += [P(s['name'].upper(),8,True,BLUE),P(s['label'],22,True),P(s['description'],10.5),P('<b>Para:</b> '+escape(s['audience']),9.5),
        Table([[Paragraph('<br/>'.join('• '+escape(f) for f in s['features']),ParagraphStyle('features',fontName='Body',fontSize=10,leading=15,textColor=MUTED)),qr(DATA['site']['origin']+'/demos/'+s['slug']+'/',88)]],colWidths=[410,101]),P('<b>En la práctica:</b> '+escape(DATA['specifications'][s['slug']][2]),9.5),P('<b>Prueba:</b> '+escape(s['demo']),9.5),Spacer(1,18)]
      content += [P('Adaptamos identidad, contenido y reglas al alcance acordado. Datos ficticios: las demos no realizan cobros, reservas, envíos ni solicitudes reales.',8,False,MUTED)]
      pages.append(content)
    pages.append(title('Trabajo publicado / evidencia','De una necesidad real<br/>a una experiencia visible.','Dos proyectos que puedes visitar. Cada caso describe el contexto, la participación y la entrega de Altum.')+[
      Table([[website_image('project-orthomax-202609.png'),website_image(next(p['image'] for p in DATA['projects'] if p['slug']=='conchalito-tours'))]],colWidths=[255.5,255.5]),Spacer(1,16),
      table(['Orthomax / salud','Conchalito Tours / turismo'],[['Presentación de servicios odontológicos, información del consultorio y un recorrido para solicitar atención.','Presentación de experiencias, rutas, información de visita y un recorrido de contacto para reservar.'],['www.orthomaxlapaz.com','www.conchalitotours.com']],[255.5,255.5]),
      h('Una buena página responde antes de que te pregunten.'),P('Qué ofreces, por qué elegirte, cómo funciona y cuál es el siguiente paso. Diseñamos el contenido y la navegación alrededor de esas decisiones.'),
      note('<b>Explora los casos:</b> <link href="https://www.altumlapaz.com/proyectos/" color="#167acb">www.altumlapaz.com/proyectos/</link><br/>Las imágenes muestran trabajo publicado. No se atribuyen cifras de ventas ni resultados sin una medición confirmada.')])
    pages.append(title('El siguiente paso','Conversemos sobre<br/>lo que quieres mejorar.','Puedes comenzar con un proceso concreto y una primera entrega que podamos comprobar juntos.')+[
      diagram([('Comprender','Necesidad y|prioridades'),('Definir','Alcance e|inversión'),('Construir','Diseño, pruebas|y revisión'),('Acompañar','Entrega y|siguiente paso')]),
      table(['Lo que acordamos','Lo que recibes'],[['Un objetivo prioritario','Una propuesta con funciones y entregables concretos.'],['Una forma de validar','Escenarios que deben funcionar antes de aceptar la entrega.'],['Una continuidad definida','Capacitación, mantenimiento y costos externos según la propuesta.']],[190,321]),Spacer(1,18),
      Table([[website_image('oscar-altum-portrait.webp',97),[P('Hola, soy Oscar.',19,True),P('Detrás de Altum: diseño, desarrollo y atención directa desde La Paz, Baja California Sur.',11),P('<b>+52 612 212 5198</b><br/><link href="https://www.altumlapaz.com/contacto/" color="#167acb">www.altumlapaz.com/contacto/</link>',11)]]],colWidths=[122,389]),Spacer(1,18),
      note('<b>Para nuestra primera conversación:</b> cuéntame cómo trabajas hoy, qué te quita tiempo y qué te gustaría lograr. Con eso elegimos una referencia y definimos el siguiente paso.')])
    build('altum-presentacion-comercial.pdf','Presentación comercial',pages)
    shutil.copy2(OUT/'altum-presentacion-comercial.pdf',PUBLIC/'altum-presentacion-comercial.pdf')

def study():
    pages=[]
    pages.append(title('Guía de estudio / 01','Así está construido<br/>tu Altum.','Una guía para entenderlo, mantenerlo y explicarlo con tus propias palabras.')+[
      h('Qué construimos'),P('Altum reúne un sitio comercial, un portafolio profesional y un laboratorio de doce demos. El contenido público se genera con Astro. Las herramientas interactivas se construyen con React y guardan información ficticia en el navegador.'),
      diagram([('Contenido','Servicios|Proyectos|Fichas'),('Interacción','Demos|Formularios|Filtros'),('Presentación','Dominio|Documentos|Contacto')]),
      h('Cómo estudiar esta guía'),table(['Recorrido','Objetivo'],[['1. Páginas 2-3','Entender el mapa y las tecnologías.'],['2. Páginas 4-6','Seguir un dato, un componente y una publicación.'],['3. Páginas 7-9','Conocer límites, mantenimiento y crecimiento.'],['4. Páginas 10-12','Explicarlo, publicar una guía y entender la recuperación local.']],[155,356]),
      P('Versión documentada: septiembre de 2026. Los números, dependencias y procesos corresponden al repositorio revisado para esta entrega.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 02','El mapa de páginas.','Una ruta es la dirección que identifica una página. Las páginas se agrupan por la intención del visitante.')+[
      site_map(),
      table(['Ruta o grupo','Qué contiene'],[['/','Presentación y tres demos destacadas.'],['/servicios/','Oferta comercial y doce fichas de servicios.'],['/soluciones/','Blog educativo con seis guías en /soluciones/guias/.'],['/soluciones/[producto]/','Doce fichas con las especificaciones de las demos.'],['/demos/','Catálogo y doce aplicaciones interactivas.'],['/proyectos/ y /portafolio/','Casos, foto personal, visión, método y tecnologías.'],['/como-esta-hecho/','Explicación pública de la arquitectura.'],['Páginas de apoyo','Contacto, preguntas, privacidad, presentación y tarjeta.']],[195,316]),
      P('El catálogo de código crea automáticamente una ficha y una ruta de demo por solución. Una ruta nueva necesita también su implementación interactiva, no solo un nombre.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 03','Qué hace cada tecnología.','Una herramienta se elige por su función; agregar un logotipo no modifica la arquitectura.')+[
      table(['Tecnología','Papel en esta aplicación'],[['HTML y CSS','Estructura accesible, tamaños, color, distribución y adaptación a pantalla.'],['Astro','Genera las páginas y comparte plantillas. Entrega contenido HTML preparado.'],['React','Controla el estado y los recorridos de las demos. Cada módulo se carga bajo demanda.'],['TypeScript / JavaScript','Tipos, eventos, validaciones y reglas de funcionamiento.'],['Sass / SCSS','Preprocesa estilos reutilizables. El navegador recibe CSS, no ejecuta Sass.'],['SVG y Canvas','SVG dibuja iconos y órbitas; Canvas dibuja las constelaciones.'],['Node.js / npm','Instalan dependencias, ejecutan pruebas y construyen el sitio.'],['Git / GitHub / Actions','Historial de cambios, repositorio y publicación automatizada.'],['PostgreSQL / Supabase','Base preparada para módulos privados; el acceso público sigue siendo local.'],['Flutter / Tauri','Ecosistema previsto para proyectos móviles y de escritorio; no son el motor de esta web.']],[155,356]),
      P('Los iconos provienen de Simple Icons. Las fuentes y los recursos visuales se sirven desde Altum. La página de arquitectura distingue las tecnologías del sitio de las posibilidades de otros proyectos.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 04','Sigue un cambio de principio a fin.','Ejemplo: registrar una aportación de ahorro en Altum Metas.')+[
      diagram([('Formulario','Capturas|importe y fecha'),('Regla','Valida y calcula|un nuevo estado'),('Interfaz','Actualiza el|progreso visible'),('Guardado','Conserva el dato|en el navegador')]),
      table(['Paso','Qué sucede realmente'],[['1. Abrir la demo','Astro sirve la página y React activa el módulo PersonalDemo.'],['2. Capturar','El formulario recoge un importe, fecha y nota de ejemplo.'],['3. Validar','extended-domain comprueba importe positivo, fecha y pendiente de la meta.'],['4. Calcular','El dinero se convierte a centavos enteros para evitar errores decimales de cálculo.'],['5. Guardar','useDemo calcula el estado; local-persistence compara la versión y guarda el resultado.'],['6. Volver','El mismo navegador recupera el ejemplo. Otro dispositivo no recibe esos cambios.']],[130,381]),
      h('Por qué hay varias capas'),P('La interfaz muestra y recoge información. Las reglas deciden qué es válido. El almacenamiento conserva el resultado. Separarlas facilita reutilizar el diseño y comprobar los cálculos sin depender de clicks.'),
      P('Ejercicio: agrega una aportación, recarga y observa el progreso. Después abre Privacidad y borra los datos de demostración. Al regresar se recuperan los ejemplos iniciales.',10,True)])
    pages.append(title('Guía de estudio / 05','Dónde vive cada pieza.','El código activo está en src/ y los recursos públicos en public/. Los archivos históricos de la landing no son la nueva aplicación.')+[
      table(['Carpeta o archivo','Qué cambiar allí'],[['src/pages/ y src/layouts/','Rutas, plantillas, navegación, pie y metadatos.'],['src/content/insights/','Guías del blog; el esquema está en content.config.ts.'],['src/data/catalog.ts','Servicios, funciones, enlaces y casos.'],['src/data/specifications.ts','Problema, recorrido y caso cotidiano de cada solución.'],['src/components/','Tarjetas, ilustraciones SVG, acordeón y constelaciones.'],['src/components/demos/','Pantallas y formularios de cada aplicación.'],['src/lib/*-domain.mjs','Cálculos y reglas de las operaciones.'],['src/lib/local-persistence.mjs','Guardado local, copia anterior y detección de conflictos.'],['src/lib/demo-store.ts','Adaptadores de acceso privado; no activa la nube por sí solo.'],['src/styles/','global.css, evolution.scss y editorial.scss.'],['public/','Logos, retrato, imágenes y presentación comercial.'],['tests/, tools/, database/, docs/','Pruebas, documentos, preparación de datos y decisiones.']],[210,301]),
      P('El retrato original elegido fue me1.jpg. Se publica en WebP, con versiones de 480 y 960 px, sin metadatos personales del archivo. La guía y el manual se entregan localmente; solo la presentación comercial es pública.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 06','Cómo llega el código al dominio.','Publicar es convertir el proyecto en archivos que el visitante puede abrir.')+[
      diagram([('Modificar','Cambios en el|repositorio'),('Comprobar','Pruebas, tipos|y construcción'),('Publicar','Actions despliega|GitHub Pages'),('Verificar','Se abre el|dominio real')]),
      h('El flujo de esta entrega'),bullets(['Las dependencias y sus versiones quedan registradas en package.json y package-lock.json.','Las pruebas de reglas detectan errores en importes, estados, límites y operaciones.','Astro revisa los tipos y genera el directorio dist/.','La verificación revisa títulos, descripciones, enlaces, datos estructurados y códigos QR.','Un cambio subido a main ejecuta el flujo de GitHub Actions y publica el resultado.','El dominio www.altumlapaz.com muestra esa publicación. El dominio sin www redirige allí.']),
      h('Qué significa un fallo'),P('Si falla una comprobación, se corrige antes de publicar. Si el despliegue termina pero el navegador muestra algo viejo, primero se recarga y se comprueba la versión, los recursos y el dominio.'),
      P('Para revertir: crear un cambio que revierta el commit problemático, revisar y publicar. Evita borrar el historial o editar archivos generados dentro de dist/.',10,True)])
    pages.append(title('Guía de estudio / 07','Qué es demo y qué es producción.','Esta diferencia es la base de una propuesta honesta y de una entrega segura.')+[
      table(['Demos públicas','Sistema para un cliente'],[['Datos ficticios y locales','Datos reales con autorización y política definida'],['Sin registro público','Acceso privado, usuarios y permisos'],['Sin sincronización','Servidor y base de datos compartida'],['Pedidos y reservas simulados','Operaciones confirmadas por reglas del servidor'],['Cotización PDF de ejemplo','Documento configurado; facturación requiere integración específica'],['Sin conexión bancaria','Cualquier integración bancaria exige análisis y permisos'],['Sin envíos automáticos','Canales y avisos configurados con consentimiento'],['Restablecer repone ejemplos','Respaldo, restauración y retención de datos reales']],[255.5,255.5]),
      h('Supabase en esta base'),P('El repositorio incluye adaptadores y preparación de datos para módulos privados. Metas y Soporte son locales en esta entrega. Una conexión real requiere revisar el esquema, las credenciales, los permisos y la configuración actual del proyecto. Esta actualización no modifica la autenticación ni activa el acceso anónimo.'),
      P('Nunca colocar contraseñas o claves de administración en el navegador, repositorio público, PDFs o enlaces. Una variable marcada como pública debe considerarse visible para el visitante.',10,True)])
    pages.append(title('Guía de estudio / 08','Diseño, movimiento y SEO.','La presentación debe facilitar entender y utilizar la aplicación.')+[
      table(['Decisión','Por qué existe'],[['Tarjetas translúcidas','Permiten ver el fondo conservando contraste para leer.'],['Órbitas y respuesta al cursor','Refuerzan la identidad; se limitan a dispositivos con puntero fino.'],['Constelaciones','Cantidad de partículas y resolución limitadas para cuidar recursos.'],['Pausa de movimiento','Respeta el sistema y una preferencia guardada del visitante.'],['Navegación adaptable','El menú se pliega cuando el espacio disponible es menor.'],['HTML semántico','Encabezados, campos, enlaces y botones tienen funciones reconocibles.'],['Metadatos y rutas canónicas','Ayudan a describir e identificar cada página.'],['Mapa del sitio','Permite descubrir páginas comerciales y casos; excluye demos ficticias.'],['Datos estructurados','Describen el estudio, páginas y servicios a los buscadores.']],[170,341]),
      h('Lo que SEO no significa'),P('El sitio no garantiza primeros lugares ni indexación inmediata. El contenido útil, la reputación del negocio, los enlaces y la competencia también influyen. La optimización técnica es una base que debe acompañarse de trabajo continuo.'),
      P('No agregues reseñas, resultados, certificaciones o ubicaciones que no puedas demostrar. La claridad comercial forma parte de la calidad del sitio.',10,True)])
    pages.append(title('Guía de estudio / 09','Cómo ampliar sin desordenar.','Cada producto debe resolver un recorrido completo antes de sumar más funciones.')+[
      diagram([('Elegir','Problema y|usuario'),('Diseñar','Flujo y datos|mínimos'),('Construir','Pantalla, reglas|y guardado'),('Validar','Recorrido y|entrega')]),
      h('Agregar una nueva demo'),bullets(['Definir la necesidad, funciones, límites y un ejemplo de uso.','Añadir la ficha al catálogo y las especificaciones.','Crear el estado inicial, las operaciones y sus validaciones.','Construir el componente de React y conectarlo al selector de módulos.','Comprobar persistencia, restauración, errores, celular y teclado.','Actualizar presentación, privacidad y documentación cuando cambie el comportamiento.']),
      h('Agregar una integración real'),P('Definir proveedor, costo y titular de la cuenta. Guardar secretos en servidor, comprobar autenticación y autorización, gestionar fallos y registrar eventos. Las reglas críticas también se validan en el servidor.'),
      h('Trabajar móvil y escritorio'),P('Reutilizar conceptos, datos y servicios es posible. La interfaz, los permisos, el funcionamiento sin conexión, instaladores y publicación en tiendas tienen requisitos propios. Primero un prototipo y una plataforma confirmada.')])
    pages.append(title('Guía de estudio / 10','Explícalo con tus palabras.','Un ensayo de tres minutos y una comprobación de comprensión.')+[
      h('Guion para presentar Altum'),P('“Altum combina un sitio de presentación con aplicaciones que puedes probar. Las páginas cargan contenido preparado y cada demo activa las herramientas que necesita. El catálogo comparte información entre fichas y documentos. Para tu negocio partimos de una base y definimos datos, accesos e integraciones según tu operación.”'),
      table(['Pregunta','Respuesta que debes poder explicar'],[['¿Qué hace Astro?','Prepara las páginas y comparte su estructura.'],['¿Qué hace React?','Gestiona las pantallas y cambios de las aplicaciones interactivas.'],['¿Dónde se guarda una prueba?','En este navegador; no se comparte automáticamente.'],['¿Qué falta para un cliente?','Alcance, datos autorizados, accesos, backend, pruebas y entrega.'],['¿Por qué usar centavos?','Para calcular dinero con enteros y evitar imprecisiones decimales.'],['¿Cuál es la ruta de publicación?','Cambio, revisión, construcción, despliegue y verificación del dominio.']],[185,326]),
      h('Lecturas y archivos de referencia'),P('Documentación oficial: docs.astro.build · react.dev · sass-lang.com · docs.github.com/pages · supabase.com/docs · docs.flutter.dev · v2.tauri.app.',9),
      P('En el repositorio: README.md, docs/PRODUCTOS.md, docs/VALIDACION.md, src/data/catalog.ts, src/lib/ y .github/workflows/deploy.yml. Esta guía describe la implementación del repositorio; las guías oficiales explican las herramientas.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 11','Del artículo al buscador.','Servicios explica lo que ofreces. Soluciones educa. Demos permite comprobar una experiencia.')+[
      diagram([('Escribir','Markdown y|metadatos'),('Validar','Colección y|campos'),('Construir','HTML, RSS y|mapa del sitio'),('Descubrir','Enlaces y|buscadores')]),
      table(['Pieza','Qué debes entender'],[['Colección insights','Cada archivo .md contiene título, descripción, categoría, fecha, orden y contenido.'],['Esquema','content.config.ts comprueba campos antes de construir. draft: true excluye la guía.'],['Página de artículo','Genera texto, índice de lectura, fecha, idea clave y enlaces a servicios y demos.'],['Banners','ArticleIllustration dibuja seis diseños SVG por tema. Son decorativos y ligeros.'],['SEO técnico','Títulos, descripción, canónica, BlogPosting, RSS y mapa con páginas indexables.'],['IndexNow','Notifica URLs publicadas; no garantiza indexación. Una respuesta 202 queda pendiente de validación.']],[144,367]),
      note('<b>Publicar una nueva guía:</b> redacta para una duda real, usa fuentes cuando afirmes hechos, enlaza el servicio relacionado, revisa en móvil y comprueba la nueva URL después del despliegue.'),
      P('Safari, Edge, Firefox y Brave son navegadores. La compatibilidad visual y el rastreo por buscadores son trabajos relacionados, pero distintos. Referencias: docs.astro.build/en/guides/content-collections/ · indexnow.org/documentation.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 12','Guardado y recuperación:<br/>qué protege cada capa.','La demo conserva ejemplos en el navegador. Esta protección no equivale a una base compartida ni a un respaldo externo.')+[
      diagram([('Leer','Versión guardada|y módulo'),('Comparar','¿Cambió en|otra pestaña?'),('Conservar','Copia anterior|válida'),('Escribir','Nueva revisión|local')]),
      table(['Situación','Comportamiento'],[['Una pestaña guarda primero','La otra detecta que su versión quedó atrás y evita sobrescribir el cambio.'],['El dato principal está dañado','Si existe una copia anterior válida, intenta recuperarla y muestra un aviso.'],['El navegador impide guardar','La demo informa la limitación; no debes asumir persistencia.'],['Se borran los datos de ejemplo','Se eliminan las claves de demostración y la copia anterior.'],['Otro teléfono abre Altum','Recibe sus propios ejemplos; no sincroniza las modificaciones.']],[202,309]),
      h('Lo que falta para un piloto con usuarios reales'),P('Autenticación, permisos comprobados en servidor, modelo de datos, transacciones, respaldo externo y restauración probada. Definir también qué ocurre cuando dos personas editan lo mismo.'),
      note('<b>Ejercicio de estudio:</b> abre Metas en dos pestañas. Guarda un cambio en la primera y otro en la segunda. Lee el aviso, recarga y comprueba el dato conservado. Después restaura los ejemplos.'),
      P('Web Locks coordina escrituras cuando el navegador lo admite. La comparación de versiones sigue disponible como alternativa, pero no ofrece una transacción de base de datos. Referencia del proyecto: docs/PRODUCTOS.md.',9,False,MUTED)])
    # Flatten bullet groups for flowable compatibility.
    pages=[[x for item in items for x in (item if isinstance(item,list) else [item])] for items in pages]
    build('altum-guia-arquitectura.pdf','Guía de arquitectura y estudio',pages)

def operations():
    pages=[]
    pages.append(title('Manual de campo / 01','De la demostración<br/>a una entrega profesional.','Tu guía para conversar, cotizar, adaptar y acompañar un proyecto sin prometer de más.')+[
      h('La idea central'),P('Una demo muestra una posibilidad. Un proyecto entregable resuelve un proceso concreto, tiene un responsable que lo valida y establece qué incluye el servicio. Tu ventaja comercial empieza al entender bien ese proceso.'),
      diagram([('Escuchar','Detectar un|problema'),('Mostrar','Probar un|recorrido'),('Acordar','Definir alcance|y aceptación'),('Entregar','Validar y|acompañar')]),
      table(['Antes de visitar','Lleva preparado'],[['Carpeta','Presentación comercial y tarjeta con QR legible.'],['Celular','Demos probadas, conexión disponible y ejemplos restaurados.'],['Preguntas','Un objetivo claro y espacio para anotar necesidades.'],['Propuesta','Formato con entregables, límites y costos externos.']],[155,356]),
      P('Esta guía es un marco operativo y comercial. No establece precios de mercado, condiciones fiscales ni sustituye contratos específicos.',9,False,MUTED)])
    pages.append(title('Manual de campo / 02','Una conversación de diez minutos.','Primero una necesidad real; después la herramienta adecuada.')+[
      table(['Momento','Pregunta o acción'],[['1. Contexto','¿Cómo atienden hoy este proceso y quién lo realiza?'],['2. Fricción','¿Dónde pierden más tiempo o se equivocan con más frecuencia?'],['3. Volumen','¿Cuántas veces ocurre por día o semana?'],['4. Consecuencia','¿Qué pasa cuando se pierde una cita, pedido o seguimiento?'],['5. Prioridad','Si pudiéramos mejorar una sola cosa, ¿cuál elegirías?'],['6. Evidencia','Solicita una muestra sin datos sensibles: formato, pantalla o flujo.'],['7. Demostración','Muestra un recorrido de dos minutos relacionado con ese problema.'],['8. Cierre','Acordar una revisión de alcance y quién puede aprobarla.']],[140,371]),
      h('Cómo mostrar sin distraer'),P('Abre una sola demo, explica la necesidad, realiza una operación y muestra el resultado. Por ejemplo: crear una cotización, revisar su total y descargar el PDF. Luego relaciona el recorrido con su negocio.'),
      P('No envíes mensajes, pedidos o formularios reales durante una demostración sin autorización. No captures datos privados del prospecto en las demos públicas.',10,True)])
    pages.append(title('Manual de campo / 03','Elegir la demo correcta.','Una tabla rápida para asociar necesidad y recorrido.')+[
      table(['Lo que escuchas','Qué mostrar','Recorrido'],[['“Cambio mucho mi carta”','Menú','Buscar y preparar un pedido.'],['“Se cruzan mis citas”','Agenda','Elegir y cancelar un horario.'],['“No sé qué hay en stock”','Inventario','Registrar una salida y revisar mínimos.'],['“Quiero vender mi catálogo”','Commerce','Carrito y pedido de ejemplo.'],['“No sabemos qué sigue”','Proyectos','Mover una tarea entre etapas.'],['“No encuentro instrucciones”','Search','Buscar y abrir un documento.'],['“No entiendo mis gastos”','Finanzas','Mes, movimientos y presupuesto.'],['“Olvido dar seguimiento”','Clientes','Prospecto y siguiente contacto.'],['“Cotizo manualmente”','Cotiza','Conceptos, total y PDF.'],['“Pierdo el historial del trabajo”','Servicio','Orden y cambio de estado.'],['“Quiero ordenar mis metas”','Metas','Presupuesto y aportación.'],['“Se quedan solicitudes abiertas”','Soporte','Ticket, respuesta y resolución.']],[193,102,216]),
      P('Las fichas de cada solución incluyen necesidad, funcionamiento y un caso cotidiano. Úsalas cuando el prospecto quiera entender antes de probar.',9,False,MUTED)])
    pages.append(title('Manual de campo / 04','Qué significa adaptar una base.','Cambiar una marca es distinto de cambiar la forma de operar.')+[
      table(['Nivel','Ejemplos','Cómo acordarlo'],[['Configuración','Logo, colores, contacto, catálogo, textos, categorías.','Lista de datos y responsable de entregarlos.'],['Operación','Etapas, profesionales, reglas, permisos, sucursales.','Mapa del proceso y escenarios aceptados.'],['Integración','Pagos, envíos, mensajería, bancos, otros sistemas.','Proveedor, API, costos, credenciales y pruebas.'],['Infraestructura','Base de datos, dominio, respaldos, monitoreo.','Titular, renovación, acceso y recuperación.'],['Nueva plataforma','App móvil, instalador de escritorio, modo sin conexión.','Compatibilidad, distribución y mantenimiento.']],[105,214,192]),
      h('Una forma clara de decirlo'),P('“La demostración nos da una base visual y funcional. Podemos configurar tu identidad y datos. Si tus reglas o sistemas son distintos, los documentamos y estimamos antes de construirlos.”'),
      h('Evita el alcance abierto'),P('No ofrezcas cambios ilimitados. Indica cuántas revisiones están incluidas, qué se considera ajuste menor y cómo se cotizan nuevas funciones. Una solicitud nueva puede cambiar el plazo y la inversión.')])
    pages.append(title('Manual de campo / 05','La propuesta que puedes defender.','Estos puntos convierten una conversación en un trabajo revisable.')+[
      table(['Elemento','Qué debe quedar escrito'],[['Objetivo','Problema, usuario y resultado esperado.'],['Entregables','Pantallas, funciones, documentos e integraciones concretas.'],['Exclusiones','Lo que no está incluido: ejemplo, facturación o mensajes automáticos.'],['Contenido y accesos','Qué entrega el cliente y quién tiene la titularidad.'],['Etapas y fechas','Dependencias, revisión y criterios para mover una fecha.'],['Inversión','Precio del alcance y esquema de pago acordado.'],['Costos externos','Alojamiento, dominio, herramientas, pauta, equipos y renovaciones.'],['Revisiones','Cantidad de ajustes menores y proceso de cambios.'],['Aceptación','Escenarios que deben funcionar para dar la entrega por válida.'],['Acompañamiento','Capacitación, soporte y mantenimiento definidos.']],[149,362]),
      h('Ejemplo de aceptación'),P('“Un usuario autorizado puede crear una cotización con dos conceptos, aplicar el descuento permitido, descargar el documento y recuperar la cotización después de iniciar sesión en otro equipo.”'),
      P('Ese escenario requiere un sistema privado conectado. La demo pública demuestra cálculo y documento, pero no acredita el acceso desde otro equipo.',9,False,MUTED)])
    pages.append(title('Manual de campo / 06','De los ejemplos a los datos reales.','Prepara una entrega con permisos y recuperación, no solo una pantalla atractiva.')+[
      diagram([('Preparar','Datos autorizados|y muestra'),('Aislar','Cuenta y datos|del cliente'),('Validar','Pruebas y|restauración'),('Entregar','Accesos y|capacitación')]),
      bullets(['Acordar qué datos se necesitan y cuáles no deben recopilarse.','Usar cuentas del negocio para dominio, servicios y proveedores cuando corresponda.','Separar los datos y accesos de cada cliente; validar permisos desde el servidor.','Importar una muestra y conciliarla antes de una migración completa.','Definir respaldos, retención y una prueba de restauración.','Probar errores, accesos sin permiso, duplicados y operaciones simultáneas.','Confirmar privacidad y tratamiento de datos del proyecto con el responsable correspondiente.','Entregar instrucciones y un canal de soporte con condiciones claras.']),
      P('El almacenamiento local público no es una base de datos compartida. No prometas disponibilidad permanente, respaldo automático o seguridad absoluta.',10,True)])
    pages.append(title('Manual de campo / 07','Criterios por tipo de servicio.','Confirma qué se va a comprobar antes de aceptar la entrega.')+[
      table(['Servicio','Validación concreta'],[['Web e identidad','Contenido autorizado, enlaces, formulario, celular y archivos finales.'],['Comercio','Precios, existencias, pedido, pago de prueba y manejo de fallos.'],['Agenda','Horarios, solapamientos, cancelación y confirmación.'],['Datos y paneles','Totales conciliados, filtros, permisos, exportación y recuperación.'],['Redes y Wi-Fi','Plano acordado, zonas medidas, configuración documentada y acceso protegido.'],['Marketing','Piezas aprobadas, calendario, destino de contactos y métricas definidas.'],['Móvil','Dispositivos acordados, permisos, conectividad y distribución.'],['Escritorio','Sistemas operativos, instalador, archivos y actualizaciones.'],['Soporte','Responsable, prioridades, canal, horario y tiempos acordados.']],[144,367]),
      h('Costos que debes identificar'),P('Equipos, cableado, anuncios, licencias, dominio, alojamiento, cuentas de tiendas, comisiones de pago y servicios de mensajería pueden ser externos. Confirma precios y condiciones al preparar cada propuesta.'),
      P('No publiques resultados inventados. Conserva evidencia autorizada del antes, el recorrido y la entrega para convertir un proyecto real en un caso de portafolio.',10,True)])
    pages.append(title('Manual de campo / 08','Tu rutina para crecer con orden.','Vender, entregar y aprender forman parte del mismo trabajo.')+[
      table(['Momento','Acción'],[['Antes de una visita','Restaurar ejemplos, probar QR, revisar contacto y preparar una demo.'],['Después de la visita','Anotar problema, responsable, prioridad y siguiente acuerdo.'],['Antes de cotizar','Validar datos, proveedores, alcance y riesgos concretos.'],['Antes de publicar','Pruebas, permisos, documento de entrega y aprobación del contenido.'],['Después de entregar','Comprobar funcionamiento, capacitar y registrar pendientes acordados.'],['En mantenimiento','Revisar enlaces, dependencias, respaldos, vencimientos y solicitudes.']],[164,347]),
      h('Registro mínimo de una oportunidad'),P('Negocio / contacto autorizado / problema / proceso actual / demo mostrada / decisión pendiente / próxima acción y fecha. Guarda esa información en un sistema privado, no en la demo pública.'),
      h('Qué estudiar después'),bullets(['Una implementación privada completa de un producto, con acceso y datos aislados.','Pruebas de concurrencia y recuperación de datos.','Una integración real con un proveedor y manejo de fallos.','Un caso de estudio con evidencia autorizada y resultados medidos.']),
      P('El portafolio ya incluye tu foto real y tu método de trabajo. Sigue ampliándolo con evidencia autorizada de cada entrega y con una explicación clara de tu participación.',9,False,MUTED)])
    pages.append(title('Manual de campo / 09','Ficha de descubrimiento.','Imprime esta hoja para cada prospecto. Anota únicamente los datos necesarios y autorizados.')+[
      table(['Dato','Notas de la conversación'],[['Negocio y fecha','\n'],['Persona y canal autorizado','\n'],['Proceso que quiere mejorar','\n\n'],['Cómo se realiza hoy','\n\n'],['Frecuencia y consecuencia del problema','\n\n'],['Personas que utilizarían la herramienta','\n'],['Demo y recorrido mostrado','\n'],['Resultado que permitiría aceptar el proyecto','\n\n'],['Quién decide y qué necesita revisar','\n'],['Siguiente acción y fecha acordada','\n']],[205,306]),
      P('Al regresar, traslada la información a tu sistema privado. Esta ficha no autoriza mensajes promocionales ni compromete precio o fecha de entrega.',9,False,MUTED)])
    pages.append(title('Manual de campo / 10','Registro de entrega y continuidad.','Una hoja de trabajo para comprobar lo acordado y documentar lo que sigue. No sustituye el contrato ni la aceptación formal.')+[
      table(['Proyecto','Completar antes de entregar'],[['Negocio / responsable / fecha','\n'],['Versión y alcance revisados','\n'],['Escenarios de aceptación comprobados','\n\n'],['Contenido y datos aprobados por','\n'],['Titularidad y entrega de accesos','\n'],['Último respaldo y prueba de restauración','\n'],['Capacitación y material entregado','\n'],['Pendientes, responsable y fecha','\n\n'],['Soporte: canal, horario y condiciones','\n'],['Renovaciones y costos externos','\n'],['Próxima revisión acordada','\n']],[205,306]),
      note('<b>Antes de cerrar:</b> comprueba el dominio real, un teléfono, los enlaces y el recorrido principal. Registra los pendientes explícitamente; un despliegue correcto no demuestra por sí solo que el negocio pueda operar.')])
    pages=[[x for item in items for x in (item if isinstance(item,list) else [item])] for items in pages]
    build('altum-manual-comercial-operativo.pdf','Manual comercial y de entrega',pages)

def card():
    # 90 x 55 mm vector master, rendered later at 600 dpi for a clean print-ready PNG.
    from reportlab.lib.units import mm
    w,h=90*mm,55*mm
    c=canvas.Canvas(str(ROOT/'tmp/pdfs/altum-tarjeta-master.pdf'),pagesize=(w,h))
    c.setFillColor(NAVY);c.rect(0,0,w,h,stroke=0,fill=1)
    c.setStrokeColor(HexColor('#244972'))
    for x,y,r in [(195,88,62),(192,85,50),(193,84,39)]:c.circle(x,y,r,stroke=1,fill=0)
    c.setFillColor(CYAN);c.circle(228,137,2,stroke=0,fill=1)
    c.drawImage(str(ROOT/'public/assets/logo-altum-symbol-transparent.png'),15,h-36,width=40,height=22,mask='auto')
    c.setFillColor(white);c.setFont('Bold',16);c.drawString(62,h-24,'ALTUM');c.setFont('Body',5.8);c.drawString(63,h-34,'SOLUCIONES DIGITALES')
    c.setFont('Bold',12);c.drawString(16,91,'Ideas que toman forma.')
    c.setFillColor(HexColor('#b5cbe3'));c.setFont('Body',7);c.drawString(16,75,'Web · Aplicaciones · Redes');c.drawString(16,63,'Identidad y presencia digital')
    c.setFillColor(white);c.setFont('Bold',7.8);c.drawString(16,42,'+52 612 212 5198');c.setFont('Body',7);c.drawString(16,29,'www.altumlapaz.com');c.setFont('Body',6);c.drawString(16,17,'La Paz, BCS · @altumlapaz')
    c.setFillColor(white);c.roundRect(w-92,34,78,78,5,stroke=0,fill=1);renderPDF.draw(qr(DATA['site']['origin']+'/demos/',76),c,w-91,35)
    c.setFillColor(HexColor('#b5cbe3'));c.setFont('Body',6);c.drawCentredString(w-53,22,'ESCANEA Y PRUEBA')
    c.save()

if __name__=='__main__': sales();study();operations()
