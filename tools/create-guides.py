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
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
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
def title(k,t,sub): return [P(k.upper(),9,True,BLUE),P(t,28,True),P(sub,12,False,MUTED),Spacer(1,14)]
def h(t):
    heading=P(t,15,True);heading.style.spaceBefore=12;return heading
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
    c.setStrokeColor(LINE);c.line(42,44,W-42,44);c.setFillColor(MUTED);c.setFont('Body',8);c.drawString(42,28,'www.altumlapaz.com  |  La Paz, BCS  |  Septiembre 2026');c.drawRightString(W-42,28,f'{doc.page:02d}');c.restoreState()
def build(name,label,pages):
    doc=SimpleDocTemplate(str(OUT/name),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=100,bottomMargin=65,title=label,author='Altum Soluciones Digitales');doc.title_label=label
    story=[]
    for i,items in enumerate(pages):
        if i:story.append(PageBreak())
        story.extend(items)
    doc.build(story,onFirstPage=page,onLaterPages=page)
    print(name,len(pages),'planned pages')

def sales():
    pages=[]
    pages.append(title('Presentación para negocios','Tu negocio.<br/>Su siguiente gran versión.','Diseño, tecnología y herramientas para presentar mejor tu negocio, atender clientes y organizar tu operación.')+[
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
        Table([[Paragraph('<br/>'.join('• '+escape(f) for f in s['features']),ParagraphStyle('features',fontName='Body',fontSize=9,leading=14,textColor=MUTED)),qr(DATA['site']['origin']+'/demos/'+s['slug']+'/',88)]],colWidths=[410,101]),P('<b>Prueba:</b> '+escape(s['demo']),9),Spacer(1,18)]
      content += [P('Adaptamos identidad, contenido y reglas al alcance acordado. Datos ficticios: las demos no realizan cobros, reservas, envíos ni solicitudes reales.',8,False,MUTED)]
      pages.append(content)
    build('altum-presentacion-comercial.pdf','Presentación comercial',pages)
    shutil.copy2(OUT/'altum-presentacion-comercial.pdf',PUBLIC/'altum-presentacion-comercial.pdf')

def study():
    pages=[]
    pages.append(title('Guía de estudio / 01','Así está construido<br/>tu Altum.','Una guía para entenderlo, mantenerlo y explicarlo con tus propias palabras.')+[
      h('Qué construimos'),P('Altum reúne un sitio comercial, un portafolio profesional y un laboratorio de doce demos. El contenido público se genera con Astro. Las herramientas interactivas se construyen con React y guardan información ficticia en el navegador.'),
      diagram([('Contenido','Servicios|Proyectos|Fichas'),('Interacción','Demos|Formularios|Filtros'),('Presentación','Dominio|Documentos|Contacto')]),
      h('Cómo estudiar esta guía'),table(['Recorrido','Objetivo'],[['1. Páginas 2-3','Entender el mapa y las tecnologías.'],['2. Páginas 4-6','Seguir un dato, un componente y una publicación.'],['3. Páginas 7-9','Conocer límites, mantenimiento y crecimiento.'],['4. Página 10','Practicar una explicación y comprobar lo aprendido.']],[155,356]),
      P('Versión documentada: septiembre de 2026. Los números, dependencias y procesos corresponden al repositorio revisado para esta entrega.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 02','El mapa de páginas.','Una ruta es la dirección que identifica una página. Las páginas se agrupan por la intención del visitante.')+[
      diagram([('Conocer','Inicio|Servicios|Portafolio'),('Explorar','Soluciones|Especificaciones|Demos'),('Contactar','Preguntas|Tarjeta|Contacto')]),
      table(['Ruta o grupo','Qué contiene','Quién lo usa'],[['/','Presentación, átomo, tecnologías y accesos','Cualquier visitante'],['/servicios/','Índice y doce fichas de servicios','Un negocio que define su necesidad'],['/soluciones/','Catálogo y doce fichas explicativas','Un prospecto que compara herramientas'],['/demos/','Catálogo y doce aplicaciones web','Quien desea probar un recorrido'],['/proyectos/','Cuatro casos con su estado real','Prospectos y reclutadores'],['/portafolio/','Enfoque, tecnologías y trabajo','Empresas de tecnología'],['/como-esta-hecho/','Arquitectura pública de Altum','Quien desea conocer el proceso'],['/contacto/','Formulario que prepara un mensaje','Prospectos'],['Otras páginas','Preguntas, privacidad, presentación y tarjeta','Apoyo comercial y transparencia']],[113,220,178]),
      P('El catálogo de código crea automáticamente una ficha y una ruta de demo por solución. Una ruta nueva necesita también su implementación interactiva, no solo un nombre.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 03','Qué hace cada tecnología.','Una herramienta se elige por su función; agregar un logotipo no modifica la arquitectura.')+[
      table(['Tecnología','Papel en esta aplicación'],[['HTML y CSS','Estructura accesible, tamaños, color, distribución y adaptación a pantalla.'],['Astro','Genera las páginas y comparte plantillas. Entrega contenido HTML preparado.'],['React','Controla el estado y los recorridos de las demos. Cada módulo se carga bajo demanda.'],['TypeScript / JavaScript','Tipos, eventos, validaciones y reglas de funcionamiento.'],['Sass / SCSS','Preprocesa estilos reutilizables. El navegador recibe CSS, no ejecuta Sass.'],['SVG y Canvas','SVG dibuja iconos y órbitas; Canvas dibuja las constelaciones.'],['Node.js / npm','Instalan dependencias, ejecutan pruebas y construyen el sitio.'],['Git / GitHub / Actions','Historial de cambios, repositorio y publicación automatizada.'],['PostgreSQL / Supabase','Base preparada para módulos privados; el acceso público sigue siendo local.'],['Flutter / Tauri','Ecosistema previsto para proyectos móviles y de escritorio; no son el motor de esta web.']],[155,356]),
      P('Los iconos provienen de Simple Icons. Las fuentes y los recursos visuales se sirven desde Altum. La página de arquitectura distingue las tecnologías del sitio de las posibilidades de otros proyectos.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 04','Sigue un cambio de principio a fin.','Ejemplo: registrar una aportación de ahorro en Altum Metas.')+[
      diagram([('Formulario','Capturas|importe y fecha'),('Regla','Valida y calcula|un nuevo estado'),('Interfaz','Actualiza el|progreso visible'),('Guardado','Conserva el dato|en el navegador')]),
      table(['Paso','Qué sucede realmente'],[['1. Abrir la demo','Astro sirve la página y React activa el módulo PersonalDemo.'],['2. Capturar','El formulario recoge un importe, fecha y nota de ejemplo.'],['3. Validar','extended-domain comprueba importe positivo, fecha y pendiente de la meta.'],['4. Calcular','El dinero se convierte a centavos enteros para evitar errores decimales de cálculo.'],['5. Guardar','useDemo aplica la transición y demo-store guarda una versión local de los datos.'],['6. Volver','El mismo navegador recupera el ejemplo. Otro dispositivo no recibe esos cambios.']],[130,381]),
      h('Por qué hay varias capas'),P('La interfaz muestra y recoge información. Las reglas deciden qué es válido. El almacenamiento conserva el resultado. Separarlas facilita reutilizar el diseño y comprobar los cálculos sin depender de clicks.'),
      P('Ejercicio: agrega una aportación, recarga y observa el progreso. Después abre Privacidad y borra los datos de demostración. Al regresar se recuperan los ejemplos iniciales.',10,True)])
    pages.append(title('Guía de estudio / 05','Dónde vive cada pieza.','El código activo está en src/ y los recursos públicos en public/. Los archivos históricos de la landing no son la nueva aplicación.')+[
      table(['Carpeta o archivo','Qué cambiar allí'],[['src/pages/','Páginas, rutas y plantillas de fichas.'],['src/layouts/Layout.astro','Cabecera, navegación, pie, metadatos y scripts compartidos.'],['src/data/catalog.ts','Nombres, servicios, funciones, enlaces y casos.'],['src/data/specifications.ts','Problema, recorrido y caso cotidiano de cada solución.'],['src/components/','Tarjetas, iconos, tecnologías, constelaciones y átomo.'],['src/components/demos/','Pantallas y formularios de cada aplicación.'],['src/lib/*-domain.mjs','Cálculos y reglas de las operaciones.'],['src/lib/demo-store.ts','Almacenamiento local y base del acceso privado.'],['src/styles/','CSS general y evolution.scss para los nuevos efectos.'],['public/','Logos, imágenes, documentos comerciales y archivos públicos.'],['tests/ y tools/','Pruebas, verificación de páginas y generación de documentos.'],['database/ y docs/','Preparación de datos, decisiones y guía de implementación.']],[210,301]),
      P('La foto personal se puede sustituir en el bloque del portafolio cuando dispongas de ella. No se inventó una imagen ni una trayectoria profesional.',9,False,MUTED)])
    pages.append(title('Guía de estudio / 06','Cómo llega el código al dominio.','Publicar es convertir el proyecto en archivos que el visitante puede abrir.')+[
      diagram([('Modificar','Cambios en el|repositorio'),('Comprobar','Pruebas, tipos|y construcción'),('Publicar','Actions despliega|GitHub Pages'),('Verificar','Se abre el|dominio real')]),
      h('El flujo de esta entrega'),bullets(['Las dependencias y sus versiones quedan registradas en package.json y package-lock.json.','Las pruebas de reglas detectan errores en importes, estados, límites y operaciones.','Astro revisa los tipos y genera el directorio dist/.','La verificación revisa títulos, descripciones, enlaces, datos estructurados y códigos QR.','Un cambio subido a main ejecuta el flujo de GitHub Actions y publica el resultado.','El dominio www.altumlapaz.com muestra esa publicación. El dominio sin www redirige allí.']),
      h('Qué significa un fallo'),P('Si falla una comprobación, se corrige antes de publicar. Si el despliegue termina pero el navegador muestra algo viejo, primero se recarga y se comprueba la versión, los recursos y el dominio.'),
      P('Para revertir: crear un cambio que revierta el commit problemático, revisar y publicar. Evita borrar el historial o editar archivos generados dentro de dist/.',10,True)])
    pages.append(title('Guía de estudio / 07','Qué es demo y qué es producción.','Esta diferencia es la base de una propuesta honesta y de una entrega segura.')+[
      table(['Demos públicas','Sistema para un cliente'],[['Datos ficticios y locales','Datos reales con autorización y política definida'],['Sin registro público','Acceso privado, usuarios y permisos'],['Sin sincronización','Servidor y base de datos compartida'],['Pedidos y reservas simulados','Operaciones confirmadas por reglas del servidor'],['Cotización PDF de ejemplo','Documento configurado; facturación requiere integración específica'],['Sin conexión bancaria','Cualquier integración bancaria exige análisis y permisos'],['Sin envíos automáticos','Canales y avisos configurados con consentimiento'],['Restablecer repone ejemplos','Respaldo, restauración y retención de datos reales']],[255.5,255.5]),
      h('Supabase en esta base'),P('Existe una preparación privada con control por propietario para diez módulos. Metas y Soporte funcionan de forma local en esta entrega. Conectarlos requiere ampliar el esquema y validar permisos. El inicio de sesión anónimo sigue desactivado.'),
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
      P('La foto personal y cualquier acreditación se incorporan cuando sean reales y estén disponibles. Un portafolio sólido explica tu participación y permite comprobar lo que construiste.',9,False,MUTED)])
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

if __name__=='__main__': sales();study();operations();card()
