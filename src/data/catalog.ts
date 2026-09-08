export const site = {
  name: 'Altum',
  origin: 'https://www.altumlapaz.com',
  phone: '+52 612 212 5198',
  whatsapp: 'https://wa.me/526122125198',
  github: 'https://github.com/Ozzy-Barbosa',
  location: 'La Paz, Baja California Sur',
};
export const solutions = [
  {
    slug: 'menu',
    name: 'Altum Menú',
    label: 'Menús digitales',
    category: 'Alimentos',
    icon: 'utensils',
    color: '#f6b66b',
    headline: 'Tu menú, siempre al día.',
    description:
      'Una carta digital que tus clientes consultan desde un QR. Actualiza productos y precios sin volver a imprimir.',
    audience: 'Restaurantes, cafeterías, bares y negocios de alimentos.',
    features: [
      'Categorías y búsqueda de platillos',
      'Carrito con resumen de pedido',
      'Precios y disponibilidad editables',
      'Carta preparada para compartir con QR',
    ],
    demo: 'Explora la carta, agrega productos y prepara un pedido de ejemplo.',
    boundary:
      'La demo simula pedidos. La recepción en cocina, el reparto y los pagos se cotizan según el negocio.',
    next: ['Panel de cocina', 'Pedidos por mesa', 'Variantes y extras'],
  },
  {
    slug: 'agenda',
    name: 'Altum Agenda',
    label: 'Agenda de servicios',
    category: 'Servicios',
    icon: 'calendar',
    color: '#b6a4ff',
    headline: 'Menos mensajes. Más organización.',
    description:
      'Presenta tus servicios y permite elegir fecha, profesional y horario en un solo recorrido.',
    audience: 'Barberías, estudios, salones y profesionales que trabajan con citas.',
    features: [
      'Catálogo con duración y precio',
      'Horarios por profesional',
      'Reservas y cancelaciones',
      'Panel de ocupación',
    ],
    demo: 'Elige un servicio y reserva un horario de demostración. Después consulta o cancela tu cita.',
    boundary:
      'No se envían recordatorios ni se cobran anticipos en esta demo. Los horarios son ficticios.',
    next: ['Recordatorios', 'Anticipos', 'Varias sucursales'],
  },
  {
    slug: 'inventario',
    name: 'Altum Inventario',
    label: 'Control de inventario',
    category: 'Operación',
    icon: 'boxes',
    color: '#65d9b5',
    headline: 'Cada producto, bajo control.',
    description:
      'Consulta existencias, registra movimientos y detecta qué productos necesitan reposición.',
    audience: 'Comercios, almacenes pequeños y negocios que administran productos.',
    features: [
      'Alta, edición y baja de productos',
      'Entradas y salidas con historial',
      'Alertas de existencias mínimas',
      'Exportación y resumen del inventario',
    ],
    demo: 'Agrega un producto, registra una entrada o salida y observa cómo cambian los indicadores.',
    boundary:
      'Los datos son de ejemplo. Lotes, caducidades y facturación requieren un alcance adicional.',
    next: ['Proveedores y compras', 'Almacenes', 'Lotes y caducidades'],
  },
  {
    slug: 'commerce',
    name: 'Altum Commerce',
    label: 'Tiendas en línea',
    category: 'Comercio',
    icon: 'shopping-bag',
    color: '#80c9ff',
    headline: 'De descubrirlo a pedirlo.',
    description:
      'Una experiencia de compra con catálogo, carrito y seguimiento de pedidos para tu marca.',
    audience: 'Marcas y comercios que quieren vender productos en línea.',
    features: [
      'Catálogo y filtros',
      'Carrito y cálculo de envío de ejemplo',
      'Confirmación de compra simulada',
      'Historial de pedidos',
    ],
    demo: 'Recorre una tienda de muestra y completa una compra simulada, sin tarjeta ni cobro.',
    boundary:
      'La demo no procesa pagos ni envíos reales. La tienda de un cliente se integra a sus proveedores y políticas.',
    next: ['Pasarela de pago', 'Envíos', 'Devoluciones'],
  },
  {
    slug: 'proyectos',
    name: 'Altum Proyectos',
    label: 'Portal de proyectos',
    category: 'Operación',
    icon: 'kanban',
    color: '#f2b2cf',
    headline: 'El siguiente paso, claro para todos.',
    description:
      'Organiza entregables, responsables y fechas en un tablero que muestra el avance del trabajo.',
    audience: 'Agencias, constructoras, estudios y equipos que coordinan proyectos.',
    features: [
      'Tablero por estado',
      'Tareas con responsable y fecha',
      'Edición y eliminación',
      'Avance y filtro por proyecto',
    ],
    demo: 'Crea una tarea, asigna una fecha y muévela entre pendientes, en proceso y terminadas.',
    boundary:
      'La demo representa un equipo ficticio. Los portales privados y permisos por cliente se configuran en la implementación.',
    next: ['Archivos y aprobaciones', 'Acceso por cliente', 'Comentarios'],
  },
  {
    slug: 'search',
    name: 'Altum Search',
    label: 'Búsqueda de información',
    category: 'Información',
    icon: 'search',
    color: '#96b8ff',
    headline: 'Encuentra lo que necesitas.',
    description:
      'Un buscador que reúne documentos y respuestas del negocio con filtros y resultados relevantes.',
    audience: 'Negocios con catálogos, manuales, políticas o documentación frecuente.',
    features: [
      'Búsqueda por palabras',
      'Resultados ordenados por relevancia',
      'Filtros por categoría',
      'Biblioteca editable de documentos',
    ],
    demo: 'Busca una política o servicio, abre su contenido y agrega un documento a tu biblioteca de ejemplo.',
    boundary:
      'Es búsqueda de texto sobre documentos de muestra. No utiliza IA ni consulta información privada de otros negocios.',
    next: ['Fuentes externas', 'Búsqueda semántica', 'Permisos por documento'],
  },
  {
    slug: 'finanzas',
    name: 'Altum Finanzas',
    label: 'Finanzas del negocio',
    category: 'Finanzas',
    icon: 'chart',
    color: '#7ddfc2',
    headline: 'Entiende a dónde va tu dinero.',
    description:
      'Un panel de ingresos, gastos y presupuestos para entender el flujo de tu negocio mes a mes.',
    audience: 'Profesionales, comercios y pequeños negocios que quieren ordenar sus números.',
    features: [
      'Registro y edición de ingresos y gastos',
      'Reporte mensual y flujo neto',
      'Presupuestos con alertas por categoría',
      'Búsqueda y exportación de movimientos',
    ],
    demo: 'Registra un gasto y observa su efecto en el flujo neto y el presupuesto de la categoría.',
    boundary:
      'La demo no conecta bancos ni calcula impuestos. No sustituye un sistema contable ni asesoría profesional.',
    next: ['Cuentas por cobrar', 'Conciliación de movimientos', 'Permisos por responsable'],
  },
  {
    slug: 'crm',
    name: 'Altum Clientes',
    label: 'Ventas y clientes',
    category: 'Comercio',
    icon: 'users',
    color: '#e9bc7f',
    headline: 'Ninguna oportunidad olvidada.',
    description:
      'Organiza prospectos, etapas comerciales y próximos seguimientos para dar continuidad a cada conversación.',
    audience: 'Negocios de servicios, vendedores y equipos que atienden oportunidades comerciales.',
    features: [
      'Cartera editable de oportunidades',
      'Etapas del proceso de venta',
      'Fechas y notas de seguimiento',
      'Valor potencial y exportación de cartera',
    ],
    demo: 'Agrega un prospecto, programa su seguimiento y actualiza su etapa en el proceso comercial.',
    boundary:
      'La demo no envía mensajes ni sincroniza contactos reales. El valor potencial no representa ingresos cobrados.',
    next: ['Recordatorios', 'Historial de conversaciones', 'Asignación por vendedor'],
  },
  {
    slug: 'cotizaciones',
    name: 'Altum Cotiza',
    label: 'Cotizaciones digitales',
    category: 'Comercio',
    icon: 'file',
    color: '#bdacff',
    headline: 'Presenta tu propuesta con claridad.',
    description:
      'Crea presupuestos con conceptos, cantidades y descuentos, y prepara un documento que puedas presentar.',
    audience: 'Técnicos, talleres, estudios y profesionales que cotizan productos o servicios.',
    features: [
      'Conceptos y totales calculados',
      'Descuentos y vigencia de propuesta',
      'Duplicación y seguimiento de estados',
      'Documento imprimible y exportación',
    ],
    demo: 'Crea una cotización, agrega conceptos, revisa el total y abre su vista lista para imprimir.',
    boundary:
      'Es un presupuesto de ejemplo sin cálculo de impuestos. No genera facturas fiscales ni envíos al cliente.',
    next: ['Aceptación por cliente', 'Catálogo de conceptos', 'Conversión a orden de trabajo'],
  },
  {
    slug: 'servicios',
    name: 'Altum Servicio',
    label: 'Órdenes de servicio',
    category: 'Servicios',
    icon: 'tool',
    color: '#87caff',
    headline: 'Cada servicio, de principio a fin.',
    description:
      'Recibe equipos o solicitudes, asigna responsables y lleva un historial del trabajo hasta la entrega.',
    audience: 'Talleres, instaladores y negocios de reparación o mantenimiento.',
    features: [
      'Alta y edición de órdenes con folio',
      'Responsable, fecha y prioridad',
      'Etapas con historial de avances',
      'Búsqueda y exportación de servicios',
    ],
    demo: 'Abre una orden, registra un cambio de estado con una nota y consulta su historial.',
    boundary:
      'La demo no envía avisos ni ofrece un portal público de seguimiento. Los equipos y clientes son ficticios.',
    next: ['Evidencias fotográficas', 'Seguimiento por cliente', 'Mantenimiento recurrente'],
  },
  {
    slug: 'personal',
    name: 'Altum Metas',
    label: 'Finanzas personales',
    category: 'Finanzas',
    icon: 'target',
    color: '#80dcc3',
    headline: 'Tus metas, con un plan.',
    description:
      'Organiza un presupuesto mensual y visualiza el avance de tus metas de ahorro con aportaciones de ejemplo.',
    audience:
      'Personas, profesionales independientes y hogares que quieren ordenar su presupuesto.',
    features: [
      'Plan mensual de ingresos y gastos',
      'Metas con fecha e importe objetivo',
      'Registro de aportaciones y avance',
      'Proyección simple y exportación',
    ],
    demo: 'Ajusta el presupuesto, crea una meta y registra una aportación para ver cómo cambia el avance.',
    boundary:
      'Es una herramienta de organización con datos ficticios. No conecta bancos, invierte ni recomienda productos financieros.',
    next: ['Historial mensual', 'Categorías personalizadas', 'Acceso privado por persona'],
  },
  {
    slug: 'soporte',
    name: 'Altum Soporte',
    label: 'Mesa de ayuda',
    category: 'Servicios',
    icon: 'headset',
    color: '#9cb8ff',
    headline: 'Cada solicitud, con seguimiento.',
    description:
      'Centraliza incidencias, asigna responsables y registra respuestas para que cada solicitud tenga continuidad.',
    audience: 'Negocios con soporte técnico, oficinas, proveedores de redes y equipos de atención.',
    features: [
      'Tickets por categoría y prioridad',
      'Asignación y fecha objetivo',
      'Historial de respuestas',
      'Panel de pendientes y exportación',
    ],
    demo: 'Registra una incidencia de Wi-Fi, asigna a un responsable y añade una respuesta hasta resolverla.',
    boundary:
      'La demo no envía correos, monitorea routers ni abre solicitudes reales. Los tiempos objetivo son datos del ejemplo, no un compromiso de atención.',
    next: [
      'Portal privado del cliente',
      'Notificaciones autorizadas',
      'Integración con monitoreo de red',
    ],
  },
];
export const projects = [
  {
    slug: 'orthomax',
    name: 'Orthomax',
    sector: 'Salud',
    status: 'Publicado',
    image: 'project-ortomax.jpg',
    url: 'https://orthomaxlapaz.com/',
    intro: 'Información clara para acercar un centro odontológico a sus pacientes.',
    challenge:
      'Organizar la información del consultorio y facilitar el contacto desde cualquier pantalla.',
    work: [
      'Jerarquía de servicios y contenido',
      'Diseño adaptable a móvil',
      'Recorridos hacia información y contacto',
    ],
    role: 'Diseño de experiencia y desarrollo web',
    result:
      'Un sitio que reúne la presentación del consultorio, sus servicios y sus vías de contacto.',
    tags: ['Diseño web', 'Experiencia de usuario', 'Desarrollo'],
  },
  {
    slug: 'conchalito-tours',
    name: 'Conchalito Tours',
    sector: 'Turismo',
    status: 'Publicado',
    image: 'project-conchalito-tours.jpg',
    url: 'https://conchalitotours.com/',
    intro: 'Una experiencia digital para descubrir actividades en el Mar de Cortés.',
    challenge:
      'Presentar experiencias turísticas con claridad y facilitar el paso de la exploración a una consulta de reserva.',
    work: [
      'Presentación visual de experiencias',
      'Organización de rutas y consultas',
      'Experiencia adaptable y bilingüe',
    ],
    role: 'Diseño y desarrollo web',
    result:
      'Una presentación visual de la oferta turística con acceso directo al sitio de la marca.',
    tags: ['Turismo', 'Diseño web', 'Responsive'],
  },
  {
    slug: 'alexa-lara',
    name: 'Alexa Lara Fotografía',
    sector: 'Fotografía',
    status: 'En desarrollo',
    image: 'project-alexa-lara.jpg',
    url: '',
    intro: 'Un portafolio editorial que da espacio a las imágenes y a cada historia.',
    challenge:
      'Crear una presentación donde el trabajo fotográfico sea el centro de la experiencia.',
    work: [
      'Dirección visual editorial',
      'Organización del portafolio',
      'Adaptación a distintos tamaños de pantalla',
    ],
    role: 'Dirección visual y desarrollo web',
    result:
      'Vista previa de un proyecto en desarrollo. El sitio final todavía no se presenta como publicado.',
    tags: ['Portafolio', 'Dirección visual', 'Responsive'],
  },
  {
    slug: 'proyectcons',
    name: 'Proyectcons',
    sector: 'Construcción',
    status: 'En desarrollo',
    image: 'project-proyectcons.jpg',
    url: '',
    intro:
      'Una presencia digital estructurada para presentar proyectos y servicios de construcción.',
    challenge:
      'Comunicar la actividad de la empresa con una estructura clara y una presentación visual consistente.',
    work: [
      'Arquitectura de información',
      'Presentación de proyectos',
      'Diseño y desarrollo adaptable',
    ],
    role: 'Diseño de experiencia y desarrollo web',
    result:
      'Vista previa de un sitio en desarrollo. Se publicará su alcance final cuando esté terminado.',
    tags: ['Construcción', 'Diseño web', 'Desarrollo'],
  },
];
export const services = [
  {
    slug: 'paginas-web-la-paz',
    name: 'Páginas web en La Paz',
    short: 'Diseño web',
    intro: 'Una página que explique tu negocio y facilite el siguiente paso.',
    text: 'Diseñamos y desarrollamos páginas web para negocios en La Paz, Baja California Sur. Organizamos tus servicios, tu identidad y tus medios de contacto en una experiencia clara para quien te visita desde el celular o la computadora.',
    problem:
      'Cuando tus clientes encuentran información dispersa, cuesta entender qué ofreces y cómo contratarte. Un sitio propio reúne lo esencial y te permite compartir una dirección que representa a tu negocio.',
    deliverables: [
      'Diseño adaptado a tu identidad',
      'Páginas de servicios y contacto',
      'Optimización de imágenes y experiencia móvil',
      'Metadatos, estructura semántica y mapa del sitio',
      'Publicación en tu dominio y guía de uso',
    ],
    demo: 'menu',
    faq: [
      [
        '¿Puedo usar mi dominio actual?',
        'Sí. Revisamos dónde está registrado y dónde se aloja tu sitio para planear la publicación conservando tu dominio.',
      ],
      [
        '¿Qué información necesito preparar?',
        'Logo, servicios confirmados, fotografías que puedas usar, medios de contacto y objetivos del sitio. Te ayudamos a organizar ese material.',
      ],
      [
        '¿Incluye mantenimiento?',
        'Definimos por separado qué acompañamiento, actualizaciones y alojamiento necesitas después de publicar.',
      ],
    ],
  },
  {
    slug: 'tiendas-en-linea-la-paz',
    name: 'Tiendas en línea en La Paz',
    short: 'Comercio electrónico',
    intro: 'Un recorrido de compra pensado para tus productos.',
    text: 'Creamos catálogos y tiendas en línea para comercios de La Paz. Definimos contigo cómo se eligen los productos, cómo se recibe un pedido y qué opciones de pago y entrega necesita tu operación.',
    problem:
      'Una tienda necesita más que fotografías: requiere precios claros, disponibilidad y una forma confiable de completar cada pedido. Empezamos por tu proceso de venta y construimos alrededor de él.',
    deliverables: [
      'Catálogo con categorías y variantes',
      'Carrito y proceso de compra',
      'Administración de productos y pedidos',
      'Integraciones de pago y envío según alcance',
      'Capacitación para operar la tienda',
    ],
    demo: 'commerce',
    faq: [
      [
        '¿Puede comenzar como catálogo por WhatsApp?',
        'Sí. Podemos iniciar con consulta y solicitud de pedidos, y ampliar el sistema cuando necesites pagos dentro de la tienda.',
      ],
      [
        '¿Quién recibe los pagos?',
        'El negocio utiliza su propia cuenta con el proveedor de pagos acordado. Sus comisiones se revisan antes de la integración.',
      ],
      [
        '¿La demo cobra dinero?',
        'No. La compra demostrativa es una simulación y no solicita tarjetas.',
      ],
    ],
  },
  {
    slug: 'desarrollo-aplicaciones-la-paz',
    name: 'Desarrollo de aplicaciones web en La Paz',
    short: 'Aplicaciones y software',
    intro: 'Software que acompaña la forma en que trabajas.',
    text: 'Desarrollamos aplicaciones web y sistemas a medida para negocios en La Paz, BCS. Convertimos procesos como citas, inventario y seguimiento de proyectos en herramientas que tu equipo puede utilizar desde el navegador.',
    problem:
      'Cuando una operación depende de archivos separados y mensajes, es difícil saber qué está pendiente y quién tiene la información. Diseñamos un flujo compartido con reglas y permisos adecuados.',
    deliverables: [
      'Definición del proceso y alcance',
      'Interfaz y panel de administración',
      'Base de datos y permisos',
      'Validaciones y pruebas de recorridos críticos',
      'Documentación y publicación',
    ],
    demo: 'proyectos',
    faq: [
      [
        '¿Necesito instalar una aplicación?',
        'Las aplicaciones web se utilizan desde un navegador. Revisamos si tu proceso también requiere capacidades sin conexión o una aplicación nativa.',
      ],
      [
        '¿Se puede conectar con otro sistema?',
        'Primero comprobamos si el proveedor ofrece una API o exportaciones compatibles. La integración se estima con esa información.',
      ],
      [
        '¿Puedo empezar con pocas funciones?',
        'Sí. Priorizamos un proceso completo y útil, y después incorporamos nuevas funciones con un alcance definido.',
      ],
    ],
  },
  {
    slug: 'menus-digitales-la-paz',
    name: 'Menús digitales para restaurantes en La Paz',
    short: 'Menús con QR',
    intro: 'Tu carta disponible desde el celular de cada cliente.',
    text: 'Creamos menús digitales para restaurantes, cafeterías y negocios de alimentos en La Paz. Tus categorías, platillos y precios se consultan desde un enlace o un código QR que puedes colocar en tus mesas.',
    problem:
      'Imprimir una carta nueva por cada cambio de precio cuesta tiempo. Un menú digital permite mantener la información organizada y ampliar después hacia pedidos si tu negocio lo necesita.',
    deliverables: [
      'Carta por categorías',
      'Precios y disponibilidad',
      'Diseño con la identidad del restaurante',
      'Acceso desde QR y enlace',
      'Administración y acompañamiento inicial',
    ],
    demo: 'menu',
    faq: [
      [
        '¿El cliente necesita descargar algo?',
        'No. Abre el enlace desde el navegador de su celular.',
      ],
      [
        '¿Puedo cambiar mis precios?',
        'La implementación puede incluir un panel para que el negocio actualice productos y disponibilidad.',
      ],
      [
        '¿Se pueden recibir pedidos?',
        'Sí, como parte del alcance acordado. La demo permite armar un pedido de ejemplo.',
      ],
    ],
  },
  {
    slug: 'sistemas-reservas-la-paz',
    name: 'Sistemas de citas y reservas en La Paz',
    short: 'Agendas y reservas',
    intro: 'Servicios, horarios y citas en un mismo lugar.',
    text: 'Diseñamos agendas en línea para negocios de servicios en La Paz. Tus clientes pueden consultar opciones y elegir horarios según la disponibilidad definida para cada profesional.',
    problem:
      'Coordinar una cita requiere considerar duración, disponibilidad y cambios. Una agenda centraliza esos pasos y permite consultar qué está reservado.',
    deliverables: [
      'Catálogo de servicios y duración',
      'Calendario de disponibilidad',
      'Reserva y cancelación',
      'Panel de citas',
      'Reglas por profesional',
    ],
    demo: 'agenda',
    faq: [
      [
        '¿Se pueden evitar citas duplicadas?',
        'Sí. En un sistema conectado, las reglas de disponibilidad se validan también en la base de datos.',
      ],
      [
        '¿Incluye recordatorios?',
        'Podemos integrar recordatorios. El canal y su costo se definen según el servicio elegido.',
      ],
      [
        '¿Funciona para varios profesionales?',
        'Sí. La disponibilidad se organiza por profesional y servicio.',
      ],
    ],
  },
  {
    slug: 'dashboards-inventario-la-paz',
    name: 'Dashboards y control de inventario en La Paz',
    short: 'Datos e inventario',
    intro: 'Información clara para decidir qué sigue.',
    text: 'Construimos paneles y sistemas de inventario para negocios en La Paz. Partimos de tus registros y de las decisiones que necesitas tomar para definir indicadores comprensibles y operaciones controladas.',
    problem:
      'Un indicador resulta útil cuando puedes consultar los registros que lo explican. Conectamos el resumen con el detalle para revisar existencias, movimientos y trabajo pendiente.',
    deliverables: [
      'Indicadores definidos con el negocio',
      'Búsqueda, filtros y detalle',
      'Registros de movimientos',
      'Importación o exportación según alcance',
      'Permisos para el equipo',
    ],
    demo: 'inventario',
    faq: [
      [
        '¿Qué tipos de dashboard se pueden crear?',
        'Finanzas, ventas, inventario, operación y seguimiento de proyectos, entre otros. Cada panel se diseña alrededor de una decisión concreta.',
      ],
      [
        '¿Pueden usar mis archivos actuales?',
        'Revisamos su estructura y calidad para preparar una importación, cuando el formato lo permita.',
      ],
      [
        '¿Los números de la demo son reales?',
        'No. Se calculan sobre registros ficticios para mostrar cómo funciona la herramienta.',
      ],
    ],
  },
  {
    slug: 'redes-wifi-la-paz',
    name: 'Redes y Wi-Fi para negocios en La Paz',
    short: 'Redes y Wi-Fi',
    intro: 'Conecta mejor cada espacio.',
    text: 'Diagnóstico de cobertura, diseño de red y configuración de routers y puntos de acceso para negocios y oficinas.',
    problem:
      'Una señal débil o una red sin organización interrumpe cobros, trabajo y atención. Revisamos el espacio, los equipos y la conexión antes de proponer mejoras.',
    deliverables: [
      'Diagnóstico de cobertura y necesidades',
      'Propuesta de distribución y equipos',
      'Configuración de routers y puntos de acceso',
      'Separación de red de invitados cuando el equipo lo permite',
      'Pruebas de cobertura y documentación',
    ],
    demo: 'soporte',
    faq: [
      [
        '¿Incluye equipos y cableado?',
        'Equipos, materiales, cableado y obra se presupuestan por separado después del diagnóstico. El rendimiento también depende del proveedor de internet.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
  {
    slug: 'marketing-digital-la-paz',
    name: 'Marketing digital para negocios en La Paz',
    short: 'Marketing digital',
    intro: 'Una presencia que sabe qué comunicar.',
    text: 'Planeación de contenido, páginas para campañas y medición de contactos para conectar tu oferta con las personas adecuadas.',
    problem:
      'Publicar sin un objetivo hace difícil evaluar qué funciona. Definimos público, mensaje, canales y una forma de medir consultas o conversiones.',
    deliverables: [
      'Diagnóstico de presencia digital',
      'Calendario y líneas de contenido',
      'Diseño de piezas según alcance',
      'Página de campaña y contacto',
      'Medición y reporte de resultados',
    ],
    demo: 'crm',
    faq: [
      [
        '¿Incluye inversión en anuncios?',
        'La pauta, la producción audiovisual y las herramientas de terceros se acuerdan por separado. No prometemos cantidades de ventas o seguidores.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
  {
    slug: 'identidad-visual-la-paz',
    name: 'Identidad visual para negocios en La Paz',
    short: 'Identidad de negocio',
    intro: 'Que cada punto de contacto hable de ti.',
    text: 'Diseño de identidad visual y materiales digitales para presentar tu negocio de forma consistente.',
    problem:
      'Un logotipo aislado no define toda la experiencia. Acordamos cómo se verá tu marca en redes, documentos, tarjetas y sitio web.',
    deliverables: [
      'Exploración de objetivos y referencias',
      'Propuesta de logotipo según alcance',
      'Paleta, tipografías y usos básicos',
      'Plantillas para redes y documentos',
      'Archivos finales y guía de aplicación',
    ],
    demo: 'menu',
    faq: [
      [
        '¿Incluye registro de marca?',
        'La investigación y el registro legal de marca no están incluidos. Se define el número de propuestas y revisiones en la cotización.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
  {
    slug: 'bases-de-datos-la-paz',
    name: 'Bases de datos y automatización en La Paz',
    short: 'Bases de datos',
    intro: 'Información que tu equipo puede utilizar.',
    text: 'Diseño de datos, paneles de administración e integraciones para ordenar registros y reducir captura repetida.',
    problem:
      'Cuando existen varias versiones de un archivo, aparecen duplicados y errores. Definimos una estructura, reglas de validación y quién puede ver o modificar cada dato.',
    deliverables: [
      'Modelado de entidades y relaciones',
      'Validación y permisos por rol',
      'Importación de archivos acordados',
      'Consultas, reportes y exportaciones',
      'Plan de respaldos y recuperación',
    ],
    demo: 'inventario',
    faq: [
      [
        '¿Pueden migrar mis datos?',
        'Primero se revisan formato, calidad, cantidad y autorización de uso. La limpieza, conciliación y migración se estiman con una muestra.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
  {
    slug: 'aplicaciones-moviles-la-paz',
    name: 'Diseño de aplicaciones móviles en La Paz',
    short: 'Aplicaciones móviles',
    intro: 'Tu proceso, al alcance de la mano.',
    text: 'Diseño y planificación de aplicaciones móviles para servicios, equipos de campo y experiencias de clientes.',
    problem:
      'Antes de elegir una app, comprobamos qué capacidades necesita: cámara, uso sin conexión, notificaciones o distribución en tiendas. Un prototipo ayuda a validar el recorrido.',
    deliverables: [
      'Descubrimiento del caso de uso',
      'Diseño y prototipo de pantallas',
      'Definición de funciones y permisos',
      'Plan de conexión y sincronización',
      'Desarrollo por etapas según viabilidad',
    ],
    demo: 'agenda',
    faq: [
      [
        '¿La demo ya es una app publicada en tiendas?',
        'La referencia es una aplicación web. Una app móvil tiene su propio alcance de desarrollo, pruebas, cuentas de publicación y revisión de las tiendas.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
  {
    slug: 'aplicaciones-escritorio-la-paz',
    name: 'Aplicaciones de escritorio en La Paz',
    short: 'Aplicaciones de escritorio',
    intro: 'Herramientas para tu estación de trabajo.',
    text: 'Diseño y desarrollo por etapas de herramientas de escritorio para procesos internos, archivos y operación local.',
    problem:
      'Algunos procesos necesitan trabajar con archivos o dispositivos del equipo. Revisamos el sistema operativo, permisos y mantenimiento antes de definir una aplicación instalable.',
    deliverables: [
      'Análisis del proceso y sistemas compatibles',
      'Diseño de interfaz de operación',
      'Prototipo y desarrollo por etapas',
      'Integraciones locales según alcance',
      'Distribución, actualización y soporte definidos',
    ],
    demo: 'servicios',
    faq: [
      [
        '¿Funciona en cualquier equipo?',
        'La compatibilidad se acuerda y prueba por sistema operativo y periféricos. Instalación, firma y actualizaciones forman parte del alcance.',
      ],
      [
        '¿Cómo comienza el proyecto?',
        'Con una conversación y un diagnóstico. Después recibes un alcance, entregables, calendario y costos externos por escrito.',
      ],
    ],
  },
];
